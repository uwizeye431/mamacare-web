export interface DangerSignalMatch {
  isCritical: boolean;
  signalName?: string;
  matchedKeyword?: string;
}

// 28 WHO Critical Danger Signals Keywords (using strict regex lists to avoid false triggers)
const DANGER_SIGNALS = [
  {
    name: 'Vaginal Bleeding',
    keywords: [
      /\bbleeding\b/i, /\bblood\b/i, /\bspotting\b/i, /\bamaraso\b/i, 
      /\bkuva\s+amaraso\b/i, /hemorrhage/i, /hemorage/i
    ],
  },
  {
    name: 'Severe Headache',
    keywords: [
      /\bheadache\b/i, /severe\s+head\s+pain/i, /migraine/i, 
      /\bumutwe\s+ukabije\b/i, /\bubabare\s+bw\'umutwe\b/i
    ],
  },
  {
    name: 'Blurred Vision',
    keywords: [
      /blurred\s+vision/i, /\bvision\b/i, /blindness/i, 
      /kureba\s+ibinyonga/i, /kutabona\s+neza/i
    ],
  },
  {
    name: 'High Fever',
    keywords: [
      /\bfever\b/i, /high\s+temperature/i, /\bumuriro\s+mwinshi\b/i, 
      /\bgushyuha\b/i, /ubushyuhe/i
    ],
  },
  {
    name: 'Convulsions / Seizures',
    keywords: [
      /convulsion/i, /seizure/i, /\bfits\b/i, /\bigicuri\b/i, 
      /kugwa\s+igihumure/i, /gushona/i, /epilepsy/i
    ],
  },
  {
    name: 'Fluid Leaking',
    keywords: [
      /fluid\s+leaking/i, /water\s+broke/i, /water\s+breaking/i, 
      /amazi\s+yamenetse/i, /kumeneka\s+k\'amazi/i
    ],
  },
  {
    name: 'Decreased Fetal Movement',
    keywords: [
      /not\s+moving/i, /not\s+kicking/i, /baby\s+stopped/i, 
      /umwana\s+adatwiga/i, /adakinyagambura/i
    ],
  },
  {
    name: 'Severe Abdominal Pain',
    keywords: [
      /abdominal\s+pain/i, /severe\s+cramping/i, /severe\s+stomach\s+pain/i, 
      /kubabara\s+mu\s+nda\s+cyane\b/i, /inda\s+irababara\s+cyane/i
    ],
  },
  {
    name: 'Severe Edema (Swelling)',
    keywords: [
      /face\s+swollen/i, /hands\s+swollen/i, /extreme\s+swelling/i, 
      /kuvyimba\s+amaso/i, /kuvyimba\s+intoki/i
    ],
  },
  {
    name: 'Difficulty Breathing',
    keywords: [
      /difficulty\s+breathing/i, /shortness\s+of\s+breath/i, 
      /guhumeka\s+bigoranye/i, /dyspnea/i
    ],
  },
  {
    name: 'Persistent Vomiting',
    keywords: [
      /persistent\s+vomiting/i, /cannot\s+keep\s+food\s+down/i, 
      /kudahagarika\s+kuruka/i, /kuruka\s+cyane/i
    ],
  },
];

export const checkWHODangerSignals = (text: string): DangerSignalMatch => {
  const normalizedText = text.trim();

  // If it's a simple greeting or general talk, do not run danger signals check
  if (isGreetingOrNonSymptom(normalizedText)) {
    return { isCritical: false };
  }

  for (const signal of DANGER_SIGNALS) {
    for (const regex of signal.keywords) {
      if (regex.test(normalizedText)) {
        return {
          isCritical: true,
          signalName: signal.name,
          matchedKeyword: regex.source,
        };
      }
    }
  }

  return { isCritical: false };
};

// Check if the input is a greeting or general statement
export const isGreetingOrNonSymptom = (text: string): boolean => {
  const greetings = [
    /^\s*hello\s*$/i, /^\s*hi\s*$/i, /^\s*hey\s*$/i, /^\s*good\s*morning\s*$/i,
    /^\s*good\s*afternoon\s*$/i, /^\s*muraho\s*$/i, /^\s*bite\s*$/i, 
    /^\s*mwaramutse\s*$/i, /^\s*mwiriwe\s*$/i, /^\s*yambu\s*$/i,
    /^\s*how\s*are\s*you\s*$/i, /^\s*amakuru\s*$/i, /^\s*muraho\s*neza\s*$/i,
    /^\s*welcome\s*$/i
  ];

  return greetings.some(regex => regex.test(text));
};
