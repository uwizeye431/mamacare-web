// Evaluates the triage model. Run with: npm run triage:eval
//
// 1. Cross-validation: train on 4/5 of the examples, test on the other 1/5, five times.
// 2. Held-out phrasings: sentences written separately from the training data, run through
//    the full pipeline (safety rules + model), the way the API uses it.
//
// "Under-triage" (rating something as less urgent than it is) is the dangerous error,
// so it is reported separately and should stay at 0 for red cases.

import { INTENTS, TriageLevel } from './intents';
import { analyzeSymptoms, classify, trainClassifier, trainingExamples } from './index';

const RANK: Record<TriageLevel, number> = { green: 0, yellow: 1, red: 2 };
const FOLDS = 5;

const crossValidate = () => {
  const examples = trainingExamples();
  // Deterministic stratified split: every intent's examples are spread across all folds
  const fold = new Map<number, number>();
  const seen = new Map<number, number>();
  examples.forEach((ex, i) => {
    const k = seen.get(ex.label) ?? 0;
    seen.set(ex.label, k + 1);
    fold.set(i, k % FOLDS);
  });

  let intentHits = 0;
  let levelHits = 0;
  let underTriage = 0;
  let redMissed = 0;

  for (let f = 0; f < FOLDS; f++) {
    const train = examples.filter((_, i) => fold.get(i) !== f);
    const test = examples.filter((_, i) => fold.get(i) === f);
    const model = trainClassifier(train);

    for (const ex of test) {
      const expected = INTENTS[ex.label];
      const got = classify(ex.text, model);
      const gotLevel: TriageLevel = got.unsure ? 'yellow' : got.intent.level;
      if (!got.unsure && got.intent.id === expected.id) intentHits++;
      if (gotLevel === expected.level) levelHits++;
      if (RANK[gotLevel] < RANK[expected.level]) {
        underTriage++;
        if (expected.level === 'red') {
          redMissed++;
          console.log(`  model alone missed red: "${ex.text}" -> ${gotLevel} (${got.intent.id})`);
        }
      }
    }
  }

  const n = examples.length;
  console.log(`\nCross-validation (${FOLDS} folds, ${n} examples, ${INTENTS.length} intents, model only)`);
  console.log(`  intent accuracy:      ${pct(intentHits, n)}`);
  console.log(`  triage level accuracy: ${pct(levelHits, n)}`);
  console.log(`  under-triaged:         ${underTriage} (of which red cases: ${redMissed})`);
};

// Phrasings that are NOT in the training data
const HELD_OUT: Array<[string, TriageLevel]> = [
  ['there is some blood on my pad', 'red'],
  ['my head is killing me and everything looks blurry', 'red'],
  ['I havent felt my baby kicking since this morning', 'red'],
  ['my waters went and I am 33 weeks', 'red'],
  ['I am burning up with fever and shaking', 'red'],
  ['she started shaking all over and passed out', 'red'],
  ['strong pains in my belly coming every few minutes, I am 30 weeks', 'red'],
  ['I feel breathless and my chest is tight', 'red'],
  ['my baby will not feed and feels very hot', 'red'],
  ['I gave birth 5 days ago and the bleeding is getting heavier', 'red'],
  ['I can not stop throwing up, even water comes back', 'red'],
  ['the smell of cooking makes me want to be sick', 'yellow'],
  ['my lower back has been aching all week', 'yellow'],
  ['my ankles swell up at night', 'yellow'],
  ['peeing is painful', 'yellow'],
  ['I get dizzy when I get up quickly', 'yellow'],
  ['I keep sneezing and my throat hurts', 'yellow'],
  ['I feel down and keep crying', 'yellow'],
  ['my nipples are cracked and sore', 'yellow'],
  ['I have heartburn after dinner', 'green'],
  ['what foods should a pregnant woman eat', 'green'],
  ['how often do pregnant women need a checkup', 'green'],
  ['can I do light jogging in my second trimester', 'green'],
  ['hi there, good day', 'green'],
  ['ndava amaraso menshi', 'red'],
  ['mfite umuriro n\'umutwe', 'red'],
  ['mfite isereri buri gitondo', 'yellow'],
  ['umugongo urandya cyane', 'yellow'],
  ['mwiriwe neza', 'green'],
];

const heldOut = () => {
  let hits = 0;
  let under = 0;
  console.log(`\nHeld-out phrasings (${HELD_OUT.length}, full pipeline: safety rules + model)`);
  for (const [text, expected] of HELD_OUT) {
    const r = analyzeSymptoms(text);
    const ok = r.triage === expected;
    if (ok) hits++;
    if (RANK[r.triage] < RANK[expected]) under++;
    const how = r.override ? `rule: ${r.matchedSignal ?? 'safety'}` : `model: ${r.intent ?? 'unsure'} ${r.confidence}`;
    console.log(`  ${ok ? 'ok  ' : (RANK[r.triage] < RANK[expected] ? 'UNDER' : 'over ')} ${expected.padEnd(6)} -> ${r.triage.padEnd(6)} [${how}]  "${text}"`);
  }
  console.log(`  triage level accuracy: ${pct(hits, HELD_OUT.length)}`);
  console.log(`  under-triaged:         ${under}`);
};

const pct = (a: number, b: number) => `${((100 * a) / b).toFixed(1)}% (${a}/${b})`;

const started = Date.now();
crossValidate();
heldOut();
console.log(`\nDone in ${Date.now() - started} ms`);
