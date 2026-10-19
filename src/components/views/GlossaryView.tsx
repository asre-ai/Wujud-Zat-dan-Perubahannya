import React, { useState, useMemo } from 'react';
import { NavPage } from '../../types';
import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES, GlossaryTerm } from '../../data/glossaryData';
import { sound } from '../../utils/audio';
import {
  Search,
  X,
  Volume2,
  ArrowRight,
  BookOpen,
  Sparkles,
  Home,
  RotateCcw,
  Compass,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';

interface GlossaryViewProps {
  onNavigate: (page: NavPage) => void;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Available initial letters from terms for A-Z bar
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    GLOSSARY_TERMS.forEach((term) => {
      const firstChar = term.term.trim()[0].toUpperCase();
      if (firstChar >= 'A' && firstChar <= 'Z') {
        letters.add(firstChar);
      }
    });
    return Array.from(letters).sort();
  }, []);

  // Filtered terms
  const filteredTerms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return GLOSSARY_TERMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Letter filter
      if (selectedLetter !== 'ALL') {
        const firstChar = item.term.trim()[0].toUpperCase();
        if (firstChar !== selectedLetter) {
          return false;
        }
      }

      // Search query filter
      if (q) {
        const inTerm = item.term.toLowerCase().includes(q);
        const inDef = item.definition.toLowerCase().includes(q);
        const inEx = item.example.toLowerCase().includes(q);
        const inAliases = item.aliases?.some((a) => a.toLowerCase().includes(q)) ?? false;
        const inCat = item.categoryLabel.toLowerCase().includes(q);
        return inTerm || inDef || inEx || inAliases || inCat;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedLetter]);

  // Read aloud term using Web Speech API (Indonesian)
  const handleSpeak = (term: GlossaryTerm) => {
    sound.playPop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = `${term.term}. ${term.definition}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;

      utterance.onstart = () => setSpeakingId(term.id);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      window.speechSynthesis.speak(utterance);
    }
  };

  const resetFilters = () => {
    sound.playPop();
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLetter('ALL');
  };

  return (
    <div className="flex flex-col gap-8 pb-16 animate-in fade-in duration-200">
      {/* 1. Header Hero Banner */}
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-500 via-teal-600 to-sky-600 p-6 sm:p-10 text-white shadow-xl border-3 border-emerald-300">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-yellow-300/15 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Breadcrumb & Navigation helper */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => {
                sound.playPop();
                onNavigate('home');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer backdrop-blur-xs border border-white/20"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </button>
            <span className="text-white/60">/</span>
            <span className="text-xs font-bold text-emerald-100">Glosarium IPA SD</span>
          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl sm:text-5xl shadow-lg border-2 border-white/30 mb-4">
            📖
          </div>

          <div className="inline-block px-3.5 py-1 rounded-full bg-white/25 border border-white/30 text-white text-xs font-black tracking-wide mb-2 uppercase font-heading">
            ⭐ Kamus Lengkap Sains
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight leading-tight">
            Glosarium Wujud Zat & Perubahannya
          </h1>

          <p className="mt-3 text-sm sm:text-base font-medium text-emerald-50 max-w-2xl leading-relaxed">
            Kumpulan istilah penting IPA Sekolah Dasar kelas 4–6. Pahami definisi, contoh konkret di sekitarmu, dan dengarkan pelafalannya!
          </p>

          {/* Search Box Bar */}
          <div className="mt-6 w-full max-w-xl relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari istilah sains (misal: mencair, partikel, kalor, volume)..."
                className="w-full pl-12 pr-10 py-3.5 sm:py-4 rounded-2xl bg-white text-slate-900 font-bold text-sm sm:text-base placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-lg border-2 border-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Filter Bar: Categories + Alphabet */}
      <section className="flex flex-col gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none px-1">
          {GLOSSARY_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playPop();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02] border-2 border-emerald-700'
                    : 'bg-white hover:bg-emerald-50 text-slate-700 border-2 border-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {cat.id === 'all' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {GLOSSARY_TERMS.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Alphabet Fast Jump Bar */}
        <div className="p-2 sm:p-2.5 rounded-2xl bg-white/90 border-2 border-slate-200 shadow-2xs flex flex-wrap items-center gap-1 text-xs">
          <span className="font-bold text-slate-500 text-[11px] px-2 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span>Indeks Huruf:</span>
          </span>

          <button
            onClick={() => {
              sound.playPop();
              setSelectedLetter('ALL');
            }}
            className={`px-2.5 py-1 rounded-xl font-black text-xs transition-colors cursor-pointer ${
              selectedLetter === 'ALL'
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua (A-Z)
          </button>

          {availableLetters.map((letter) => {
            const isLetterActive = selectedLetter === letter;
            return (
              <button
                key={letter}
                onClick={() => {
                  sound.playPop();
                  setSelectedLetter(letter);
                }}
                className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center transition-colors cursor-pointer ${
                  isLetterActive
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Status Bar: Result Count & Active Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs font-bold text-slate-600">
        <div className="flex items-center gap-2">
          <span>Menampilkan <strong>{filteredTerms.length}</strong> dari {GLOSSARY_TERMS.length} istilah sains</span>
          {(searchQuery || selectedCategory !== 'all' || selectedLetter !== 'ALL') && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 underline cursor-pointer font-bold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset filter</span>
            </button>
          )}
        </div>
        <span className="text-slate-400 hidden sm:inline">
          💡 Klik ikon suara pada kartu untuk mendengarkan arti istilah
        </span>
      </div>

      {/* 4. Terms Grid */}
      {filteredTerms.length === 0 ? (
        /* Empty State */
        <div className="bg-white/95 rounded-[32px] p-8 sm:p-12 text-center border-3 border-dashed border-slate-300 shadow-sm max-w-lg mx-auto w-full">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center text-3xl mb-4">
            🔍
          </div>
          <h3 className="text-lg font-black text-slate-800 font-heading">
            Istilah Tidak Ditemukan
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            Tidak ada istilah yang cocok dengan kata kunci <em>"{searchQuery}"</em> atau filter yang dipilih.
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer font-heading"
          >
            Tampilkan Semua Istilah
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredTerms.map((item) => {
            const isSpeaking = speakingId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white/98 rounded-[28px] p-5 sm:p-6 border-3 border-slate-200/90 hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between group shadow-xs relative overflow-hidden"
              >
                {/* Top header on card */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                        {item.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-lg sm:text-xl font-black text-slate-900 font-heading leading-tight">
                            {item.term}
                          </h3>
                        </div>
                        {item.aliases && item.aliases.length > 0 && (
                          <p className="text-[11px] font-bold text-slate-500">
                            Nama lain: {item.aliases.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Pronunciation Audio Button */}
                    <button
                      onClick={() => handleSpeak(item)}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        isSpeaking
                          ? 'bg-emerald-500 text-white border-emerald-600 animate-pulse shadow-md'
                          : 'bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 border-slate-200'
                      }`}
                      title="Dengarkan pelafalan dan arti istilah ini"
                      aria-label={`Dengarkan penjelasan ${item.term}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Definition */}
                  <p className="text-slate-700 text-sm font-medium leading-relaxed mb-3">
                    {item.definition}
                  </p>

                  {/* Formula / Key characteristic badge */}
                  {item.formula && (
                    <div className="mb-3 px-3 py-1.5 rounded-xl bg-slate-100/90 text-slate-800 text-xs font-bold border border-slate-200/80 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="leading-tight">{item.formula}</span>
                    </div>
                  )}

                  {/* Everyday Example */}
                  <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs font-semibold leading-relaxed mb-4">
                    <div className="flex items-start gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-900 block font-heading text-[11px] uppercase tracking-wide">
                          Contoh Nyata di Sekitarmu:
                        </strong>
                        <span>{item.example}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Bottom: Quick link to interactive web feature */}
                {item.relatedPage && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-400">
                      Terkait materi:
                    </span>
                    <button
                      onClick={() => {
                        sound.playPop();
                        onNavigate(item.relatedPage!);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-black text-sky-700 hover:text-sky-900 hover:underline cursor-pointer transition-colors font-heading"
                    >
                      <span>{item.relatedPageLabel || 'Pelajari Lebih Lanjut'}</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Bottom Call to Action for Quiz */}
      <section className="mt-4 rounded-[32px] bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 sm:p-8 text-amber-950 shadow-lg border-3 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl shrink-0">
            🎯
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black font-heading leading-tight">
              Sudah Paham Semua Istilahnya?
            </h3>
            <p className="text-xs sm:text-sm font-bold text-amber-950/85 mt-1">
              Uji kemampuan dan wawasanmu dalam 10 soal interaktif berhadiah lencana prestasi!
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            onNavigate('quiz');
          }}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-orange-950 font-black text-sm shadow-md border-2 border-white flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 font-heading shrink-0"
        >
          <span>Mulai Kuis Sekarang</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </section>
    </div>
  );
};
