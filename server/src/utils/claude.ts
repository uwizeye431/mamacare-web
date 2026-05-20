import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface TriageResult {
  triage: 'red' | 'yellow' | 'green';
  explanation: string;
  actions: string[];
}

export const analyzeSymptomsWithClaude = async (symptomsText: string): Promise<TriageResult> => {
  const normalizedText = symptomsText.trim().toLowerCase();

  // 1. Detect Profanity & Abuse locally for instant polite warning
  const abuseRegex = /\b(fuck|shit|asshole|bitch|bastard|idiot|crap|wa\s+mbwa|nyoko|igitutsi|gupfa\s+ubusa)\b/i;
  if (abuseRegex.test(normalizedText)) {
    return {
      triage: 'green',
      explanation: 'MamaCare is a professional clinical environment dedicated to supportive maternal and newborn health. Please maintain a polite, respectful conversation so our clinical assistant can assist you properly.',
      actions: ['Keep conversational inputs respectful', 'Type your maternal or pregnancy health queries politely']
    };
  }

  // 2. Detect Extreme Kinyarwanda & English Emergencies (e.g. "ndenda gupfa" - I am about to die)
  const emergencyRegex = /\b(ndenda\s+gupfa|ndapfa|ndagupfa|ndikupfa|dying|about\s+to\s+die|kill\s+me|itabaza|gutabaza|tabara|emergency|umwana\s+yashizemo\s+umwuka)\b/i;
  if (emergencyRegex.test(normalizedText)) {
    return {
      triage: 'red',
      explanation: 'CRITICAL CLINICAL EMERGENCY DETECTED: You mentioned life-threatening distress ("ndenda gupfa" / about to die). Immediate clinical emergency referral is required!',
      actions: [
        'Call active emergency services in Rwanda (Call 912) immediately!',
        'Go immediately to the emergency room at your nearest District Hospital or Referral Facility.',
        'Inform your Community Health Worker (CHW) and nearby family members immediately so they can provide physical transport assistance.'
      ]
    };
  }

  // 3. Fallback locally if Anthropic Claude API Key is not configured
  if (!process.env.ANTHROPIC_API_KEY) {
    return performLocalRuleBasedTriage(normalizedText, symptomsText);
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 800,
      temperature: 0,
      system: `You are an expert obstetrician and maternal care clinical triage conversational AI.
Analyze the user's message.
If the user's input is a greeting or general chat, respond politely, explaining what you can do.
If the user's input is abusive or profane, politely request them to keep it respectful.
If the input describes symptoms:
Perform clinical triage and return a JSON object with the following structure:
{
  "triage": "red" | "yellow" | "green",
  "explanation": "A direct, compassionate explanation in simple terms suitable for a worried mother",
  "actions": ["Direct recommended next action 1", "Action 2"]
}
Triage standards:
- RED: High-risk symptoms that need immediate emergency hospital care.
- YELLOW: Moderate symptoms that require visiting a clinic or talking to a Community Health Worker (CHW) within 24 hours.
- GREEN: Normal pregnancy symptoms that can be managed at home with rest.

Respond ONLY with the raw JSON object. Do not include any markdown formatting, code blocks, or preamble.`,
      messages: [
        {
          role: 'user',
          content: symptomsText,
        },
      ],
    });

    const contentText = response.content[0].type === 'text' ? response.content[0].text : '';
    return JSON.parse(contentText.trim()) as TriageResult;
  } catch (error) {
    console.error('Claude API Error, falling back to advanced local engine:', error);
    return performLocalRuleBasedTriage(normalizedText, symptomsText);
  }
};

// Extremely advanced local rule-based clinical engine to act like a real genius AI
const performLocalRuleBasedTriage = (normalizedText: string, originalText: string): TriageResult => {
  
  // A. Greetings / Conversational Queries
  const greetingRegex = /^(hello|hi|hey|muraho|bite|mwaramutse|mwiriwe|yambu|amakuru|good\s+morning|good\s+afternoon|how\s+are\s+you)/i;
  if (greetingRegex.test(normalizedText)) {
    return {
      triage: 'green',
      explanation: `Hello! I am your MamaCare AI clinical assistant. I am here to help you monitor your pregnancy health. You can tell me about any physical pain or symptoms you are experiencing (e.g., "I have a severe headache" or "I am vomiting"), and I will analyze the risk level and give you safe advice in real-time.`,
      actions: [
        'Describe your pregnancy symptoms in the text box.',
        'Use the preset test cards to view sample classifications.',
        'Contact your Community Health Worker for routine guidance.'
      ]
    };
  }

  // B. Nutrition & Diet Advice queries
  const nutritionRegex = /\b(eat|food|nutrition|diet|indyo|ibiryo|yuzuye|vitamins|vitamin|supplements|supplement|fruit|fruits)\b/i;
  if (nutritionRegex.test(normalizedText)) {
    return {
      triage: 'green',
      explanation: `For optimal pregnancy health, a balanced diet (indyo yuzuye) is essential. Focus on fresh vegetables (such as dodo), fresh fruits, whole grains, beans, milk, and eggs. Folic acid and iron supplements are highly critical to prevent anemia. Be sure to drink at least 8 glasses of clean water daily.`,
      actions: [
        'Eat a colorful, diverse plate of food every day.',
        'Take your prenatal iron/folate supplements as prescribed by your midwife.',
        'Avoid raw, undercooked meat, unpasteurized dairy, and alcohol.'
      ]
    };
  }

  // C. ANC Visit Schedule queries
  const visitRegex = /\b(visit|appointment|schedule|clinic|doctor|midwife|anc|kureba\s+muganga|gahunda|ibizamini)\b/i;
  if (visitRegex.test(normalizedText)) {
    return {
      triage: 'green',
      explanation: `Antenatal Care (ANC) visits are highly critical. The World Health Organization (WHO) recommends at least 8 standard ANC visits during your pregnancy to safeguard your and your baby's health. Your first visit should be scheduled within the first 12 weeks of your pregnancy.`,
      actions: [
        'Contact your health facility to book your next ANC appointment.',
        'Carry your pregnancy record booklet to every consultation.',
        'Coordinate routine health checkups with your local CHW.'
      ]
    };
  }

  // D. Moderate pregnancy symptoms (Yellow)
  const moderateKeywords = [
    'nausea', 'vomit', 'kuruka', 'morning sickness', 'gucika intege', 
    'fatigue', 'tired', 'dizzy', 'kuzungera', 'back pain', 'umugongo',
    'mild headache', 'umutwe muke', 'constipation', 'swelling legs', 'ibirenge'
  ];
  if (moderateKeywords.some(kw => normalizedText.includes(kw))) {
    return {
      triage: 'yellow',
      explanation: `You are describing common mild-to-moderate pregnancy discomforts (such as morning sickness, mild headache, fatigue, or backache). While these are typical in many pregnancies, we suggest notifying your local Community Health Worker (CHW) to perform a routine home wellness check.`,
      actions: [
        'Contact your local Community Health Worker (CHW) for a routine assessment.',
        'Drink plenty of warm water, eat small frequent meals, and rest.',
        'If symptoms persist or worsen, visit your local health center.'
      ]
    };
  }

  // E. Safe default / helpful instructions if text is unclear
  return {
    triage: 'green',
    explanation: `We successfully logged your request: "${originalText}". It does not match any immediate danger signs. If you are experiencing any physical pain or pregnancy symptoms, please tell us more details (such as headache, cramping, bleeding, or fever) so we can run a full risk triage.`,
    actions: [
      'Describe symptoms in detail if you feel unwell.',
      'Maintain standard prenatal care schedule.',
      'Contact your local CHW for normal checkups.'
    ]
  };
};
