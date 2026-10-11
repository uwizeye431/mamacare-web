import { checkWHODangerSignals } from '../utils/dangerSignals';
import { INTENTS, UNSURE_RESPONSE, TriageLevel } from './intents';
import { IntentClassifier, LabeledExample, normalize } from './model';
import {
  ABUSE_RESPONSE_RW,
  LIFE_THREAT_RESPONSE_RW,
  RESPONSES_RW,
  UNSURE_RESPONSE_RW,
  dangerSignResponseRw,
} from './responsesRw';

export interface TriageResult {
  triage: TriageLevel;
  explanation: string;
  actions: string[];
  /** true when a hard-coded safety rule decided the result instead of the model */
  override: boolean;
  matchedSignal?: string;
  matchedKeyword?: string;
  intent?: string;
  confidence?: number;
}

// Below this the model is guessing; ask the user for more detail instead
export const MIN_CONFIDENCE = 0.3;
// Under-triage is the dangerous mistake: escalate when enough probability points to danger
export const RED_ESCALATION = 0.3;
export const YELLOW_ESCALATION = 0.4;

const ABUSE = /\b(fuck|shit|asshole|bitch|bastard|idiot|crap|wa\s+mbwa|nyoko|igitutsi|gupfa\s+ubusa)\b/i;
const LIFE_THREAT = /\b(ndenda\s+gupfa|ndapfa|ndagupfa|ndikupfa|dying|about\s+to\s+die|itabaza|gutabaza|tabara|emergency|umwana\s+yashizemo\s+umwuka)\b/i;
// Self-harm must never depend on the model getting it right
const SELF_HARM = /\b(kill\s+myself|end\s+my\s+life|suicid\w*|kwiyahura|nshaka\s+gupfa|hurt(ing)?\s+(myself|my\s+baby)|harm(ing)?\s+(myself|my\s+baby)|(dont|do\s+not)\s+want\s+to\s+live)\b/i;

export const trainingExamples = (): LabeledExample[] =>
  INTENTS.flatMap((intent, label) => intent.examples.map((text) => ({ text, label })));

export const trainClassifier = (examples: LabeledExample[] = trainingExamples()) => {
  const classifier = new IntentClassifier(INTENTS.length);
  classifier.train(examples);
  return classifier;
};

let classifier: IntentClassifier | null = null;
const getClassifier = () => (classifier ??= trainClassifier());

/** Train the model now (called at server startup) so the first request doesn't wait. */
export const warmUpTriageModel = () => {
  const started = Date.now();
  getClassifier();
  console.log(`Triage model: trained on ${trainingExamples().length} examples in ${Date.now() - started} ms.`);
};

/** Model-only prediction with the safety escalation rules applied (no keyword overrides). */
export const classify = (text: string, model: IntentClassifier = getClassifier()) => {
  const { probabilities, knownFeatures } = model.predict(text);

  const ranked = probabilities
    .map((p, i) => ({ intent: INTENTS[i], p }))
    .sort((a, b) => b.p - a.p);
  const levelProbability = (level: TriageLevel) =>
    ranked.filter((r) => r.intent.level === level).reduce((sum, r) => sum + r.p, 0);

  const top = ranked[0];
  if (knownFeatures === 0 || top.p < MIN_CONFIDENCE) {
    // Not sure what this is; but if it leans towards danger, still treat it as danger
    if (levelProbability('red') >= RED_ESCALATION) {
      return { ...ranked.find((r) => r.intent.level === 'red')!, unsure: false };
    }
    return { ...top, unsure: true };
  }

  if (top.intent.level !== 'red' && levelProbability('red') >= RED_ESCALATION) {
    return { ...ranked.find((r) => r.intent.level === 'red')!, unsure: false };
  }
  if (top.intent.level === 'green' && levelProbability('yellow') + levelProbability('red') >= YELLOW_ESCALATION) {
    return { ...ranked.find((r) => r.intent.level === 'yellow')!, unsure: false };
  }
  return { ...top, unsure: false };
};

export type TriageLanguage = 'en' | 'rw';

/**
 * Full triage pipeline: safety rules first, then the trained model.
 * The model understands English and Kinyarwanda input; `language` picks the language of the answer.
 */
export const analyzeSymptoms = (text: string, language: TriageLanguage = 'en'): TriageResult => {
  const normalized = normalize(text);
  const rw = language === 'rw';

  if (ABUSE.test(normalized)) {
    return {
      triage: 'green',
      ...(rw
        ? ABUSE_RESPONSE_RW
        : {
            explanation:
              'MamaCare is here to support mothers and babies. Please keep the conversation respectful so we can help you properly.',
            actions: ['Describe your symptoms or ask your pregnancy question politely.'],
          }),
      override: true,
    };
  }

  if (LIFE_THREAT.test(normalized)) {
    return {
      triage: 'red',
      ...(rw
        ? LIFE_THREAT_RESPONSE_RW
        : {
            explanation:
              'You said you are in life-threatening danger. This is an emergency and you need help right now.',
            actions: [
              'Call 912 for an ambulance immediately.',
              'Go to the emergency department of your nearest hospital.',
              'Tell your CHW and family nearby so they can help you get there.',
            ],
          }),
      override: true,
    };
  }

  if (SELF_HARM.test(normalized)) {
    return { triage: 'red', ...responseFor('danger_self_harm', language), override: true, matchedSignal: 'Self-harm risk' };
  }

  // WHO danger signs: never let the model talk us out of these
  const danger = checkWHODangerSignals(text);
  if (danger.isCritical) {
    return {
      triage: 'red',
      ...(rw
        ? dangerSignResponseRw(danger.signalName ?? '')
        : {
            explanation: `This may be a WHO pregnancy danger sign (${danger.signalName}). It needs to be checked by a health worker immediately.`,
            actions: [
              'Go to the nearest hospital or health centre now, or call 912 for an ambulance.',
              'Call your midwife or health provider on the way if you can.',
              'Tell your Community Health Worker (CHW) immediately.',
            ],
          }),
      override: true,
      matchedSignal: danger.signalName,
      matchedKeyword: danger.matchedKeyword,
    };
  }

  const result = classify(text);
  if (result.unsure) {
    return { triage: 'yellow', ...(rw ? UNSURE_RESPONSE_RW : UNSURE_RESPONSE), override: false, confidence: round(result.p) };
  }

  return {
    triage: result.intent.level,
    ...responseFor(result.intent.id, language),
    override: false,
    intent: result.intent.id,
    confidence: round(result.p),
  };
};

// The reviewed answer for an intent in the requested language (English if no translation exists)
const responseFor = (intentId: string, language: TriageLanguage) => {
  const intent = INTENTS.find((i) => i.id === intentId)!;
  return language === 'rw' && RESPONSES_RW[intentId] ? RESPONSES_RW[intentId] : intent.response;
};

const round = (p: number) => Math.round(p * 100) / 100;
