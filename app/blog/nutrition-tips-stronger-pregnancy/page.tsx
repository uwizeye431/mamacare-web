import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const mealGroups = [
  {
    title: "Fruits and Vegetables",
    image:
      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=900&h=520",
    alt: "Colorful fruits and vegetables on a kitchen table",
    foods: [
      "Avocado, bananas, oranges, and berries",
      "Spinach, broccoli, carrots, and pumpkin",
      "Tomatoes, beets, and sweet potatoes",
    ],
    benefit: "Rich in vitamins, folate, antioxidants, and fiber for baby development and maternal digestion.",
  },
  {
    title: "Proteins for Growth",
    image:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=900&h=520",
    alt: "Healthy protein foods including eggs, fish, and legumes",
    foods: [
      "Eggs, fish, skinless chicken, and lean meat",
      "Beans, lentils, peas, and soy products",
      "Milk, yogurt, and unsweetened dairy options",
    ],
    benefit: "Supports tissue growth, placenta health, and steady maternal energy.",
  },
  {
    title: "Whole Grains and Healthy Carbs",
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=900&h=520",
    alt: "Whole grains and healthy carbohydrate foods",
    foods: [
      "Oats, brown rice, millet, and whole-wheat bread",
      "Boiled Irish potatoes and sweet potatoes",
      "Maize porridge with balanced protein sides",
    ],
    benefit: "Provides long-lasting energy and helps prevent extreme hunger crashes.",
  },
  {
    title: "Healthy Fats and Hydration",
    image:
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=900&h=520",
    alt: "Water, nuts, and healthy fat foods",
    foods: [
      "Groundnuts, almonds, seeds, and olive oil",
      "Plenty of safe drinking water every day",
      "Fresh soups and low-sugar smoothies",
    ],
    benefit: "Supports brain development, hormone balance, and fluid circulation.",
  },
];

const dailyRhythm = [
  {
    label: "Morning",
    meal: "Oats with milk, banana, and a boiled egg.",
    image:
      "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800&h=520",
    alt: "Breakfast bowl with oats, fruit, and milk",
  },
  {
    label: "Lunch",
    meal: "Brown rice, beans, leafy vegetables, and fruit.",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800&h=520",
    alt: "Balanced lunch bowl with rice and vegetables",
  },
  {
    label: "Evening",
    meal: "Fish or chicken with sweet potatoes and salad.",
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800&h=520",
    alt: "Evening healthy cooked meal with salmon and vegetables",
  },
];

const wellnessCards = [
  {
    title: "Stay hydrated",
    text: "Drink water consistently during the day, especially in warm weather.",
    image:
      "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=800&h=520",
    alt: "Glass of water and hydration",
  },
  {
    title: "Build balanced plates",
    text: "Fill each plate with vegetables, protein, and whole grains for steady energy.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800&h=520",
    alt: "Balanced colorful meal plate",
  },
  {
    title: "Follow your supplements",
    text: "Take iron and folic acid exactly as prescribed by your healthcare provider.",
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=800&h=520",
    alt: "Colorful healthy vitamins and capsules",
  },
  {
    title: "Avoid alcohol and excess sugar",
    text: "Avoid alcohol during pregnancy and limit highly processed, high-sugar foods.",
    image:
      "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&q=80&w=800&h=520",
    alt: "Red wine glass showing alcohol to avoid during pregnancy",
  },
];

export default function NutritionPregnancyPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <section className="rounded-3xl border border-border bg-card p-8 sm:p-12 mb-8 relative overflow-hidden">
          <div className="absolute -top-16 -right-10 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">Nutrition Guide</p>
            <h1 className="text-3xl sm:text-5xl font-black text-foreground mb-4">Nutrition Tips for Stronger Pregnancy</h1>
            <p className="text-muted-foreground max-w-3xl leading-relaxed">
              Eating well during pregnancy helps your baby grow strongly and keeps you energized. Use this simple guide to build balanced meals from now until delivery.
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mb-10">
          {mealGroups.map((group) => (
            <article
              key={group.title}
              className="rounded-[18px] border border-[#0f24411f] bg-card overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="p-3 pb-0">
                <div className="rounded-[14px] overflow-hidden border border-[#0f24411f]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={group.image} alt={group.alt} className="w-full h-48 object-cover" />
                </div>
              </div>
              <div className="px-5 pt-4 pb-6 text-center sm:text-left">
                <h2 className="text-xl font-extrabold text-foreground mb-3">{group.title}</h2>
                <ul className="space-y-2 mb-4 text-sm text-muted-foreground leading-relaxed">
                  {group.foods.map((food) => (
                    <li key={food} className="border-b border-border/60 last:border-0 pb-2 last:pb-0">
                      {food}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-foreground/90 leading-relaxed">{group.benefit}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 mb-10">
          <h3 className="text-2xl font-black text-foreground mb-6 text-center sm:text-left">Daily Meal Rhythm Suggestion</h3>
          <div className="grid md:grid-cols-3 gap-5">
            {dailyRhythm.map((slot) => (
              <article
                key={slot.label}
                className="rounded-[18px] border border-[#0f24411f] overflow-hidden bg-background flex flex-col"
              >
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slot.image} alt={slot.alt} className="w-full h-40 object-cover" />
                  <div className="absolute bottom-2 left-2 right-2 bg-[#081d46] text-white text-center text-base font-bold py-2 rounded-[10px]">
                    {slot.label}
                  </div>
                </div>
                <div className="p-4 flex-1">
                  <p className="text-sm text-muted-foreground leading-relaxed text-center">{slot.meal}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-black text-foreground mb-6 text-center sm:text-left">Healthy habits</h3>
          <div className="grid sm:grid-cols-2 gap-5">
            {wellnessCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[18px] border border-[#0f24411f] bg-card overflow-hidden hover:shadow-lg transition-all flex flex-col sm:flex-row"
              >
                <div className="sm:w-[42%] shrink-0 p-3 sm:p-3">
                  <div className="rounded-[14px] overflow-hidden border border-[#0f24411f] h-full min-h-[140px] sm:min-h-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.image} alt={card.alt} className="w-full h-full min-h-[140px] sm:min-h-[160px] object-cover" />
                  </div>
                </div>
                <div className="px-5 py-4 sm:py-5 flex flex-col justify-center flex-1">
                  <h4 className="text-lg font-extrabold text-foreground mb-2">{card.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
