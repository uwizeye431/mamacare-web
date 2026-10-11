// Safety tests for the symptom triage pipeline (WHO rules + trained model).
// Under-triage (rating a dangerous message as less urgent) is the failure that matters most,
// so every danger phrasing here must come back RED.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeSymptoms } from '../src/triage';
import { INTENTS } from '../src/triage/intents';

const MUST_BE_RED = [
  // English
  'I am bleeding from my vagina',
  'there is some blood on my pad',
  'my head is killing me and everything looks blurry',
  'I have a severe headache and blurred vision',
  "I haven't felt my baby kicking since this morning",
  'no kicks since yesterday',
  'my waters went and I am 33 weeks',
  'I am burning up with fever and shaking',
  'she started shaking all over and passed out',
  'I feel breathless and my chest is tight',
  'my baby will not feed and feels very hot',
  'I gave birth 5 days ago and the bleeding is getting heavier',
  // Kinyarwanda
  'ndava amaraso',
  'mfite umuriro mwinshi',
  'amazi yamenetse',
  'mfite ububabare bukabije mu nda',
  // Self-harm and life threat must never depend on the model
  'I want to kill myself',
  'I do not want to live anymore',
  'ndumva nshaka kwiyahura',
  'I think I am dying',
];

for (const text of MUST_BE_RED) {
  test(`red: "${text}"`, () => {
    const result = analyzeSymptoms(text);
    assert.equal(result.triage, 'red', `expected red, got ${result.triage} (${result.intent ?? result.matchedSignal})`);
    assert.ok(result.actions.length > 0, 'a red result must tell the user what to do');
  });
}

test('mild pregnancy symptoms are not rated green', () => {
  for (const text of ['I feel queasy every morning', 'my lower back has been aching all week', 'peeing is painful']) {
    assert.notEqual(analyzeSymptoms(text).triage, 'green', text);
  }
});

test('greetings and general questions are green', () => {
  for (const text of ['hello', 'muraho', 'what foods should a pregnant woman eat']) {
    assert.equal(analyzeSymptoms(text).triage, 'green', text);
  }
});

test('every result has an explanation and at least one action', () => {
  for (const text of ['hello', 'my back hurts', 'I am bleeding', 'asdfgh qwerty']) {
    const result = analyzeSymptoms(text);
    assert.ok(result.explanation.length > 20, `explanation for "${text}"`);
    assert.ok(result.actions.length >= 1, `actions for "${text}"`);
  }
});

test('the model reproduces its own training examples for red intents', () => {
  // Red intents are the safety-critical ones: the trained model must at least get these right
  for (const intent of INTENTS.filter((i) => i.level === 'red')) {
    for (const example of intent.examples) {
      assert.equal(analyzeSymptoms(example).triage, 'red', `"${example}" (${intent.id})`);
    }
  }
});

test('every intent has a Kinyarwanda answer with the same number of actions', async () => {
  const { RESPONSES_RW } = await import('../src/triage/responsesRw');
  for (const intent of INTENTS) {
    const rw = RESPONSES_RW[intent.id];
    assert.ok(rw, `missing Kinyarwanda answer for ${intent.id}`);
    assert.equal(rw.actions.length, intent.response.actions.length, `action count differs for ${intent.id}`);
  }
});

test('answers come back in the requested language, with the same urgency', () => {
  for (const text of ['I am bleeding from my vagina', 'mfite isereri buri gitondo', 'hello', 'I want to kill myself']) {
    const en = analyzeSymptoms(text, 'en');
    const rw = analyzeSymptoms(text, 'rw');
    assert.equal(rw.triage, en.triage, `urgency must not depend on language: "${text}"`);
    assert.notEqual(rw.explanation, en.explanation, `expected a Kinyarwanda explanation for "${text}"`);
  }
  assert.match(analyzeSymptoms('ndava amaraso', 'rw').explanation, /OMS/);
});
