import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Apple,
  CalendarHeart,
  ChevronDown,
  HeartHandshake,
  Pill,
  Phone,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Timer,
  XCircle,
} from "lucide-react";
import DueDateCalculator from "../../components/prenatal/DueDateCalculator";
import BirthPlanChecklist from "../../components/prenatal/BirthPlanChecklist";
import { ANC_CONTACTS } from "../../components/prenatal/ancSchedule";

export const metadata: Metadata = {
  title: "Prenatal Care",
  description:
    "A complete guide to antenatal care: due date calculator, the 8 WHO check-ups, what happens each trimester, tests, nutrition, danger signs and birth preparedness.",
};

const SECTIONS = [
  { href: "#calculator", label: "Due date" },
  { href: "#check-ups", label: "8 check-ups" },
  { href: "#trimesters", label: "Trimesters" },
  { href: "#tests", label: "Tests & vaccines" },
  { href: "#nutrition", label: "Nutrition" },
  { href: "#danger-signs", label: "Danger signs" },
  { href: "#birth-plan", label: "Birth plan" },
  { href: "#faq", label: "FAQ" },
];

const TRIMESTERS = [
  {
    name: "First trimester",
    weeks: "Weeks 1 to 12",
    baby: "The baby's brain, heart, spine and organs form. By week 12 the baby is about 6 cm long and the heart is beating.",
    body: "Tiredness, nausea, sore breasts and passing urine more often are common as hormones rise.",
    todo: [
      "Have your first check-up before 12 weeks",
      "Take folic acid every day to protect the baby's spine and brain",
      "Stop alcohol and smoking, and check any medicine with a health worker",
    ],
  },
  {
    name: "Second trimester",
    weeks: "Weeks 13 to 27",
    baby: "The baby grows fast, starts to hear, and you will usually feel the first movements between 16 and 22 weeks.",
    body: "Nausea often eases and energy returns. Your belly shows, and back pain or heartburn may start.",
    todo: [
      "Get your ultrasound before 24 weeks",
      "Keep taking iron and folic acid",
      "Stay active with walking and gentle exercise",
    ],
  },
  {
    name: "Third trimester",
    weeks: "Weeks 28 to 40",
    baby: "The baby gains weight, the lungs mature, and the baby usually turns head down by 36 weeks.",
    body: "Breathlessness, swollen feet, poor sleep and practice contractions are common as the baby gets bigger.",
    todo: [
      "Notice your baby's daily movements and report any decrease the same day",
      "Finish your birth preparedness plan and pack your bag",
      "Learn the signs of labour and when to go to the facility",
    ],
  },
];

const TESTS = [
  "Blood pressure and urine at every visit, to catch pre-eclampsia early",
  "Haemoglobin (blood level) at the first visit and around week 30, to check for anaemia",
  "HIV, syphilis and hepatitis B, so treatment can protect the baby",
  "Blood group and rhesus factor",
  "At least one ultrasound before 24 weeks",
  "Baby's growth (fundal height) and heartbeat",
];

const SUPPLEMENTS = [
  "Iron and folic acid every day for the whole pregnancy",
  "Tetanus-diphtheria (Td) vaccine, as your provider advises",
  "Calcium, if your provider recommends it, to lower the risk of pre-eclampsia",
  "A deworming tablet after the first trimester, where recommended",
];

const EAT = [
  "Dark green vegetables such as dodo and spinach, for iron and folate",
  "Beans, peas, groundnuts, eggs, fish or meat for protein",
  "Milk, yoghurt or small fish for calcium",
  "Fruit such as avocado, mango, papaya and oranges",
  "Staples like sweet potato, cassava, maize, rice or bread for energy",
  "At least 8 glasses of clean, safe water every day",
];

const AVOID = [
  "Alcohol, including traditional brews: no amount is known to be safe",
  "Smoking and second-hand smoke",
  "Raw or undercooked meat and eggs, and unboiled milk",
  "Too much coffee or strong tea (more than about 2 cups a day)",
  "Herbal or traditional medicines unless a health worker approves them",
  "Eating soil or clay, a common craving that can be a sign of anaemia",
];

// Danger signs are translated (messages/*.json, "Danger.pregnancy")

const LABOUR_SIGNS = [
  "Contractions that come regularly and get stronger and closer together",
  "A 'show': sticky mucus that may be streaked with a little blood",
  "Your waters breaking (a gush or steady trickle of fluid)",
  "Strong pressure low in your back or bottom",
];

const FAQ = [
  {
    q: "When should I go for my first antenatal visit?",
    a: "As soon as you think you are pregnant, and ideally before 12 weeks. Early care finds problems such as anaemia, HIV or high blood pressure while there is still time to treat them, and gives you an accurate due date.",
  },
  {
    q: "Is antenatal care free?",
    a: "Antenatal care is offered at public health centres. With valid Mutuelle de Santé (community-based health insurance) most of the cost is covered. Ask your health centre or CHW about any fees.",
  },
  {
    q: "How often should I feel my baby move?",
    a: "From about 28 weeks you should feel movements every day. There is no single correct number; what matters is your baby's usual pattern. If movements slow down or stop, go to your health facility the same day.",
  },
  {
    q: "Can I keep working and exercising?",
    a: "Yes, for most healthy pregnancies. Walking and gentle activity for about 30 minutes most days are good for you. Avoid heavy lifting and long hours on your feet, and stop if you feel pain, bleeding or dizziness.",
  },
  {
    q: "Is it safe to have sex during pregnancy?",
    a: "For most women, yes. Avoid sex if you have bleeding, your waters have broken, or your provider has told you the placenta is low. Use condoms if there is any risk of a sexually transmitted infection.",
  },
  {
    q: "Should my partner come to the check-ups?",
    a: "Yes, if you would like them to. Partners can be tested for HIV together with you, learn the danger signs, and help with your birth plan and transport.",
  },
];

const sectionTitle = "text-3xl sm:text-4xl font-black text-foreground";
const card = "rounded-3xl border border-border bg-card p-6 sm:p-8";
const bullet = "relative pl-4 border-l-2 border-primary/40 text-sm sm:text-base text-muted-foreground leading-relaxed";

export default async function PrenatalCarePage() {
  const t = await getTranslations("Danger");
  const dangerSigns = t.raw("pregnancy") as string[];
  return (
    <main className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Hero */}
        <section className="rounded-3xl border border-border bg-card overflow-hidden mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1590333748338-d629e4564ad9?auto=format&fit=crop&q=80&w=1500&h=500"
            alt="Pregnant woman receiving antenatal care"
            className="w-full h-56 sm:h-72 object-cover object-center"
          />
          <div className="p-8 sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">Complete Antenatal Guide</p>
            <h1 className="text-3xl sm:text-5xl font-black text-foreground mb-3">Prenatal Care</h1>
            <p className="text-muted-foreground max-w-3xl leading-relaxed mb-6">
              Good care during pregnancy protects you and your baby. This guide follows the World Health Organization
              (WHO) recommendations: when to go for check-ups, what happens at each stage, what to eat, which signs need
              urgent care, and how to prepare for a safe birth.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#calculator"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-md"
              >
                <CalendarHeart className="w-4 h-4" /> Calculate my due date
              </a>
              <Link
                href="/symptoms"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-card border border-border text-foreground font-bold hover:bg-muted transition-all"
              >
                <Activity className="w-4 h-4" /> Check a symptom
              </Link>
              <a
                href="#danger-signs"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive font-bold hover:bg-destructive/15 transition-all"
              >
                <AlertTriangle className="w-4 h-4" /> Danger signs
              </a>
            </div>
          </div>
        </section>

        {/* In-page navigation */}
        <nav aria-label="On this page" className="flex flex-wrap gap-2 mb-12">
          {SECTIONS.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="px-4 py-2 rounded-full bg-card border border-border text-sm font-semibold text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            >
              {s.label}
            </a>
          ))}
        </nav>

        {/* Due date calculator */}
        <section id="calculator" className="scroll-mt-24 mb-16">
          <DueDateCalculator />
        </section>

        {/* WHO 8 contacts */}
        <section id="check-ups" className="scroll-mt-24 mb-16">
          <div className="mb-8">
            <h2 className={sectionTitle}>Your 8 antenatal check-ups</h2>
            <p className="text-muted-foreground mt-2 max-w-3xl">
              WHO recommends at least 8 contacts with a health worker during pregnancy, starting before 12 weeks. Each
              visit checks that you and your baby are well and catches problems early.
            </p>
          </div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ANC_CONTACTS.map((contact, i) => (
              <li key={contact.week} className="rounded-3xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground font-black flex items-center justify-center text-sm">
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-primary">{contact.week}</div>
                    <div className="font-black text-foreground">{contact.title}</div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {contact.points.map((p) => (
                    <li key={p} className="text-sm text-muted-foreground leading-relaxed pl-3 border-l-2 border-primary/30">
                      {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            Bring your ANC booklet to every visit. You can also go to the health centre at any time between visits if
            you are worried.
          </p>
        </section>

        {/* Trimesters */}
        <section id="trimesters" className="scroll-mt-24 mb-16">
          <h2 className={`${sectionTitle} mb-8`}>Trimester by trimester</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TRIMESTERS.map((t) => (
              <article key={t.name} className={`${card} flex flex-col`}>
                <span className="self-start px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider mb-3">
                  {t.weeks}
                </span>
                <h3 className="text-xl font-black text-foreground mb-4">{t.name}</h3>
                <div className="space-y-4 text-sm leading-relaxed flex-grow">
                  <p>
                    <span className="font-bold text-foreground">Your baby: </span>
                    <span className="text-muted-foreground">{t.baby}</span>
                  </p>
                  <p>
                    <span className="font-bold text-foreground">Your body: </span>
                    <span className="text-muted-foreground">{t.body}</span>
                  </p>
                  <div>
                    <div className="font-bold text-foreground mb-2">To do</div>
                    <ul className="space-y-2">
                      {t.todo.map((item) => (
                        <li key={item} className={bullet}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Tests, vaccines and supplements */}
        <section id="tests" className="scroll-mt-24 mb-16 grid md:grid-cols-2 gap-6">
          <article className={card}>
            <div className="flex items-center gap-3 mb-6">
              <Stethoscope className="w-7 h-7 text-primary" />
              <h2 className="text-2xl font-black text-foreground">Tests and checks</h2>
            </div>
            <ul className="space-y-3">
              {TESTS.map((t) => (
                <li key={t} className={bullet}>
                  {t}
                </li>
              ))}
            </ul>
          </article>
          <article className={card}>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex -space-x-1">
                <Syringe className="w-7 h-7 text-primary" />
                <Pill className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-black text-foreground">Vaccines and supplements</h2>
            </div>
            <ul className="space-y-3">
              {SUPPLEMENTS.map((s) => (
                <li key={s} className={bullet}>
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              Sleep under an insecticide-treated mosquito net every night, and get tested quickly if you have a fever:
              malaria is especially dangerous in pregnancy.
            </p>
          </article>
        </section>

        {/* Nutrition */}
        <section id="nutrition" className="scroll-mt-24 mb-16">
          <div className="mb-8">
            <h2 className={sectionTitle}>Eating well for two</h2>
            <p className="text-muted-foreground mt-2 max-w-3xl">
              You do not need to eat for two adults, but you do need a varied diet (indyo yuzuye). Eat an extra small
              meal or snack each day in the second and third trimesters.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <article className={card}>
              <div className="flex items-center gap-3 mb-6">
                <Apple className="w-7 h-7 text-green-600 dark:text-green-400" />
                <h3 className="text-2xl font-black text-foreground">Eat every day</h3>
              </div>
              <ul className="space-y-3">
                {EAT.map((e) => (
                  <li key={e} className="relative pl-4 border-l-2 border-green-500/50 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {e}
                  </li>
                ))}
              </ul>
            </article>
            <article className={card}>
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                <h3 className="text-2xl font-black text-foreground">Avoid or limit</h3>
              </div>
              <ul className="space-y-3">
                {AVOID.map((a) => (
                  <li key={a} className="relative pl-4 border-l-2 border-amber-500/50 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {a}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        {/* Danger signs */}
        <section
          id="danger-signs"
          className="scroll-mt-24 mb-16 rounded-3xl border border-destructive/25 bg-destructive/5 p-6 sm:p-10"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-7 h-7 text-destructive" />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground">{t("title")}</h2>
              <p className="text-foreground/80 mt-2 max-w-3xl">
                {t("intro")}
              </p>
            </div>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3 mb-8">
            {dangerSigns.map((d) => (
              <li
                key={d}
                className="flex items-start gap-3 rounded-2xl bg-card/70 border border-destructive/15 p-4 text-sm sm:text-base font-semibold text-foreground"
              >
                <span className="w-2 h-2 rounded-full bg-destructive shrink-0 mt-2" />
                {d}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:912"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-destructive text-white font-bold hover:bg-destructive/90 transition-all shadow-md"
            >
              <Phone className="w-4 h-4" /> {t("call912")}
            </a>
            <Link
              href="/symptoms"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-card border border-border text-foreground font-bold hover:bg-muted transition-all"
            >
              <Activity className="w-4 h-4" /> {t("checkSymptoms")}
            </Link>
          </div>
        </section>

        {/* Birth plan and labour */}
        <section id="birth-plan" className="scroll-mt-24 mb-16 grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <BirthPlanChecklist />
          </div>
          <article className={`${card} lg:col-span-2`}>
            <div className="flex items-center gap-3 mb-6">
              <Timer className="w-7 h-7 text-primary" />
              <h2 className="text-2xl font-black text-foreground">Signs of labour</h2>
            </div>
            <ul className="space-y-3 mb-6">
              {LABOUR_SIGNS.map((l) => (
                <li key={l} className={bullet}>
                  {l}
                </li>
              ))}
            </ul>
            <div className="rounded-2xl bg-primary/5 border border-primary/15 p-4 text-sm text-foreground leading-relaxed">
              <span className="font-bold">When to go: </span>
              as soon as contractions are regular, your waters break, or you notice any danger sign. If this is before
              37 weeks, go straight away: it may be early labour.
            </div>
          </article>
        </section>

        {/* Wellbeing and support */}
        <section className="mb-16 grid md:grid-cols-2 gap-6">
          <article className={card}>
            <div className="flex items-center gap-3 mb-4">
              <HeartHandshake className="w-7 h-7 text-primary" />
              <h2 className="text-2xl font-black text-foreground">Your emotional wellbeing</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Worry, mood swings and tiredness are common in pregnancy. If you feel sad most days, lose interest in
              things, or feel unable to cope, tell your health worker: depression in pregnancy is common and treatable.
            </p>
            <p className="text-sm font-semibold text-destructive">
              If you have thoughts of harming yourself or your baby, go to a health facility now or call 912.
            </p>
          </article>
          <article className={card}>
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-7 h-7 text-primary" />
              <h2 className="text-2xl font-black text-foreground">Partners and family</h2>
            </div>
            <ul className="space-y-3">
              <li className={bullet}>Come to check-ups and get tested for HIV together</li>
              <li className={bullet}>Help with heavy work like carrying water and firewood</li>
              <li className={bullet}>Learn the danger signs and keep transport money ready</li>
              <li className={bullet}>Support her to rest, eat well and take her tablets</li>
            </ul>
          </article>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 mb-16">
          <h2 className={`${sectionTitle} mb-8`}>Common questions</h2>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-border bg-card p-5 open:shadow-md">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-bold text-foreground">
                  {item.q}
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-muted-foreground leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Closing call to action */}
        <section className="rounded-3xl bg-gradient-to-br from-primary to-pink-500 p-8 sm:p-12 text-primary-foreground">
          <h2 className="text-3xl sm:text-4xl font-black mb-3">Track your pregnancy with MamaCare</h2>
          <p className="max-w-2xl opacity-90 mb-6">
            Save your due date to get your 8 check-up dates, follow your pregnancy week by week, and keep a record of
            your symptoms to share with your health worker.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-primary font-bold hover:bg-white/90 transition-all"
            >
              Set up my pregnancy <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/postpartum-support"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/40 font-bold hover:bg-white/10 transition-all"
            >
              After birth: postpartum support
            </Link>
          </div>
        </section>

        <p className="mt-8 text-xs text-muted-foreground text-center max-w-3xl mx-auto">
          This guide is for general information and follows WHO antenatal care recommendations. It does not replace
          advice from your midwife, doctor or Community Health Worker, who know your situation.
        </p>
      </div>
    </main>
  );
}
