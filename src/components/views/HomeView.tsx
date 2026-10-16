import React, { useState } from 'react';
import { NavPage, UserProgress } from '../../types';
import { STATES_DATA, FUN_FACTS } from '../../data/learningData';
import {
  ArrowRight,
  Sparkles,
  Award,
  Lightbulb,
  Play,
  BookOpen,
  FlaskConical,
  RefreshCw,
  Trophy,
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface HomeViewProps {
  onNavigate: (page: NavPage) => void;
  progress: UserProgress;
  onOpenTopScorers?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  progress,
  onOpenTopScorers,
}) => {
  const [activeFactIdx, setActiveFactIdx] = useState(0);

  const handleNextFact = () => {
    sound.playPop();
    setActiveFactIdx((prev) => (prev + 1) % FUN_FACTS.length);
  };

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* 1. HERO SECTION: Clean, airy, playful and bright */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 px-4">
        {/* Playful background decorative shapes */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-sky-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-4 right-10 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-emerald-100/40 rounded-full blur-2xl -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Friendly badge kicker */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/95 border-2 border-amber-300 text-amber-900 text-xs sm:text-sm font-black shadow-xs mb-6">
            <span>⭐ Media Pembelajaran IPA Interaktif SD</span>
            <span className="text-amber-400">•</span>
            <span className="text-orange-600 font-bold">Kelas 4 – 6</span>
          </div>

          {/* Big Hero Title */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight font-heading leading-tight max-w-3xl">
            Yuk, Kenali <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-amber-500 to-orange-500">Wujud Zat!</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-lg sm:text-xl font-bold text-slate-700 max-w-2xl leading-relaxed">
            Jelajahi dunia zat melalui pengalaman 3D yang seru dan menyenangkan seperti membaca buku cerita bergambar!
          </p>

          {/* 3D Mini Interactive Floating Showcase (Icons) */}
          <div className="my-6 sm:my-8 flex items-center justify-center gap-1.5 sm:gap-7 w-full max-w-full px-1 box-border">
            <div className="animate-float flex flex-col items-center py-2.5 px-3 sm:p-5 bg-white/95 backdrop-blur-xs rounded-2xl sm:rounded-[28px] border-2 sm:border-3 border-sky-200 shadow-md hover:border-amber-400 transition-all shrink-0">
              <span className="text-2xl sm:text-5xl">🧊</span>
              <span className="text-[10px] sm:text-sm font-black text-sky-800 mt-1 sm:mt-2 font-heading">Padat</span>
            </div>
            <div className="text-amber-400 text-sm sm:text-2xl font-black shrink-0 px-0.5">➔</div>
            <div className="animate-float [animation-delay:1s] flex flex-col items-center py-2.5 px-3 sm:p-5 bg-white/95 backdrop-blur-xs rounded-2xl sm:rounded-[28px] border-2 sm:border-3 border-teal-200 shadow-md hover:border-amber-400 transition-all shrink-0">
              <span className="text-2xl sm:text-5xl">💧</span>
              <span className="text-[10px] sm:text-sm font-black text-teal-800 mt-1 sm:mt-2 font-heading">Cair</span>
            </div>
            <div className="text-amber-400 text-sm sm:text-2xl font-black shrink-0 px-0.5">➔</div>
            <div className="animate-float [animation-delay:2s] flex flex-col items-center py-2.5 px-3 sm:p-5 bg-white/95 backdrop-blur-xs rounded-2xl sm:rounded-[28px] border-2 sm:border-3 border-purple-200 shadow-md hover:border-amber-400 transition-all shrink-0">
              <span className="text-2xl sm:text-5xl">☁️</span>
              <span className="text-[10px] sm:text-sm font-black text-purple-800 mt-1 sm:mt-2 font-heading">Gas</span>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md px-2">
            <button
              onClick={() => {
                sound.playPop();
                onNavigate('states');
              }}
              className="w-full sm:flex-1 py-3.5 sm:py-4 px-5 sm:px-6 rounded-[22px] sm:rounded-[24px] bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-500 hover:to-orange-600 text-white font-black text-sm sm:text-base shadow-lg shadow-orange-500/30 border-2 border-amber-300 flex items-center justify-center gap-2 transform transition-all active:scale-95 cursor-pointer font-heading"
            >
              <span>🚀 MULAI BELAJAR</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                onNavigate('lab');
              }}
              className="w-full sm:flex-1 py-3.5 sm:py-4 px-5 sm:px-6 rounded-[22px] sm:rounded-[24px] bg-white hover:bg-amber-50/70 text-slate-800 font-black text-sm sm:text-base border-3 border-amber-300/80 shadow-md shadow-amber-500/10 flex items-center justify-center gap-2 transform transition-all active:scale-95 cursor-pointer font-heading"
            >
              <span>🔬 COBA EKSPERIMEN</span>
            </button>

            {onOpenTopScorers && (
              <button
                onClick={() => {
                  sound.playPop();
                  onOpenTopScorers();
                }}
                className="w-full mt-1 sm:mt-2 py-3 px-4 rounded-[22px] bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200 hover:from-amber-200 hover:to-yellow-200 text-amber-950 font-black text-xs sm:text-sm border-2 border-amber-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 font-heading"
                title="Lihat 5 Siswa dengan Nilai Tertinggi (Medali Emas, Perak, Perunggu)"
              >
                <Trophy className="w-4 h-4 text-amber-900" />
                <span>🏆 Papan Juara: Lihat Top 5 Scorers Kelas</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. THREE STATES OF MATTER QUICK ACCESS CARDS */}
      <section className="max-w-6xl mx-auto px-4 w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Tiga Wujud Benda di Sekitar Kita
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Klik salah satu kartu untuk melihat wujud zat dalam model 3D nyata!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Padat */}
          <div
            onClick={() => {
              sound.playPop();
              onNavigate('states');
            }}
            className="group bg-white/95 backdrop-blur-md p-6 sm:p-7 rounded-[32px] border-3 border-sky-200 hover:border-amber-400 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1.5"
          >
            <div>
              <div className="w-16 h-16 rounded-[22px] bg-gradient-to-tr from-sky-100 to-sky-200 text-sky-800 border-2 border-sky-300 text-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
                🧊
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                ZAT PADAT
              </h3>
              <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                Benda padat memiliki <strong>bentuk dan volume yang tetap</strong>. Tidak berubah bentuk saat dipindahkan!
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="text-xs bg-amber-50 text-amber-950 font-black px-3 py-1 rounded-xl border border-amber-300 shadow-2xs">Es batu</span>
                <span className="text-xs bg-amber-50 text-amber-950 font-black px-3 py-1 rounded-xl border border-amber-300 shadow-2xs">Batu kali</span>
                <span className="text-xs bg-amber-50 text-amber-950 font-black px-3 py-1 rounded-xl border border-amber-300 shadow-2xs">Pensil</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-orange-600 font-black text-sm group-hover:translate-x-1 transition-transform font-heading">
              <span>Buka Cerita 3D ✨</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </div>
          </div>

          {/* Card Cair */}
          <div
            onClick={() => {
              sound.playPop();
              onNavigate('states');
            }}
            className="group bg-white/95 backdrop-blur-md p-6 sm:p-7 rounded-[32px] border-3 border-teal-200 hover:border-amber-400 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1.5"
          >
            <div>
              <div className="w-16 h-16 rounded-[22px] bg-gradient-to-tr from-teal-100 to-teal-200 text-teal-800 border-2 border-teal-300 text-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
                💧
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                ZAT CAIR
              </h3>
              <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                Benda cair memiliki <strong>volume tetap</strong>, tetapi <strong>bentuknya selalu mengikuti wadah</strong> yang ditempatinya.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="text-xs bg-amber-50 text-amber-950 font-black px-3 py-1 rounded-xl border border-amber-300 shadow-2xs">Air putih</span>
                <span className="text-xs bg-amber-50 text-amber-950 font-black px-3 py-1 rounded-xl border border-amber-300 shadow-2xs">Minyak</span>
                <span className="text-xs bg-amber-50 text-amber-950 font-black px-3 py-1 rounded-xl border border-amber-300 shadow-2xs">Susu</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-orange-600 font-black text-sm group-hover:translate-x-1 transition-transform font-heading">
              <span>Buka Cerita 3D ✨</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </div>
          </div>

          {/* Card Gas */}
          <div
            onClick={() => {
              sound.playPop();
              onNavigate('states');
            }}
            className="group bg-white/95 backdrop-blur-md p-6 sm:p-7 rounded-[32px] border-3 border-purple-200 hover:border-amber-400 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1.5"
          >
            <div>
              <div className="w-16 h-16 rounded-[22px] bg-gradient-to-tr from-purple-100 to-purple-200 text-purple-800 border-2 border-purple-300 text-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
                ☁️
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                ZAT GAS
              </h3>
              <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                Gas <strong>tidak memiliki bentuk dan volume tetap</strong>. Partikelnya terbang bebas dan mengisi seluruh ruangan!
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="text-xs bg-amber-50 text-amber-950 font-black px-3 py-1 rounded-xl border border-amber-300 shadow-2xs">Udara</span>
                <span className="text-xs bg-amber-50 text-amber-950 font-black px-3 py-1 rounded-xl border border-amber-300 shadow-2xs">Uap air</span>
                <span className="text-xs bg-amber-50 text-amber-950 font-black px-3 py-1 rounded-xl border border-amber-300 shadow-2xs">Balon gas</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-orange-600 font-black text-sm group-hover:translate-x-1 transition-transform font-heading">
              <span>Buka Cerita 3D ✨</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. TAHUKAH KAMU? (Fun Fact) & PROGRESS CARD */}
      <section className="max-w-6xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Tahukah Kamu (7 cols) */}
        <div className="md:col-span-7 bg-gradient-to-br from-amber-100/95 via-yellow-50 to-orange-100/90 p-6 sm:p-8 rounded-[32px] border-3 border-amber-300 shadow-md shadow-amber-500/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-700 stroke-[2.5]" />
                <span className="text-xs sm:text-sm font-black uppercase text-amber-950 tracking-wider font-heading">
                  💡 Tahukah Kamu?
                </span>
              </div>
              <button
                onClick={handleNextFact}
                className="text-xs font-black text-amber-950 hover:text-black bg-amber-300 hover:bg-amber-400 px-3 py-1 rounded-full flex items-center gap-1 transition-colors cursor-pointer shadow-2xs border border-amber-400 font-heading"
              >
                <span>Fakta Lain 🔄</span>
              </button>
            </div>
            <p className="text-base sm:text-xl font-bold text-slate-800 leading-snug">
              "{FUN_FACTS[activeFactIdx]}"
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-300/70 flex items-center justify-between text-xs sm:text-sm text-amber-950 font-bold">
            <span>Fakta #{activeFactIdx + 1} dari {FUN_FACTS.length}</span>
            <span>✨ Rahasia Alam Semesta</span>
          </div>
        </div>

        {/* Learning Journey Tracker (5 cols) */}
        <div className="md:col-span-5 bg-white/95 p-6 sm:p-8 rounded-[32px] border-3 border-sky-200 shadow-md shadow-sky-500/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-orange-500 stroke-[2.5]" />
              <span className="text-xs sm:text-sm font-black uppercase text-orange-600 tracking-wider font-heading">
                Petualangan Belajarmu
              </span>
            </div>
            <h4 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
              {progress.badgeUnlocked === 'expert'
                ? '🏆 Kamu adalah Ahli Wujud Zat!'
                : progress.badgeUnlocked === 'explorer'
                ? '🏅 Penjelajah Wujud Zat Hebat!'
                : 'Yuk Selesaikan Misi Belajar!'}
            </h4>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1 leading-relaxed">
              Jelajahi wujud zat, coba eksperimen 3D, dan taklukkan kuis 10 soal untuk membuka lencana juara!
            </p>
          </div>

          <div className="mt-5">
            <button
              onClick={() => {
                sound.playPop();
                onNavigate('quiz');
              }}
              className="w-full py-3.5 px-4 rounded-[22px] bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-500 hover:to-orange-600 text-white font-black text-sm sm:text-base border-2 border-amber-300 shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer font-heading"
            >
              <span>{progress.completedQuiz ? 'Ulangi Kuis 📝' : 'Mulai Kuis 10 Soal 📝'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
