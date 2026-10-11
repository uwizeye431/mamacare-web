// Training data and curated answers for the MamaCare triage model.
//
// Each intent is one kind of message a mother (or CHW) might send. The model learns to
// map free text to an intent from the `examples`; the reply is always the reviewed
// `response` below, never generated text. To improve the model, add more real example
// phrasings (English and Kinyarwanda) to the right intent, then run `npm run triage:eval`.
//
// Levels:
//   red    - danger sign: go to hospital now
//   yellow - see a health centre or CHW within 24 hours
//   green  - can be managed at home, or not a symptom (greetings, questions)

export type TriageLevel = 'red' | 'yellow' | 'green';

export interface Intent {
  id: string;
  level: TriageLevel;
  examples: string[];
  response: {
    explanation: string;
    actions: string[];
  };
}

const GO_TO_HOSPITAL = 'Go to the nearest hospital or health centre now, or call 912 for an ambulance.';
const TELL_CHW = 'Tell your Community Health Worker (CHW) so they can help you get care.';

export const INTENTS: Intent[] = [
  // ---------------------------------------------------------------- RED
  {
    id: 'danger_bleeding',
    level: 'red',
    examples: [
      'I am bleeding from my vagina',
      'there is blood coming out down there',
      'I started bleeding this morning and I am 24 weeks pregnant',
      'heavy bleeding with clots',
      'I see red blood on my underwear',
      'I am spotting blood',
      'blood is flowing from my private parts',
      'I soaked a pad with blood in one hour',
      'ndava amaraso',
      'ndimo kuva amaraso',
      'amaraso ari kuza mu gitsina',
      'I have been losing a lot of blood',
      'bleeding while pregnant',
      'fresh blood when I wipe',
      'I am 8 months and blood came out',
      'my pad is full of blood',
      'bright red bleeding',
      'I passed blood clots',
      'I see blood when I go to the toilet down below',
    ],
    response: {
      explanation:
        'Bleeding from the vagina during pregnancy can be a sign of a serious problem with the placenta or the pregnancy. It needs to be checked by a health worker immediately, even if it stops.',
      actions: [
        GO_TO_HOSPITAL,
        'Lie on your left side while you wait for transport and do not put anything in the vagina.',
        'Bring your pregnancy booklet and ask someone to go with you.',
      ],
    },
  },
  {
    id: 'danger_preeclampsia',
    level: 'red',
    examples: [
      'I have a very bad headache that will not go away',
      'my head is pounding and my eyes see spots',
      'blurred vision and headache',
      'I see flashing lights and my head hurts',
      'severe headache and my face is swollen',
      'my vision is blurry and I feel pain under my ribs',
      'headache that paracetamol does not help',
      'umutwe urandya cyane kandi simbona neza',
      'ndababara umutwe cyane',
      'simbona neza',
      'my blood pressure was high and now my head hurts a lot',
      'I cannot see well and my head is heavy',
      'my head hurts badly and my vision is blurred',
      'things look blurry and I have a headache',
      'strong headache and pain in the upper belly',
      'I see stars and my head aches',
      'worst headache I have ever had',
      'my eyes are not seeing clearly',
      'headache with swollen hands and face',
      'umutwe urandya cyane',
      'amaso yanjye ntabona neza',
    ],
    response: {
      explanation:
        'A severe headache, problems seeing, or pain under the ribs in pregnancy can be signs of pre-eclampsia (dangerously high blood pressure). This can quickly become life-threatening for you and your baby.',
      actions: [
        GO_TO_HOSPITAL,
        'Ask the health worker to check your blood pressure and urine.',
        TELL_CHW,
      ],
    },
  },
  {
    id: 'danger_convulsions',
    level: 'red',
    examples: [
      'I had a seizure',
      'she is shaking and fell down unconscious',
      'convulsions',
      'my wife had fits and is not responding',
      'I fainted and my body was jerking',
      'she lost consciousness',
      'afite igicuri',
      'yataye ubwenge',
      'she collapsed and will not wake up',
      'my whole body started shaking and I could not control it',
      'she is having convulsions',
      'my sister passed out and is jerking',
      'I blacked out',
      'she fainted and is foaming at the mouth',
      'shaking attack and then unconscious',
      'yaguye igicuri',
      'my wife fainted and is not waking up',
    ],
    response: {
      explanation:
        'Fits, convulsions or losing consciousness in pregnancy or after birth are an emergency. They can be caused by eclampsia and need hospital treatment straight away.',
      actions: [
        'Call 912 or take her to the nearest hospital immediately.',
        'Lay her on her left side, keep her away from hard or sharp objects, and do not put anything in her mouth.',
        'Stay with her until help arrives.',
      ],
    },
  },
  {
    id: 'danger_fever',
    level: 'red',
    examples: [
      'I have a high fever',
      'my body is very hot and I am shivering',
      'fever and chills',
      'my temperature is 39',
      'I feel very hot and weak',
      'mfite umuriro mwinshi',
      'mfite umuriro',
      'ndashyuha cyane',
      'I have fever and bad smelling discharge',
      'hot body and headache and shaking',
      'I am burning up',
      'high temperature and sweating',
      'I feel feverish and weak',
      'I think I have malaria',
      'fever since last night',
      'my body is hot and I have chills',
      'very hot body and joint pain',
      'mfite malariya',
      'umubiri urashyushye cyane',
    ],
    response: {
      explanation:
        'A high fever in pregnancy or after birth can be caused by malaria or a serious infection, which are dangerous for you and your baby. You need to be tested and treated today.',
      actions: [
        GO_TO_HOSPITAL,
        'Drink water while you travel and do not take medicine unless a health worker tells you to.',
        TELL_CHW,
      ],
    },
  },
  {
    id: 'danger_water_broke',
    level: 'red',
    examples: [
      'my water broke',
      'water is leaking from my vagina',
      'fluid is coming out and I am only 30 weeks',
      'my waters burst',
      'a lot of clear liquid came out',
      'amazi yamenetse',
      'amazi ari kuza',
      'I keep leaking water and it is not urine',
      'my underwear is wet with fluid all the time',
      'my waters went',
      'clear water running down my legs',
      'liquid gushed out of me',
      'I think my water has broken',
      'green fluid coming from my vagina',
      'leaking fluid at 34 weeks',
      "amazi y'inda yamenetse",
    ],
    response: {
      explanation:
        'Leaking fluid from the vagina can mean your waters have broken. Whether or not labour has started, you need to be checked at a health facility now to protect you and the baby from infection.',
      actions: [
        GO_TO_HOSPITAL,
        'Use a clean pad (not a tampon) and note the colour of the fluid.',
        'Do not have sex or bathe in a bath until you have been checked.',
      ],
    },
  },
  {
    id: 'danger_reduced_movement',
    level: 'red',
    examples: [
      'my baby is not moving',
      'I have not felt the baby kick today',
      'the baby stopped moving',
      'baby movements have reduced a lot',
      'I cannot feel my baby',
      'umwana ntakina',
      'umwana ntakinyagambura',
      'umwana ntiyinyeganyeza',
      'the baby is moving much less than before',
      'no kicks since yesterday',
      'I have not felt the baby move',
      'the baby is quiet today and not kicking',
      'I cannot feel any kicks',
      'baby is not moving like before',
      'the baby has been still all day',
      'umwana ntanyeganyega',
      'sinumva umwana akina',
    ],
    response: {
      explanation:
        'A baby that moves less than usual, or stops moving, may be in distress. This needs to be checked today: do not wait until tomorrow.',
      actions: [
        GO_TO_HOSPITAL,
        'Ask for the baby\'s heartbeat to be checked.',
        TELL_CHW,
      ],
    },
  },
  {
    id: 'danger_abdominal_pain',
    level: 'red',
    examples: [
      'I have severe pain in my belly',
      'very strong stomach pain that does not stop',
      'sharp pain in my lower abdomen',
      'my tummy hurts so much I cannot stand',
      'painful contractions and I am only 7 months',
      'regular contractions before 37 weeks',
      'mbabara cyane mu nda',
      'inda irandya cyane',
      'my belly is hard and very painful',
      'terrible cramping pain',
      'my stomach is hurting very much',
      'contractions coming every five minutes and I am 32 weeks',
      'pain in my belly that keeps getting worse',
      'I have strong labour pains too early',
      'unbearable pain in my womb',
      'sharp pain on one side of my belly',
      'mfite ububabare bukabije mu nda',
      'inda iraryana cyane',
    ],
    response: {
      explanation:
        'Severe or constant belly pain, or regular contractions before 37 weeks, can be signs of early labour, the placenta separating, or another emergency.',
      actions: [
        GO_TO_HOSPITAL,
        'Do not eat or drink much until you are seen, in case you need treatment.',
        TELL_CHW,
      ],
    },
  },
  {
    id: 'danger_breathing',
    level: 'red',
    examples: [
      'I cannot breathe',
      'difficulty breathing',
      'I am short of breath even when resting',
      'chest pain and breathing problems',
      'I am gasping for air',
      'guhumeka bigoye',
      'sinshobora guhumeka',
      'my lips are blue and I am breathless',
      'my chest hurts when I breathe',
      'I feel breathless',
      'I am struggling to breathe',
      'my chest is tight and I cannot get air',
      'breathing is very hard',
      'I get out of breath just sitting',
      'ndahumeka nabi',
      'mfite ikibazo cyo guhumeka',
    ],
    response: {
      explanation:
        'Struggling to breathe or chest pain while resting can be caused by a blood clot, heart problems, severe anaemia or infection. It needs emergency care.',
      actions: [
        'Call 912 or go to the nearest hospital immediately.',
        'Sit upright and keep as calm as you can while you wait.',
        TELL_CHW,
      ],
    },
  },
  {
    id: 'danger_severe_vomiting',
    level: 'red',
    examples: [
      'I vomit everything I eat and drink',
      'I cannot keep any water down',
      'vomiting for two days and very weak',
      'I have not urinated today because I keep vomiting',
      'ndaruka cyane',
      'ndaruka ibintu byose',
      'vomiting non stop',
      'vomiting blood',
      'throwing up everything even water',
      'I keep vomiting and feel faint',
      'vomiting all day and night',
      'I cannot eat or drink anything without vomiting',
      'my vomit has blood',
      'nduruka buri kanya',
      'sinshobora kunywa amazi ndaruka',
    ],
    response: {
      explanation:
        'Vomiting so much that you cannot keep fluids down can make you dangerously dehydrated. You may need fluids through a drip.',
      actions: [
        GO_TO_HOSPITAL,
        'Keep taking small sips of clean water or oral rehydration solution (ORS) on the way.',
        TELL_CHW,
      ],
    },
  },
  {
    id: 'danger_postpartum',
    level: 'red',
    examples: [
      'heavy bleeding after giving birth',
      'I delivered last week and I am bleeding a lot',
      'bad smelling discharge after delivery',
      'my stitches are red, swollen and leaking pus',
      'after birth I have fever and belly pain',
      'nabyaye none ndava amaraso menshi',
      'one leg is swollen and painful after delivery',
      'after delivery I am losing a lot of blood',
      'bleeding heavily two days after birth',
      'my wound from the caesarean is infected',
      'smelly discharge after the baby was born',
      'fever one week after giving birth',
      'my c section scar is opening and leaking',
      'nyuma yo kubyara mfite umuriro',
    ],
    response: {
      explanation:
        'Heavy bleeding, fever, a bad-smelling discharge or a painful swollen leg after giving birth can be signs of haemorrhage, infection or a blood clot. These need urgent treatment.',
      actions: [
        GO_TO_HOSPITAL,
        'If you are bleeding heavily, lie down and ask someone to massage your lower belly while you travel.',
        TELL_CHW,
      ],
    },
  },
  {
    id: 'danger_newborn',
    level: 'red',
    examples: [
      'my newborn is not breastfeeding',
      'the baby is not sucking',
      'my baby has a fever',
      'the baby is breathing very fast',
      'my baby is very yellow',
      'the baby is cold and floppy',
      'my newborn had a fit',
      'umwana ntonka',
      'umwana afite umuriro',
      'the cord is red and smells bad',
      'my newborn is very hot',
      'the baby is not feeding well and sleeps all the time',
      'baby has yellow eyes and skin',
      'my baby is breathing fast and grunting',
      'the newborn feels cold',
      'my baby is having convulsions',
      "umwana w'uruhinja ntonka",
      'umwana ahumeka vuba vuba',
    ],
    response: {
      explanation:
        'A newborn who will not feed, has a fever or is cold, breathes fast, has fits, or turns very yellow may be seriously ill. Newborns get sick quickly.',
      actions: [
        'Take the baby to the nearest health facility now, or call 912.',
        'Keep the baby warm, skin-to-skin on your chest, on the way.',
        TELL_CHW,
      ],
    },
  },
  {
    id: 'danger_self_harm',
    level: 'red',
    examples: [
      'I want to kill myself',
      'I want to end my life',
      'I feel like hurting my baby',
      'I do not want to live anymore',
      'ndumva nshaka kwiyahura',
      'nshaka gupfa',
      'I have thoughts of harming myself',
      'I am thinking of suicide',
      'life is not worth living',
      'I might hurt myself',
      'I want to die',
      'sinshaka kubaho',
    ],
    response: {
      explanation:
        'Thank you for telling us. Thoughts of harming yourself or your baby are a medical emergency, and they can be treated. You do not have to cope with this alone.',
      actions: [
        'Go to the nearest health facility now, or call 912.',
        'Tell someone you trust and ask them to stay with you.',
        TELL_CHW,
      ],
    },
  },

  // ---------------------------------------------------------------- YELLOW
  {
    id: 'nausea_mild',
    level: 'yellow',
    examples: [
      'I feel nauseous in the mornings',
      'morning sickness',
      'I vomit sometimes in the morning',
      'I feel sick when I smell food',
      'mfite isereri',
      'ndumva nshaka kuruka',
      'I am vomiting a little but I can still eat',
      'nausea and a bit of vomiting',
      'I feel queasy',
      'I feel like throwing up in the morning',
      'I vomit once a day but I can drink',
      'certain smells make me want to vomit',
      'nausea in the first trimester',
      'ndaruka mu gitondo',
      'isereri buri gitondo',
      'I feel sick to my stomach',
    ],
    response: {
      explanation:
        'Nausea and some vomiting are common in early pregnancy and usually get better after 12 to 16 weeks. It is still worth a check if it does not improve.',
      actions: [
        'Eat small meals often, and try dry foods like bread or crackers in the morning.',
        'Sip water, ginger tea or ORS through the day to stay hydrated.',
        'See your health centre or CHW within a day if you cannot keep fluids down or feel weak.',
      ],
    },
  },
  {
    id: 'mild_headache_dizzy',
    level: 'yellow',
    examples: [
      'I feel dizzy',
      'I feel lightheaded when I stand up',
      'I am always tired and weak',
      'I feel very tired',
      'ndazungera',
      'ndananiwe cyane',
      'I get a mild headache sometimes',
      'I feel faint and my eyes are pale',
      'I am weak and out of energy',
      'I get dizzy when I stand',
      'I am exhausted all the time',
      'I have no energy',
      'slight headache in the afternoon',
      'I feel weak and tired',
      'my head spins sometimes',
      'nzunguzwa',
      'ndumva nta mbaraga mfite',
      'umutwe muke',
    ],
    response: {
      explanation:
        'Tiredness and dizziness are common in pregnancy, but they can also be signs of anaemia (low blood) or low blood pressure, which are easy to check and treat.',
      actions: [
        'Visit your health centre or CHW within 24 hours to check your blood pressure and blood level (haemoglobin).',
        'Stand up slowly, drink plenty of water and rest when you can.',
        'Keep taking your iron and folic acid tablets.',
      ],
    },
  },
  {
    id: 'back_pelvic_pain',
    level: 'yellow',
    examples: [
      'my back hurts',
      'lower back pain',
      'pain in my hips and pelvis',
      'umugongo urandya',
      'mbabara umugongo',
      'my lower back aches when I walk',
      'pain between my legs when I walk',
      'my back is sore',
      'back ache at night',
      'pain in my lower back and hips',
      'my pelvis hurts when I turn in bed',
      'pain in my back when I sit long',
      'umugongo urambabaza',
      'nkubabara mu rukenyerero',
    ],
    response: {
      explanation:
        'Back and pelvic pain are common as the baby grows and your body changes. Pain that comes and goes in waves, or is very strong, can be a sign of labour.',
      actions: [
        'Rest, use a warm cloth on your back, and avoid lifting heavy loads.',
        'Mention it to your CHW or health centre within 24 hours, especially if it keeps getting worse.',
        'If the pain comes regularly like contractions before 37 weeks, go to the health facility now.',
      ],
    },
  },
  {
    id: 'swelling_mild',
    level: 'yellow',
    examples: [
      'my feet are swollen',
      'swollen ankles in the evening',
      'my legs are a bit swollen',
      'ibirenge byabyimbye',
      'amaguru yabyimbye',
      'my shoes do not fit because my feet swell',
      'my ankles swell in the evening',
      'swollen legs after standing',
      'puffy feet',
      'my feet are a little swollen',
      'ibirenge byanjye birabyimba',
      'my legs swell when it is hot',
    ],
    response: {
      explanation:
        'Some swelling of the feet and ankles is common in late pregnancy. Swelling of the face or hands, or swelling with a headache, can be a sign of pre-eclampsia.',
      actions: [
        'Have your blood pressure checked at your health centre or by your CHW within 24 hours.',
        'Rest with your feet raised and avoid standing for long periods.',
        'Go to the hospital now if your face or hands swell, or you get a bad headache or blurred vision.',
      ],
    },
  },
  {
    id: 'urinary_infection',
    level: 'yellow',
    examples: [
      'it burns when I urinate',
      'pain when I pee',
      'I urinate very often and it hurts',
      'iyo nyara biranyokera',
      'my urine smells bad',
      'burning urine and lower belly discomfort',
      'peeing hurts',
      'stinging when I pass urine',
      'I need to urinate all the time and it burns',
      'painful urination',
      'urine infection',
      'kunyara birandya',
      'mbabara iyo nyara',
    ],
    response: {
      explanation:
        'Burning or pain when you pass urine is often caused by a urine infection. In pregnancy this needs treatment, because it can spread to the kidneys or cause early labour.',
      actions: [
        'Visit your health centre within 24 hours for a urine test.',
        'Drink plenty of clean water.',
        'Go to the hospital now if you also have fever, back pain or vomiting.',
      ],
    },
  },
  {
    id: 'vaginal_discharge',
    level: 'yellow',
    examples: [
      'I have itching down there',
      'white discharge that itches',
      'unusual vaginal discharge',
      'yellow discharge with a smell',
      'my private parts are itchy',
      'discharge has changed colour',
      'thick white discharge',
      'itchy vagina',
      'smelly discharge from my private parts',
      'green discharge',
      'I have a yeast infection',
      'burning and itching in my vagina',
      'mfite uburyaryate mu gitsina',
    ],
    response: {
      explanation:
        'Some discharge is normal in pregnancy, but itching, a bad smell or a change in colour can mean an infection that should be treated.',
      actions: [
        'Visit your health centre or CHW within 24 hours.',
        'Wear clean cotton underwear and wash with plain water only.',
        'Go now if the fluid is watery and keeps leaking, or if there is blood.',
      ],
    },
  },
  {
    id: 'cough_cold_diarrhea',
    level: 'yellow',
    examples: [
      'I have a cough',
      'I have a cold and runny nose',
      'sore throat',
      'mfite inkorora',
      'I have diarrhoea',
      'mfite impiswi',
      'loose stool since yesterday',
      'I have the flu',
      'runny nose and cough',
      'I am coughing a lot',
      'I have a cold',
      'stomach upset and diarrhoea',
      'watery stools',
      'my throat is sore and I sneeze',
      'ndakorora cyane',
      'mfite ibicurane',
    ],
    response: {
      explanation:
        'Coughs, colds and diarrhoea are common, but in pregnancy they should be checked so you get treatment that is safe for the baby and do not become dehydrated.',
      actions: [
        'Visit your health centre or CHW within 24 hours.',
        'Drink plenty of clean water or ORS, and rest.',
        'Do not take medicine unless a health worker says it is safe in pregnancy.',
      ],
    },
  },
  {
    id: 'low_mood_anxiety',
    level: 'yellow',
    examples: [
      'I feel sad all the time',
      'I am very worried and cannot sleep',
      'I feel anxious about the birth',
      'I cry a lot since the baby was born',
      'I feel alone and stressed',
      'mfite agahinda',
      'mfite ubwoba bwinshi',
      'I feel down',
      'I keep crying for no reason',
      'I am stressed about the pregnancy',
      'I feel hopeless',
      'I cannot stop worrying',
      'I feel depressed',
      'ndababaye cyane',
      'mpangayitse',
    ],
    response: {
      explanation:
        'Feeling low, anxious or overwhelmed is common during pregnancy and after birth, and support really helps. You deserve care for your mind as well as your body.',
      actions: [
        'Talk to your CHW or health centre in the next day or two about how you are feeling.',
        'Share how you feel with someone you trust and ask for help with daily tasks.',
        'If you ever have thoughts of harming yourself or your baby, go to a health facility immediately.',
      ],
    },
  },
  {
    id: 'breastfeeding_problem',
    level: 'yellow',
    examples: [
      'my breast is red and painful',
      'sore and cracked nipples',
      'my breasts are hard and hurt',
      'I do not have enough milk',
      'amabere arandya',
      'breast lump that hurts',
      'cracked nipples',
      'my breast is swollen and painful',
      'the baby will not latch properly',
      'not enough breast milk',
      'breastfeeding hurts',
      'my breast has a painful red patch',
      'nta mashereka mfite',
    ],
    response: {
      explanation:
        'Sore, hard or red breasts are common while breastfeeding, but a red, hot, painful area with fever can be mastitis, which needs treatment.',
      actions: [
        'Keep breastfeeding often from both breasts and check the baby is latching deeply.',
        'Visit your health centre or CHW within 24 hours, and go today if you have a fever.',
        'Use a warm cloth before feeding and rest as much as you can.',
      ],
    },
  },

  // ---------------------------------------------------------------- GREEN
  {
    id: 'heartburn_constipation',
    level: 'green',
    examples: [
      'I have heartburn',
      'burning in my chest after eating',
      'I am constipated',
      'I cannot pass stool easily',
      'my stomach feels bloated',
      'indigestion at night',
      'heartburn after meals',
      'acid in my throat at night',
      'constipation in pregnancy',
      'I have not had a bowel movement for three days',
      'gas and bloating',
      'my stomach burns after food',
      'sinshobora kujya ku musarani',
    ],
    response: {
      explanation:
        'Heartburn, bloating and constipation are very common in pregnancy because digestion slows down. They can usually be managed at home.',
      actions: [
        'Eat smaller meals, avoid lying down straight after eating, and limit spicy or fatty food.',
        'Drink plenty of water and eat fruit, vegetables and beans for fibre.',
        'Ask your CHW or health centre if it does not improve.',
      ],
    },
  },
  {
    id: 'nutrition',
    level: 'green',
    examples: [
      'what should I eat during pregnancy',
      'which foods are good for my baby',
      'can I drink alcohol while pregnant',
      'do I need vitamins',
      'nkwiye kurya iki',
      'indyo yuzuye ku mugore utwite',
      'is it ok to eat eggs',
      'how much water should I drink',
      'iron and folic acid tablets',
      'what foods are good in pregnancy',
      'what should a pregnant woman eat',
      'is coffee safe while pregnant',
      'can I eat fish',
      'healthy diet for pregnancy',
      'which fruits should I eat',
      'ni ibihe biryo byiza ku mugore utwite',
      'should I take folic acid',
    ],
    response: {
      explanation:
        'A balanced diet (indyo yuzuye) helps your baby grow and protects you from anaemia. Eat a variety of foods every day, and take the iron and folic acid tablets you are given at your check-ups.',
      actions: [
        'Each day include vegetables (such as dodo), fruit, beans or meat or fish, eggs or milk, and staple foods.',
        'Drink plenty of clean water and avoid alcohol, smoking and raw or undercooked meat.',
        'Take your iron and folic acid tablets as prescribed.',
      ],
    },
  },
  {
    id: 'anc_visits',
    level: 'green',
    examples: [
      'when should I go for antenatal care',
      'how many check ups do I need',
      'when is my next appointment',
      'what happens at the first ANC visit',
      'kwipimisha inda',
      'ni ryari njya kwipimisha',
      'do I need an ultrasound',
      'where can I go for a pregnancy check up',
      'how many antenatal visits should I have',
      'when should I start antenatal care',
      'how often should I see the midwife',
      'what tests are done in pregnancy',
      'when should I book my first check up',
      'ni kangahe njya kwipimisha',
      'do I need to go to the clinic every month',
    ],
    response: {
      explanation:
        'Antenatal care (ANC) check-ups protect you and your baby. WHO recommends at least 8 contacts during pregnancy, with the first one before 12 weeks.',
      actions: [
        'Book your next ANC visit at your nearest health centre.',
        'Bring your pregnancy booklet to every visit.',
        'Ask your CHW to help you keep track of your appointments.',
      ],
    },
  },
  {
    id: 'exercise_sleep',
    level: 'green',
    examples: [
      'can I exercise while pregnant',
      'is walking good for pregnancy',
      'what is the best sleeping position',
      'I have trouble sleeping at night',
      'can I keep working while pregnant',
      'is it safe to have sex during pregnancy',
      'is it ok to go for walks',
      'which exercises are safe in pregnancy',
      'can I sleep on my back',
      'I cannot sleep well',
      'can I carry water or heavy things',
      'is it safe to travel while pregnant',
      'nshobora gukora siporo',
    ],
    response: {
      explanation:
        'Gentle activity like walking is good for most pregnancies, and sleeping on your side (especially the left side) is best in later pregnancy.',
      actions: [
        'Walk or do light activity for about 30 minutes most days, unless a health worker has told you to rest.',
        'Sleep on your side with a pillow between your knees.',
        'Avoid heavy lifting and stop any activity that causes pain, bleeding or dizziness.',
      ],
    },
  },
  {
    id: 'normal_baby_movement',
    level: 'green',
    examples: [
      'when will I feel the baby move',
      'how often should the baby kick',
      'the baby kicks a lot is that normal',
      'is it normal to feel hiccups in the belly',
      'is it normal for the baby to move a lot at night',
      'when does the baby start kicking',
      'how many kicks should I count',
      'the baby moves a lot after I eat',
    ],
    response: {
      explanation:
        'Most mothers start to feel the baby move between 16 and 22 weeks. Later in pregnancy you should feel movements every day; each baby has its own pattern.',
      actions: [
        'Get to know your baby\'s usual pattern of movements.',
        'If the baby moves less than usual or stops moving, go to the health facility the same day.',
      ],
    },
  },
  {
    id: 'greeting',
    level: 'green',
    examples: [
      'hello',
      'hi',
      'good morning',
      'how are you',
      'muraho',
      'mwaramutse',
      'mwiriwe',
      'amakuru',
      'thank you',
      'murakoze',
      'thanks for the help',
      'what can you do',
      'good afternoon',
      'good evening',
      'hey there',
      'muraho neza',
      'bite',
      'mwaramutse neza',
      'hello how are you',
      'ok thanks',
    ],
    response: {
      explanation:
        'Hello! I am the MamaCare assistant. Tell me how you are feeling, for example "I have a headache" or "mfite isereri", and I will tell you how urgent it is and what to do next.',
      actions: [
        'Describe your symptoms in your own words, in English or Kinyarwanda.',
        'You can also ask about nutrition, check-ups or exercise in pregnancy.',
      ],
    },
  },
  {
    id: 'out_of_scope',
    level: 'green',
    examples: [
      'what is the weather today',
      'tell me a joke',
      'who won the football match',
      'how do I cook rice',
      'what is the capital of france',
      'I want to buy a phone',
      'what time is it',
      'can you help me with my homework',
      'how do I get to kigali',
      'what is the price of fuel',
      'sing me a song',
      'what is your name',
    ],
    response: {
      explanation:
        'I can only help with pregnancy, birth, newborn and postpartum health. Please describe any symptoms you have, or ask a question about your pregnancy.',
      actions: [
        'Describe how you are feeling, for example where it hurts and since when.',
        'For other questions, contact your CHW or health centre.',
      ],
    },
  },
];

// Used when the model is not confident about any intent
export const UNSURE_RESPONSE = {
  explanation:
    'I could not understand that clearly enough to give advice. Please describe your symptoms in more detail: what you feel, where, and since when.',
  actions: [
    'Add more detail, for example "I have had a headache since yesterday".',
    'If you feel very unwell or are worried, go to your nearest health centre or call 912.',
    TELL_CHW,
  ],
};
