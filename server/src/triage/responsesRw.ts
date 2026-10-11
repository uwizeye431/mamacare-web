// Kinyarwanda versions of the triage answers in intents.ts (same ids).
// DRAFT TRANSLATIONS: must be reviewed by a native-speaking health professional before launch.
// If an intent has no entry here, the English answer is used.

export interface TriageResponse {
  explanation: string;
  actions: string[];
}

const GO_TO_HOSPITAL = "Jya ku bitaro cyangwa ku kigo nderabuzima kikwegereye ubu, cyangwa uhamagare 912 bakoherereze imbangukiragutabara.";
const TELL_CHW = "Bimenyeshe Umujyanama w'Ubuzima (CHW) kugira ngo agufashe kubona ubuvuzi.";

export const RESPONSES_RW: Record<string, TriageResponse> = {
  danger_bleeding: {
    explanation:
      "Kuva amaraso mu gitsina utwite bishobora kuba ikimenyetso cy'ikibazo gikomeye ku ngobyi (placenta) cyangwa ku nda. Bigomba gusuzumwa n'umukozi w'ubuzima ako kanya, kabone n'iyo amaraso yahagarara.",
    actions: [
      GO_TO_HOSPITAL,
      "Ryamira urubavu rw'ibumoso mu gihe utegereje imodoka, kandi ntugire icyo ushyira mu gitsina.",
      "Itwaze agatabo kawe ko kwipimisha inda kandi usabe umuntu muherekezanya.",
    ],
  },
  danger_preeclampsia: {
    explanation:
      "Umutwe ukabije, kutabona neza cyangwa kubabara munsi y'imbavu utwite bishobora kuba ibimenyetso by'umuvuduko w'amaraso ukabije (pre-eclampsia). Ibi bishobora guhita bishyira ubuzima bwawe n'ubw'umwana mu kaga.",
    actions: [GO_TO_HOSPITAL, "Saba umukozi w'ubuzima kugupima umuvuduko w'amaraso n'inkari.", TELL_CHW],
  },
  danger_convulsions: {
    explanation:
      "Kugagara cyangwa guta ubwenge utwite cyangwa nyuma yo kubyara ni ibyago bikomeye. Bishobora guterwa na eclampsia kandi bisaba kuvurirwa ku bitaro ako kanya.",
    actions: [
      "Hamagara 912 cyangwa umujyane ku bitaro bikwegereye ako kanya.",
      "Muryamishe ku rubavu rw'ibumoso, mumurinde ibintu bikomeye cyangwa bityaye, kandi ntugire icyo umushyira mu kanwa.",
      "Guma iruhande rwe kugeza ubufasha buhageze.",
    ],
  },
  danger_fever: {
    explanation:
      "Umuriro mwinshi utwite cyangwa nyuma yo kubyara ushobora guterwa na malariya cyangwa indwara ikomeye yandura, kandi biteje akaga wowe n'umwana. Ugomba gupimwa no kuvurwa uyu munsi.",
    actions: [
      GO_TO_HOSPITAL,
      "Nywa amazi mu nzira kandi ntunywe umuti utabwiwe n'umukozi w'ubuzima.",
      TELL_CHW,
    ],
  },
  danger_water_broke: {
    explanation:
      "Amazi ava mu gitsina ashobora gusobanura ko isaho y'amazi yamenetse. Haba watangiye kujya ku nda cyangwa utaratangira, ugomba gusuzumwa ku kigo nderabuzima ubu kugira ngo wowe n'umwana murindwe indwara.",
    actions: [
      GO_TO_HOSPITAL,
      "Koresha igitambaro gisukuye kandi urebe ibara ry'ayo mazi.",
      "Ntukore imibonano mpuzabitsina kandi ntukarabe wicaye mu mazi kugeza usuzumwe.",
    ],
  },
  danger_reduced_movement: {
    explanation:
      "Umwana unyeganyega gake kurusha uko bisanzwe, cyangwa wahagaze kunyeganyega, ashobora kuba ari mu kaga. Bigomba gusuzumwa uyu munsi: ntutegereze ejo.",
    actions: [GO_TO_HOSPITAL, "Saba ko bumva umutima w'umwana.", TELL_CHW],
  },
  danger_abdominal_pain: {
    explanation:
      "Ububabare bukabije cyangwa budashira mu nda, cyangwa ibise biza buri gihe mbere y'ibyumweru 37, bishobora kuba ibimenyetso byo kubyara imburagihe, ingobyi itandukana na nyababyeyi, cyangwa ikindi kibazo cyihutirwa.",
    actions: [GO_TO_HOSPITAL, "Nturye cyangwa ngo unywe byinshi mbere yo gusuzumwa, mu gihe wakenera kuvurwa.", TELL_CHW],
  },
  danger_breathing: {
    explanation:
      "Guhumeka bigoye cyangwa kubabara mu gatuza uruhutse bishobora guterwa n'amaraso yavuze, ikibazo cy'umutima, kubura amaraso gukabije cyangwa indwara yandura. Bisaba ubuvuzi bwihutirwa.",
    actions: [
      "Hamagara 912 cyangwa ujye ku bitaro bikwegereye ako kanya.",
      "Icara wemye kandi ugerageze gutuza mu gihe utegereje.",
      TELL_CHW,
    ],
  },
  danger_severe_vomiting: {
    explanation:
      "Kuruka cyane ku buryo udashobora kugumana ibyo unywa bishobora gutuma ubura amazi mu mubiri ku buryo buteje akaga. Ushobora gukenera guterwa serumu.",
    actions: [
      GO_TO_HOSPITAL,
      "Mu nzira, komeza unywa amazi asukuye cyangwa ORS gake gake.",
      TELL_CHW,
    ],
  },
  danger_postpartum: {
    explanation:
      "Kuva amaraso menshi, umuriro, ibintu binuka biva mu gitsina cyangwa ukuguru kubyimbye kandi kubabaza nyuma yo kubyara bishobora kuba ibimenyetso byo kuva amaraso menshi, indwara yandura cyangwa amaraso yavuze. Bisaba kuvurwa byihuse.",
    actions: [
      GO_TO_HOSPITAL,
      "Niba uva amaraso menshi, ryama kandi usabe umuntu kugukanda gahoro mu nda yo hasi mu nzira.",
      TELL_CHW,
    ],
  },
  danger_newborn: {
    explanation:
      "Uruhinja rutonka, rufite umuriro cyangwa rukonje, ruhumeka vuba, rugagara cyangwa rwahindutse umuhondo cyane rushobora kuba rurwaye bikomeye. Impinja zirwara vuba.",
    actions: [
      "Jyana umwana ku kigo nderabuzima kikwegereye ubu, cyangwa uhamagare 912.",
      "Mu nzira, shyushya umwana umushyira ku gituza cyawe uruhu ku ruhu.",
      TELL_CHW,
    ],
  },
  danger_self_harm: {
    explanation:
      "Urakoze kutubwira. Ibitekerezo byo kwigirira nabi cyangwa kugirira nabi umwana wawe ni ibyago byihutirwa by'ubuzima, kandi birivurwa. Ntugomba kubyihanganira wenyine.",
    actions: [
      "Jya ku kigo nderabuzima kikwegereye ubu, cyangwa uhamagare 912.",
      "Bwira umuntu wizera kandi umusabe kuguma iruhande rwawe.",
      TELL_CHW,
    ],
  },
  nausea_mild: {
    explanation:
      "Isereri no kuruka gake birasanzwe mu mezi ya mbere yo gutwita, kandi akenshi bigabanuka nyuma y'ibyumweru 12 kugeza ku 16. Ni byiza kubisuzumisha niba bidakira.",
    actions: [
      "Rya bike kenshi, kandi mu gitondo ugerageze ibiryo byumye nk'umugati.",
      "Nywa amazi, icyayi cya tangawizi cyangwa ORS gake gake umunsi wose.",
      "Bonana n'ikigo nderabuzima cyangwa CHW mu munsi umwe niba udashobora kugumana ibyo unywa cyangwa wumva unaniwe cyane.",
    ],
  },
  mild_headache_dizzy: {
    explanation:
      "Kunanirwa no kuzungera birasanzwe utwite, ariko bishobora no kuba ibimenyetso byo kubura amaraso cyangwa umuvuduko w'amaraso uri hasi, kandi byoroshye gupimwa no kuvurwa.",
    actions: [
      "Jya ku kigo nderabuzima cyangwa kwa CHW mu masaha 24 bakupime umuvuduko w'amaraso n'ingano y'amaraso.",
      "Haguruka gahoro, nywa amazi ahagije kandi uruhuke igihe ubishoboye.",
      "Komeza unywa ibinini bya fer na acide folique.",
    ],
  },
  back_pelvic_pain: {
    explanation:
      "Kubabara umugongo n'urukenyerero birasanzwe uko umwana akura n'umubiri wawe uhinduka. Ububabare buza buri kanya nk'ibise, cyangwa bukabije, bushobora kuba ikimenyetso cyo kujya ku nda.",
    actions: [
      "Ruhuka, shyira igitambaro gishyushye ku mugongo, kandi wirinde guterura ibiremereye.",
      "Bibwire CHW cyangwa ikigo nderabuzima mu masaha 24, cyane cyane niba bigenda birushaho.",
      "Niba ububabare buza buri gihe nk'ibise mbere y'ibyumweru 37, jya ku kigo nderabuzima ubu.",
    ],
  },
  swelling_mild: {
    explanation:
      "Kubyimba gake ibirenge n'utugombambari birasanzwe mu mezi ya nyuma yo gutwita. Kubyimba mu maso cyangwa ku biganza, cyangwa kubyimba hamwe n'umutwe, bishobora kuba ikimenyetso cya pre-eclampsia.",
    actions: [
      "Saba ikigo nderabuzima cyangwa CHW kugupima umuvuduko w'amaraso mu masaha 24.",
      "Ruhuka uzamuye ibirenge kandi wirinde guhagarara igihe kirekire.",
      "Jya ku bitaro ubu niba ubyimbye mu maso cyangwa ku biganza, cyangwa ufite umutwe ukabije cyangwa utabona neza.",
    ],
  },
  urinary_infection: {
    explanation:
      "Kuryaryatwa cyangwa kubabara iyo unyara akenshi biterwa n'indwara y'umuyoboro w'inkari. Utwite bigomba kuvurwa, kuko ishobora kugera ku mpyiko cyangwa igatera kubyara imburagihe.",
    actions: [
      "Jya ku kigo nderabuzima mu masaha 24 bapime inkari.",
      "Nywa amazi asukuye ahagije.",
      "Jya ku bitaro ubu niba ufite n'umuriro, kubabara umugongo cyangwa kuruka.",
    ],
  },
  vaginal_discharge: {
    explanation:
      "Ibintu bike biva mu gitsina birasanzwe utwite, ariko uburyaryate, impumuro mbi cyangwa ibara rihindutse bishobora gusobanura indwara igomba kuvurwa.",
    actions: [
      "Jya ku kigo nderabuzima cyangwa kwa CHW mu masaha 24.",
      "Ambara imyenda y'imbere ya koto isukuye kandi wiyuhagire n'amazi meza gusa.",
      "Genda ubu niba ibivamo ari amazi adahagarara, cyangwa harimo amaraso.",
    ],
  },
  cough_cold_diarrhea: {
    explanation:
      "Inkorora, ibicurane n'impiswi birasanzwe, ariko utwite bigomba gusuzumwa kugira ngo uhabwe ubuvuzi butagira ingaruka ku mwana kandi ntubure amazi mu mubiri.",
    actions: [
      "Jya ku kigo nderabuzima cyangwa kwa CHW mu masaha 24.",
      "Nywa amazi asukuye cyangwa ORS ahagije, kandi uruhuke.",
      "Ntunywe umuti keretse umukozi w'ubuzima akubwiye ko utagira ingaruka ku mubyeyi utwite.",
    ],
  },
  low_mood_anxiety: {
    explanation:
      "Kumva wihebye, ufite impungenge cyangwa urushye cyane birasanzwe utwite na nyuma yo kubyara, kandi ubufasha burafasha koko. Ukwiye kwitabwaho mu bitekerezo nk'uko witabwaho ku mubiri.",
    actions: [
      "Bwira CHW cyangwa ikigo nderabuzima uko wiyumva mu munsi umwe cyangwa ibiri.",
      "Sangiza umuntu wizera uko wiyumva kandi umusabe kugufasha imirimo ya buri munsi.",
      "Niba wigeze kugira ibitekerezo byo kwigirira nabi cyangwa kugirira nabi umwana, jya ku kigo nderabuzima ako kanya.",
    ],
  },
  breastfeeding_problem: {
    explanation:
      "Amabere aryana, akomeye cyangwa atukura birasanzwe mu gihe wonsa, ariko igice gitukura, gishyushye kandi kibabaza hamwe n'umuriro gishobora kuba mastite, igomba kuvurwa.",
    actions: [
      "Komeza wonse kenshi ku mabere yombi kandi urebe ko umwana afata ibere neza.",
      "Jya ku kigo nderabuzima cyangwa kwa CHW mu masaha 24, kandi ugende uyu munsi niba ufite umuriro.",
      "Shyira igitambaro gishyushye ku ibere mbere yo konsa kandi uruhuke uko ubishoboye.",
    ],
  },
  heartburn_constipation: {
    explanation:
      "Kokerwa mu gatuza, kubyimba inda no kwituma bigoranye birasanzwe cyane utwite kuko igogora rigenda gahoro. Akenshi bishobora kwitabwaho mu rugo.",
    actions: [
      "Rya bike, wirinde kuryama ukimara kurya, kandi ugabanye ibiryo birimo urusenda cyangwa amavuta menshi.",
      "Nywa amazi ahagije kandi urye imbuto, imboga n'ibishyimbo.",
      "Baza CHW cyangwa ikigo nderabuzima niba bidakira.",
    ],
  },
  nutrition: {
    explanation:
      "Indyo yuzuye ifasha umwana gukura kandi ikakurinda kubura amaraso. Rya ibiryo bitandukanye buri munsi, kandi unywe ibinini bya fer na acide folique uhabwa iyo wipimishije.",
    actions: [
      "Buri munsi rya imboga (nka dodo), imbuto, ibishyimbo cyangwa inyama cyangwa amafi, amagi cyangwa amata, n'ibiryo by'ibanze.",
      "Nywa amazi asukuye ahagije kandi wirinde inzoga, itabi n'inyama zidahiye neza.",
      "Nywa ibinini bya fer na acide folique nk'uko wabibwiwe.",
    ],
  },
  anc_visits: {
    explanation:
      "Kwipimisha inda (ANC) birinda wowe n'umwana. OMS isaba nibura inshuro 8 zo guhura n'umukozi w'ubuzima mu gihe utwite, iya mbere ikaba mbere y'ibyumweru 12.",
    actions: [
      "Fata gahunda yo kwipimisha ikurikira ku kigo nderabuzima kikwegereye.",
      "Jyana agatabo kawe ko kwipimisha inda buri gihe.",
      "Saba CHW kugufasha kwibuka gahunda zawe.",
    ],
  },
  exercise_sleep: {
    explanation:
      "Imyitozo yoroheje nko kugenda n'amaguru ni myiza ku nda nyinshi, kandi kuryama ku rubavu (cyane cyane urw'ibumoso) ni byo byiza mu mezi ya nyuma yo gutwita.",
    actions: [
      "Genda n'amaguru cyangwa ukore imyitozo yoroheje nk'iminota 30 iminsi myinshi, keretse umukozi w'ubuzima akubwiye kuruhuka.",
      "Ryamira urubavu ushyize umusego hagati y'amavi.",
      "Irinde guterura ibiremereye kandi uhagarike imyitozo iyo ari yo yose igutera ububabare, kuva amaraso cyangwa kuzungera.",
    ],
  },
  normal_baby_movement: {
    explanation:
      "Ababyeyi benshi batangira kumva umwana anyeganyega hagati y'ibyumweru 16 na 22. Mu mezi ya nyuma, ugomba kumva anyeganyega buri munsi; buri mwana agira uburyo bwe.",
    actions: [
      "Menya uko umwana wawe asanzwe anyeganyega.",
      "Niba umwana anyeganyega gake kurusha uko bisanzwe cyangwa ahagaze, jya ku kigo nderabuzima uwo munsi nyine.",
    ],
  },
  greeting: {
    explanation:
      "Muraho! Ndi umufasha wa MamaCare. Mbwira uko wiyumva, urugero \"mfite umutwe\" cyangwa \"mfite isereri\", nkubwire uko byihutirwa n'icyo ukwiye gukora.",
    actions: [
      "Sobanura ibimenyetso ufite mu magambo yawe, mu Kinyarwanda cyangwa mu Cyongereza.",
      "Ushobora no kubaza ku mirire, kwipimisha inda cyangwa imyitozo utwite.",
    ],
  },
  out_of_scope: {
    explanation:
      "Nshobora gufasha gusa ku buzima bw'umubyeyi utwite, kubyara, uruhinja n'igihe cyo kwita ku mubyeyi wabyaye. Sobanura ibimenyetso ufite, cyangwa ubaze ikibazo kijyanye no gutwita.",
    actions: [
      "Sobanura uko wiyumva, urugero aho ubabara n'igihe byatangiriye.",
      "Ku bindi bibazo, vugana na CHW cyangwa ikigo nderabuzima.",
    ],
  },
};

export const UNSURE_RESPONSE_RW: TriageResponse = {
  explanation:
    "Sinabashije kubyumva neza ngo nguhe inama. Sobanura ibimenyetso ufite birambuye: icyo wumva, aho, n'igihe byatangiriye.",
  actions: [
    "Ongeraho ibisobanuro, urugero \"mfite umutwe kuva ejo\".",
    "Niba wumva urwaye cyane cyangwa ufite impungenge, jya ku kigo nderabuzima kikwegereye cyangwa uhamagare 912.",
    TELL_CHW,
  ],
};

export const ABUSE_RESPONSE_RW: TriageResponse = {
  explanation:
    "MamaCare iri hano gufasha ababyeyi n'abana. Turakwinginze ukoreshe amagambo meza kugira ngo tugufashe neza.",
  actions: ["Sobanura ibimenyetso ufite cyangwa ubaze ikibazo cyawe ku gutwita mu kinyabupfura."],
};

export const LIFE_THREAT_RESPONSE_RW: TriageResponse = {
  explanation: "Wavuze ko ubuzima bwawe buri mu kaga. Ibi birihutirwa kandi ukeneye ubufasha ubu nyine.",
  actions: [
    "Hamagara 912 ako kanya bakoherereze imbangukiragutabara.",
    "Jya ku bitaro bikwegereye ahakirirwa indembe.",
    "Bwira CHW n'umuryango wawe bari hafi kugira ngo bagufashe kuhagera.",
  ],
};

// Names of the WHO danger signs (from utils/dangerSignals.ts) in Kinyarwanda
export const DANGER_SIGNAL_NAMES_RW: Record<string, string> = {
  'Vaginal Bleeding': "Kuva amaraso mu gitsina",
  'Severe Headache': "Umutwe ukabije",
  'Blurred Vision': "Kutabona neza",
  'High Fever': "Umuriro mwinshi",
  'Convulsions / Seizures': "Kugagara",
  'Fluid Leaking': "Amazi ava mu gitsina",
  'Decreased Fetal Movement': "Umwana anyeganyega gake",
  'Severe Abdominal Pain': "Ububabare bukabije mu nda",
  'Severe Edema (Swelling)': "Kubyimba gukabije",
  'Difficulty Breathing': "Guhumeka bigoye",
  'Persistent Vomiting': "Kuruka bidahagarara",
};

export const dangerSignResponseRw = (signal: string): TriageResponse => ({
  explanation: `Iki gishobora kuba ikimenyetso mpuruza cya OMS ku mubyeyi utwite (${DANGER_SIGNAL_NAMES_RW[signal] ?? signal}). Kigomba gusuzumwa n'umukozi w'ubuzima ako kanya.`,
  actions: [
    GO_TO_HOSPITAL,
    "Hamagara umubyaza cyangwa umukozi w'ubuzima ukwitaho uri mu nzira niba ubishoboye.",
    "Bimenyeshe Umujyanama w'Ubuzima (CHW) ako kanya.",
  ],
});
