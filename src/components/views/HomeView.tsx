import React, { useState } from 'react';
import { NavPage, UserProgress } from '../../types';
import { STATES_DATA, FUN_FACTS } from '../../data/learningData';
import { ArrowRight, Sparkles, Award, Lightbulb, Play, BookOpen, FlaskConical, RefreshCw } from 'lucide-react';
import { sound } from '../../utils/audio';

interface HomeViewProps {
  onNavigate: (page: NavPage) => void;
  progress: UserProgress;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, progress }) => {
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100/90 border border-sky-200/80 text-sky-800 text-xs sm:text-sm font-bold shadow-xs mb-6">
            <span>✨ Media Pembelajaran IPA Interaktif SD</span>
            <span className="text-slate-300">•</span>
            <span className="text-sky-600">Kelas 4 – 6</span>
          </div>

          {/* Big Hero Title */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight font-heading leading-tight max-w-3xl">
            Yuk, Kenali <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-teal-600 to-indigo-600">Wujud Zat!</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-lg sm:text-xl font-medium text-slate-600 max-w-2xl leading-relaxed">
            Jelajahi dunia zat melalui pengalaman 3D yang seru dan interaktif. Amati es, air, dan uap dari dekat!
          </p>

          {/* 3D Mini Interactive Floating Showcase (Icons) */}
          <div className="mt-8 mb-8 flex items-center justify-center gap-4 sm:gap-8">
            <div className="animate-float flex flex-col items-center p-4 bg-white/90 backdrop-blur-xs rounded-3xl border border-sky-100 shadow-md">
              <span className="text-4xl sm:text-5xl">🧊</span>
              <span className="text-xs font-bold text-sky-800 mt-2">Padat</span>
            </div>
            <div className="text-slate-300 text-xl font-black">➔</div>
            <div className="animate-float [animation-delay:1s] flex flex-col items-center p-4 bg-white/90 backdrop-blur-xs rounded-3xl border border-teal-100 shadow-md">
              <span className="text-4xl sm:text-5xl">💧</span>
              <span className="text-xs font-bold text-teal-800 mt-2">Cair</span>
            </div>
            <div className="text-slate-300 text-xl font-black">➔</div>
            <div className="animate-float [animation-delay:2s] flex flex-col items-center p-4 bg-white/90 backdrop-blur-xs rounded-3xl border border-purple-100 shadow-md">
              <span className="text-4xl sm:text-5xl">☁️</span>
              <span className="text-xs font-bold text-purple-800 mt-2">Gas</span>
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-md">
            <button
              onClick={() => {
                sound.playPop();
                onNavigate('states');
              }}
              className="flex-1 min-w-[200px] py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold text-base shadow-lg shadow-sky-500/25 flex items-center justify-center gap-3 transform transition-all active:scale-95 cursor-pointer"
            >
              <span>🚀 MULAI BELAJAR</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                onNavigate('lab');
              }}
              className="flex-1 min-w-[200px] py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-base border-2 border-slate-200/90 shadow-sm flex items-center justify-center gap-2 transform transition-all active:scale-95 cursor-pointer"
            >
              <span>🔬 COBA EKSPERIMEN</span>
            </button>
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
            className="group bg-white/95 backdrop-blur-md p-6 sm:p-7 rounded-3xl border-2 border-sky-200/90 hover:border-sky-400 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1.5"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-sky-100/80 text-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
                🧊
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                ZAT PADAT
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Benda padat memiliki <strong>bentuk dan volume yang tetap</strong>. Tidak berubah saat dipindahkan!
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="text-xs bg-sky-50 text-sky-800 font-bold px-2.5 py-1 rounded-lg border border-sky-200/60">Es batu</span>
                <span className="text-xs bg-sky-50 text-sky-800 font-bold px-2.5 py-1 rounded-lg border border-sky-200/60">Batu kali</span>
                <span className="text-xs bg-sky-50 text-sky-800 font-bold px-2.5 py-1 rounded-lg border border-sky-200/60">Pensil</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sky-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
              <span>Lihat dalam 3D</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card Cair */}
          <div
            onClick={() => {
              sound.playPop();
              onNavigate('states');
            }}
            className="group bg-white/95 backdrop-blur-md p-6 sm:p-7 rounded-3xl border-2 border-teal-200/90 hover:border-teal-400 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1.5"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-teal-100/80 text-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
                💧
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                ZAT CAIR
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Benda cair memiliki <strong>volume tetap</strong>, tetapi <strong>bentuknya mengikuti wadah</strong> yang ditempatinya.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="text-xs bg-teal-50 text-teal-800 font-bold px-2.5 py-1 rounded-lg border border-teal-200/60">Air putih</span>
                <span className="text-xs bg-teal-50 text-teal-800 font-bold px-2.5 py-1 rounded-lg border border-teal-200/60">Minyak</span>
                <span className="text-xs bg-teal-50 text-teal-800 font-bold px-2.5 py-1 rounded-lg border border-teal-200/60">Susu</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-teal-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
              <span>Lihat dalam 3D</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card Gas */}
          <div
            onClick={() => {
              sound.playPop();
              onNavigate('states');
            }}
            className="group bg-white/95 backdrop-blur-md p-6 sm:p-7 rounded-3xl border-2 border-purple-200/90 hover:border-purple-400 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1.5"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-purple-100/80 text-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
                ☁️
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                ZAT GAS
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Gas <strong>tidak memiliki bentuk dan volume tetap</strong>. Bergerak bebas mengisi seluruh ruangan!
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="text-xs bg-purple-50 text-purple-800 font-bold px-2.5 py-1 rounded-lg border border-purple-200/60">Udara</span>
                <span className="text-xs bg-purple-50 text-purple-800 font-bold px-2.5 py-1 rounded-lg border border-purple-200/60">Uap air</span>
                <span className="text-xs bg-purple-50 text-purple-800 font-bold px-2.5 py-1 rounded-lg border border-purple-200/60">Balon gas</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-purple-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
              <span>Lihat dalam 3D</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. TAHUKAH KAMU? (Fun Fact) & PROGRESS CARD */}
      <section className="max-w-6xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Tahukah Kamu (7 cols) */}
        <div className="md:col-span-7 bg-gradient-to-r from-amber-50 to-orange-50 p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                <span className="text-xs font-black uppercase text-amber-800 tracking-wider">
                  Tahukah Kamu?
                </span>
              </div>
              <button
                onClick={handleNextFact}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Fakta Lain</span>
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
            <p className="text-base sm:text-lg font-bold text-slate-800 leading-snug">
              "{FUN_FACTS[activeFactIdx]}"
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-200/60 flex items-center justify-between text-xs text-amber-800/80 font-semibold">
            <span>Fakta #{activeFactIdx + 1} dari {FUN_FACTS.length}</span>
            <span>💡 Rahasia Alam Semesta</span>
          </div>
        </div>

        {/* Learning Journey Tracker (5 cols) */}
        <div className="md:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Perjalanan Belajarmu
              </span>
            </div>
            <h4 className="text-lg font-extrabold text-slate-900 font-heading">
              {progress.badgeUnlocked === 'expert'
                ? '🏆 Kamu adalah Ahli Wujud Zat!'
                : progress.badgeUnlocked === 'explorer'
                ? '🏅 Penjelajah Wujud Zat Hebat!'
                : 'Yuk Selesaikan Misi Belajar!'}
            </h4>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Jelajahi wujud zat, coba eksperimen 3D, dan taklukkan kuis 10 soal untuk membuka badge.
            </p>
          </div>

          <div className="mt-5">
            <button
              onClick={() => {
                sound.playPop();
                onNavigate('quiz');
              }}
              className="w-full py-3 px-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm border border-indigo-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{progress.completedQuiz ? 'Ulangi Kuis 📝' : 'Mulai Kuis 10 Soal 📝'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
