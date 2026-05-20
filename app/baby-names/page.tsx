"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Baby, Search, RefreshCw, Sparkles, ArrowLeft, Heart, BookOpen, Globe2, Star, Zap } from 'lucide-react';

// ─── Large curated name database ───────────────────────────────────────────────
const NAME_DATABASE: {
  name: string;
  gender: 'boy' | 'girl' | 'neutral';
  origin: string;
  meaning: string;
  style: string;
  syllables: number;
}[] = [
  // Kinyarwanda / Rwandan names
  { name: 'Amahoro', gender: 'neutral', origin: 'kinyarwanda', meaning: 'peace', style: 'traditional', syllables: 4 },
  { name: 'Ishimwe', gender: 'neutral', origin: 'kinyarwanda', meaning: 'praised by God', style: 'traditional', syllables: 3 },
  { name: 'Nziza', gender: 'girl', origin: 'kinyarwanda', meaning: 'beautiful', style: 'classic', syllables: 3 },
  { name: 'Mugisha', gender: 'boy', origin: 'kinyarwanda', meaning: 'lucky, blessed', style: 'traditional', syllables: 3 },
  { name: 'Uwimana', gender: 'girl', origin: 'kinyarwanda', meaning: 'belonging to God', style: 'traditional', syllables: 4 },
  { name: 'Habimana', gender: 'boy', origin: 'kinyarwanda', meaning: 'God exists', style: 'traditional', syllables: 4 },
  { name: 'Mutesi', gender: 'girl', origin: 'kinyarwanda', meaning: 'joy', style: 'classic', syllables: 3 },
  { name: 'Nshuti', gender: 'neutral', origin: 'kinyarwanda', meaning: 'friend', style: 'traditional', syllables: 2 },
  { name: 'Iradukunda', gender: 'boy', origin: 'kinyarwanda', meaning: 'we love each other', style: 'traditional', syllables: 5 },
  { name: 'Cyiza', gender: 'neutral', origin: 'kinyarwanda', meaning: 'good', style: 'classic', syllables: 2 },
  { name: 'Irakoze', gender: 'neutral', origin: 'kinyarwanda', meaning: 'thank God', style: 'traditional', syllables: 4 },
  { name: 'Keza', gender: 'girl', origin: 'kinyarwanda', meaning: 'pretty, clean', style: 'short', syllables: 2 },
  { name: 'Umutoni', gender: 'girl', origin: 'kinyarwanda', meaning: 'daughter born during cattle exchange', style: 'traditional', syllables: 4 },
  { name: 'Niyonzima', gender: 'boy', origin: 'kinyarwanda', meaning: 'God is alive', style: 'traditional', syllables: 4 },
  { name: 'Shema', gender: 'boy', origin: 'kinyarwanda', meaning: 'praise', style: 'short', syllables: 2 },
  { name: 'Kalisa', gender: 'neutral', origin: 'kinyarwanda', meaning: 'Christ-like', style: 'classic', syllables: 3 },
  { name: 'Manzi', gender: 'boy', origin: 'kinyarwanda', meaning: 'water, pure', style: 'short', syllables: 2 },
  { name: 'Urwego', gender: 'neutral', origin: 'kinyarwanda', meaning: 'level, stage', style: 'traditional', syllables: 3 },
  { name: 'Ingabire', gender: 'girl', origin: 'kinyarwanda', meaning: 'gift', style: 'classic', syllables: 4 },
  { name: 'Gasimba', gender: 'boy', origin: 'kinyarwanda', meaning: 'fearless warrior', style: 'traditional', syllables: 3 },
  // English names
  { name: 'Olivia', gender: 'girl', origin: 'english', meaning: 'olive tree', style: 'classic', syllables: 3 },
  { name: 'Emma', gender: 'girl', origin: 'english', meaning: 'whole, universal', style: 'classic', syllables: 2 },
  { name: 'Charlotte', gender: 'girl', origin: 'english', meaning: 'free woman', style: 'classic', syllables: 2 },
  { name: 'Amelia', gender: 'girl', origin: 'english', meaning: 'work, industrious', style: 'classic', syllables: 4 },
  { name: 'Sophia', gender: 'girl', origin: 'english', meaning: 'wisdom', style: 'classic', syllables: 3 },
  { name: 'Liam', gender: 'boy', origin: 'english', meaning: 'strong-willed warrior', style: 'modern', syllables: 1 },
  { name: 'Noah', gender: 'boy', origin: 'english', meaning: 'rest, comfort', style: 'classic', syllables: 1 },
  { name: 'Oliver', gender: 'boy', origin: 'english', meaning: 'olive tree', style: 'classic', syllables: 3 },
  { name: 'James', gender: 'boy', origin: 'english', meaning: 'supplanter', style: 'classic', syllables: 1 },
  { name: 'Elijah', gender: 'boy', origin: 'english', meaning: 'my God is Yahweh', style: 'classic', syllables: 3 },
  { name: 'Luna', gender: 'girl', origin: 'english', meaning: 'moon', style: 'modern', syllables: 2 },
  { name: 'Aria', gender: 'girl', origin: 'english', meaning: 'air, song', style: 'modern', syllables: 3 },
  { name: 'Zoe', gender: 'girl', origin: 'english', meaning: 'life', style: 'modern', syllables: 2 },
  { name: 'Mia', gender: 'girl', origin: 'english', meaning: 'mine, beloved', style: 'short', syllables: 2 },
  { name: 'Ella', gender: 'girl', origin: 'english', meaning: 'fairy maiden', style: 'classic', syllables: 2 },
  { name: 'Logan', gender: 'neutral', origin: 'english', meaning: 'little hollow', style: 'modern', syllables: 2 },
  { name: 'Riley', gender: 'neutral', origin: 'english', meaning: 'courageous', style: 'modern', syllables: 2 },
  { name: 'Avery', gender: 'neutral', origin: 'english', meaning: 'ruler of elves', style: 'modern', syllables: 3 },
  { name: 'Jordan', gender: 'neutral', origin: 'english', meaning: 'flow down, descend', style: 'classic', syllables: 2 },
  { name: 'Carter', gender: 'boy', origin: 'english', meaning: 'cart driver', style: 'modern', syllables: 2 },
  // African names
  { name: 'Amara', gender: 'girl', origin: 'african', meaning: 'grace, eternal', style: 'classic', syllables: 3 },
  { name: 'Zara', gender: 'girl', origin: 'african', meaning: 'flower, radiance', style: 'modern', syllables: 2 },
  { name: 'Kofi', gender: 'boy', origin: 'african', meaning: 'born on Friday', style: 'classic', syllables: 2 },
  { name: 'Adaeze', gender: 'girl', origin: 'african', meaning: "king's daughter", style: 'traditional', syllables: 3 },
  { name: 'Chidi', gender: 'boy', origin: 'african', meaning: 'God exists', style: 'classic', syllables: 2 },
  { name: 'Imani', gender: 'girl', origin: 'african', meaning: 'faith', style: 'modern', syllables: 3 },
  { name: 'Kwame', gender: 'boy', origin: 'african', meaning: 'born on Saturday', style: 'classic', syllables: 2 },
  { name: 'Nia', gender: 'girl', origin: 'african', meaning: 'purpose', style: 'short', syllables: 2 },
  { name: 'Mandela', gender: 'boy', origin: 'african', meaning: 'leader', style: 'traditional', syllables: 3 },
  { name: 'Ayasha', gender: 'girl', origin: 'african', meaning: 'lively', style: 'modern', syllables: 3 },
  { name: 'Jabari', gender: 'boy', origin: 'african', meaning: 'brave one', style: 'classic', syllables: 3 },
  { name: 'Nala', gender: 'girl', origin: 'african', meaning: 'successful, beloved', style: 'modern', syllables: 2 },
  { name: 'Seun', gender: 'boy', origin: 'african', meaning: 'God has heard', style: 'short', syllables: 1 },
  // French names
  { name: 'Amélie', gender: 'girl', origin: 'french', meaning: 'hardworking', style: 'classic', syllables: 3 },
  { name: 'Léa', gender: 'girl', origin: 'french', meaning: 'meadow', style: 'short', syllables: 2 },
  { name: 'Louis', gender: 'boy', origin: 'french', meaning: 'renowned warrior', style: 'classic', syllables: 2 },
  { name: 'Pierre', gender: 'boy', origin: 'french', meaning: 'stone, rock', style: 'classic', syllables: 1 },
  { name: 'Élise', gender: 'girl', origin: 'french', meaning: 'pledged to God', style: 'classic', syllables: 2 },
  { name: 'Laurent', gender: 'boy', origin: 'french', meaning: 'from Laurentum', style: 'classic', syllables: 2 },
  { name: 'Margaux', gender: 'girl', origin: 'french', meaning: 'pearl', style: 'classic', syllables: 2 },
  { name: 'Hugo', gender: 'boy', origin: 'french', meaning: 'heart, mind, spirit', style: 'modern', syllables: 2 },
  // Arabic names
  { name: 'Aisha', gender: 'girl', origin: 'arabic', meaning: 'she who lives, lively', style: 'classic', syllables: 3 },
  { name: 'Omar', gender: 'boy', origin: 'arabic', meaning: 'flourishing, long-lived', style: 'classic', syllables: 2 },
  { name: 'Fatima', gender: 'girl', origin: 'arabic', meaning: 'captivating, one who abstains', style: 'classic', syllables: 3 },
  { name: 'Khalid', gender: 'boy', origin: 'arabic', meaning: 'eternal, immortal', style: 'classic', syllables: 2 },
  { name: 'Layla', gender: 'girl', origin: 'arabic', meaning: 'night beauty', style: 'modern', syllables: 2 },
  { name: 'Hassan', gender: 'boy', origin: 'arabic', meaning: 'handsome, good', style: 'classic', syllables: 2 },
  { name: 'Yasmin', gender: 'girl', origin: 'arabic', meaning: 'jasmine flower', style: 'classic', syllables: 2 },
  { name: 'Ibrahim', gender: 'boy', origin: 'arabic', meaning: 'father of multitudes', style: 'traditional', syllables: 3 },
];

const ORIGINS = ['any', 'kinyarwanda', 'english', 'african', 'french', 'arabic'];
const STYLES = ['any', 'classic', 'modern', 'traditional', 'short'];
const MEANINGS = ['any', 'peace', 'God', 'beautiful', 'strength', 'love', 'life', 'wisdom', 'grace'];
const SYLLABLES_OPTIONS = ['any', '1', '2', '3', '4', '5'];
const LETTERS = ['any', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export default function BabyNamesPage() {
  const [gender, setGender] = useState<'all' | 'boy' | 'girl' | 'neutral'>('all');
  const [startLetter, setStartLetter] = useState('any');
  const [origin, setOrigin] = useState('any');
  const [style, setStyle] = useState('any');
  const [meaning, setMeaning] = useState('any');
  const [syllables, setSyllables] = useState('any');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<typeof NAME_DATABASE>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [favourites, setFavourites] = useState<string[]>([]);

  const generateNames = () => {
    let filtered = [...NAME_DATABASE];

    // Gender filter
    if (gender !== 'all') filtered = filtered.filter(n => n.gender === gender);

    // Starting letter
    if (startLetter !== 'any') filtered = filtered.filter(n => n.name.toUpperCase().startsWith(startLetter));

    // Origin
    if (origin !== 'any') filtered = filtered.filter(n => n.origin === origin);

    // Style
    if (style !== 'any') filtered = filtered.filter(n => n.style === style);

    // Meaning keyword
    if (meaning !== 'any') filtered = filtered.filter(n => n.meaning.toLowerCase().includes(meaning));

    // Syllables
    if (syllables !== 'any') filtered = filtered.filter(n => n.syllables === parseInt(syllables));

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.name.toLowerCase().includes(q) || n.meaning.toLowerCase().includes(q)
      );
    }

    // Shuffle results for fresh discovery experience
    filtered = filtered.sort(() => Math.random() - 0.5);

    setResults(filtered);
    setHasSearched(true);
  };

  const resetFilters = () => {
    setGender('all');
    setStartLetter('any');
    setOrigin('any');
    setStyle('any');
    setMeaning('any');
    setSyllables('any');
    setSearchQuery('');
    setResults([]);
    setHasSearched(false);
  };

  const toggleFavourite = (name: string) => {
    setFavourites(prev => prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]);
  };

  const SELECT_CLS = "bg-card border border-border text-foreground text-xs font-bold px-3 py-2 rounded-xl focus:ring-2 focus:ring-primary outline-none cursor-pointer";

  return (
    <main className="min-h-screen w-full bg-background pt-20 pb-16 relative overflow-hidden">
      
      {/* Subtle background blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── Hero Banner with Elegant Modern Gradient ── */}
      <section className="relative py-20 px-6 overflow-hidden rounded-3xl bg-gradient-to-r from-pink-950/90 via-slate-900 to-indigo-950 border border-pink-500/10 mb-10 shadow-lg">
        {/* Glowing blur effects */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-5 leading-tight">
            Find the Perfect{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-rose-200">
              Baby Name
            </span>
          </h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto leading-relaxed font-light">
            Discover beautiful names from Kinyarwanda, English, African, French, and Arabic origins. Filter by meaning, style, and syllables.
          </p>
        </div>
      </section>

      {/* ── Category Filter Chips ── */}
      <section className="border-b border-border bg-background/95 backdrop-blur sticky top-20 z-30 px-4 py-3.5 overflow-x-auto shadow-sm">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-max">
          {[
            { label: 'All Genders', val: 'all' },
            { label: 'Boy Names', val: 'boy' },
            { label: 'Girl Names', val: 'girl' },
            { label: 'Gender Neutral', val: 'neutral' },
          ].map(g => (
            <button
              key={g.val}
              onClick={() => setGender(g.val as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                gender === g.val
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {g.label}
            </button>
          ))}
          <div className="w-px h-6 bg-border mx-1" />
          {['Kinyarwanda', 'English', 'African', 'French', 'Arabic'].map(o => (
            <button
              key={o}
              onClick={() => setOrigin(origin === o.toLowerCase() ? 'any' : o.toLowerCase())}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                origin === o.toLowerCase()
                  ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                  : 'bg-card text-muted-foreground border-border hover:border-rose-300 hover:text-foreground'
              }`}
            >
              {o} Names
            </button>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Left: Generator Panel ── */}
          <div className="lg:col-span-1">
            <div className="glass rounded-3xl border border-border p-6 sm:p-8 shadow-xl sticky top-40">
              
              <div className="flex items-center gap-2 mb-5">
                <Zap className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-extrabold text-foreground">Baby Name Generator</h2>
              </div>

              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                I am looking for first names that are...
              </p>

              <div className="space-y-4">
                
                {/* Gender + Starting letter */}
                <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground shrink-0">for</span>
                  <select value={gender} onChange={e => setGender(e.target.value as any)} className={SELECT_CLS}>
                    <option value="all">all genders</option>
                    <option value="boy">boys</option>
                    <option value="girl">girls</option>
                    <option value="neutral">neutral</option>
                  </select>
                  <span className="shrink-0">starting with</span>
                  <select value={startLetter} onChange={e => setStartLetter(e.target.value)} className={SELECT_CLS}>
                    {LETTERS.map(l => <option key={l} value={l === 'any' ? 'any' : l}>{l === 'any' ? 'any letter' : l}</option>)}
                  </select>
                </div>

                {/* Origin + Style */}
                <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
                  <span className="shrink-0">and are</span>
                  <select value={origin} onChange={e => setOrigin(e.target.value)} className={SELECT_CLS}>
                    {ORIGINS.map(o => <option key={o} value={o}>{o === 'any' ? 'any origin' : o}</option>)}
                  </select>
                  <span className="shrink-0">and</span>
                  <select value={style} onChange={e => setStyle(e.target.value)} className={SELECT_CLS}>
                    {STYLES.map(s => <option key={s} value={s}>{s === 'any' ? 'any style' : s}</option>)}
                  </select>
                </div>

                {/* Meaning + Syllables */}
                <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
                  <span className="shrink-0">and mean</span>
                  <select value={meaning} onChange={e => setMeaning(e.target.value)} className={SELECT_CLS}>
                    {MEANINGS.map(m => <option key={m} value={m}>{m === 'any' ? 'anything' : m}</option>)}
                  </select>
                  <span className="shrink-0">with</span>
                  <select value={syllables} onChange={e => setSyllables(e.target.value)} className={SELECT_CLS}>
                    {SYLLABLES_OPTIONS.map(s => <option key={s} value={s}>{s === 'any' ? 'all syllables' : `${s} syllable${s === '1' ? '' : 's'}`}</option>)}
                  </select>
                </div>

                {/* Text Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search name or meaning..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && generateNames()}
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm focus:ring-2 focus:ring-primary outline-none placeholder-muted-foreground"
                  />
                </div>

              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={generateNames}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm"
                >
                  <Sparkles className="w-4 h-4" /> Generate Names
                </button>
                <button
                  onClick={resetFilters}
                  className="w-full py-2.5 rounded-2xl border border-border text-muted-foreground hover:text-foreground font-semibold text-xs transition-all hover:bg-muted/50 flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
                </button>
              </div>

              {/* Favourites counter */}
              {favourites.length > 0 && (
                <div className="mt-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <div className="text-xs font-extrabold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5" fill="currentColor" /> {favourites.length} Favourite{favourites.length > 1 ? 's' : ''}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {favourites.map(name => (
                      <span key={name} className="px-2.5 py-1 rounded-lg bg-white dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-[11px] font-bold">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Results Grid ── */}
          <div className="lg:col-span-2">
            
            {!hasSearched ? (
              /* Welcome / discovery state */
              <div className="glass p-10 rounded-3xl border border-border shadow-xl text-center">
                <div className="relative w-full max-w-md mx-auto mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?auto=format&fit=crop&q=80&w=900&h=500"
                    alt="Smiling African baby"
                    className="w-full h-44 object-cover rounded-2xl border border-border shadow-md"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/35 to-transparent" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-3">Discover Beautiful Baby Names</h3>
                <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed mb-8">
                  Use the generator on the left to filter names by gender, origin, meaning, style and syllables, then click Generate Names.
                </p>
                
                {/* Quick popular chips */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <span className="text-xs font-bold text-muted-foreground mr-1 self-center">Popular:</span>
                  {['Amahoro', 'Olivia', 'Amara', 'Liam', 'Imani', 'Keza', 'Noah', 'Nala'].map(name => (
                    <button
                      key={name}
                      onClick={() => { setSearchQuery(name); }}
                      className="px-3 py-1.5 rounded-full border border-border bg-card hover:border-primary hover:text-primary text-xs font-bold text-muted-foreground transition-all"
                    >
                      {name}
                    </button>
                  ))}
                </div>

                <button
                  onClick={generateNames}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-lg text-sm"
                >
                  <Sparkles className="w-4 h-4" /> Show All Names
                </button>
              </div>
            ) : results.length === 0 ? (
              /* No results */
              <div className="glass p-10 rounded-3xl border border-border shadow-xl text-center">
                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-black text-foreground mb-2">No matching names found</h3>
                <p className="text-muted-foreground text-sm mb-6">Try broader filters or reset and explore all available names.</p>
                <button onClick={resetFilters} className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/95 transition-all">
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Results Grid */
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-bold text-muted-foreground">
                    <span className="text-foreground font-black text-lg">{results.length}</span> names found
                  </h3>
                  <span className="text-xs text-muted-foreground">Click ♡ to save favourites</span>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {results.map((entry) => {
                    const isFav = favourites.includes(entry.name);
                    const genderColors: Record<string, string> = {
                      boy: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
                      girl: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
                      neutral: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
                    };
                    return (
                      <div
                        key={`${entry.name}-${entry.origin}`}
                        className={`group bg-card rounded-2xl border p-5 transition-all hover:shadow-md hover:-translate-y-0.5 ${isFav ? 'border-rose-400/50 shadow-sm shadow-rose-200/50' : 'border-border'}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-xl font-black text-foreground">{entry.name}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5 italic">{entry.meaning}</p>
                          </div>
                          <button
                            onClick={() => toggleFavourite(entry.name)}
                            className={`p-2 rounded-xl transition-all ${isFav ? 'text-rose-500 bg-rose-500/10' : 'text-muted-foreground/40 hover:text-rose-400 hover:bg-rose-500/5'}`}
                          >
                            <Heart className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border capitalize ${genderColors[entry.gender]}`}>
                            {entry.gender}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold border border-border bg-muted/50 text-muted-foreground capitalize">
                            {entry.origin}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold border border-border bg-muted/50 text-muted-foreground capitalize">
                            {entry.style}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold border border-border bg-muted/50 text-muted-foreground">
                            {entry.syllables} syl.
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
