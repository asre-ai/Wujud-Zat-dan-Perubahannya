import React, { useState } from 'react';
import { TransitionType, EverydayExample } from '../../types';
import { TRANSITIONS_DATA, EVERYDAY_EXAMPLES } from '../../data/learningData';
import { Transition3DViewer } from '../3d/Transition3DViewer';
import { Flame, Snowflake, ArrowRight, Sparkles, Check, HelpCircle, X, Compass } from 'lucide-react';
import { sound } from '../../utils/audio';

export const TransitionsView: React.FC = () => {
  const [activeTransition, setActiveTransition] = useState<TransitionType>('melting');
  const [selectedExample, setSelectedExample] = useState<EverydayExample | null>(null);

  // "Coba Sendiri" Mini Simulation States
  const [simSubstance, setSimSubstance] = useState<'ice' | 'water' | 'steam'>('ice');
  const [simCondition, setSimCondition] = useState<'heat' | 'cool'>('heat');

  const currentTransMeta = TRANSITIONS_DATA[activeTransition];

  const handleSelectTransition = (type: TransitionType) => {
    sound.playPop();
    setActiveTransition(type);
  };

  // Compute result for "Coba Sendiri"
  const getSimResult = () => {
    if (simSubstance === 'ice' && simCondition === 'heat') {
      return {
        title: 'Mencair! 🧊 ➜ 💧',
        desc: 'Es batu menyerap panas dari luar dan mencair menjadi air.',
        type: 'melting' as TransitionType,
        color: 'text-amber-600 bg-amber-50 border-amber-200'
      };
    }
    if (simSubstance === 'ice' && simCondition === 'cool') {
      return {
        title: 'Tetap Beku 🧊❄️',
        desc: 'Es yang didinginkan tetap berupa benda padat dan suhunya semakin dingin.',
        type: 'freezing' as TransitionType,
        color: 'text-sky-600 bg-sky-50 border-sky-200'
      };
    }
    if (simSubstance === 'water' && simCondition === 'heat') {
      return {
        title: 'Menguap! 💧 ➜ ☁️',
        desc: 'Air menerima panas dan partikelnya lepas ke udara menjadi uap gas.',
        type: 'evaporation' as TransitionType,
        color: 'text-orange-600 bg-orange-50 border-orange-200'
      };
    }
    if (simSubstance === 'water' && simCondition === 'cool') {
      return {
        title: 'Membeku! 💧 ➜ 🧊',
        desc: 'Air melepaskan panas dan membeku menjadi balok es padat.',
        type: 'freezing' as TransitionType,
        color: 'text-sky-600 bg-sky-50 border-sky-200'
      };
    }
    if (simSubstance === 'steam' && simCondition === 'cool') {
      return {
        title: 'Mengembun! ☁️ ➜ 💧',
        desc: 'Uap gas kehilangan panas dan berubah menjadi butiran tetes air.',
        type: 'condensation' as TransitionType,
        color: 'text-teal-600 bg-teal-50 border-teal-200'
      };
    }
    return {
      title: 'Memuai & Menyebar ☁️🔥',
      desc: 'Uap yang dipanaskan semakin memuai dan bergerak sangat cepat.',
      type: 'evaporation' as TransitionType,
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    };
  };

  const simResult = getSimResult();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 flex flex-col gap-12">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold mb-3">
          <span>🔄 Siklus Perubahan Wujud Zat</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
          Diagram Perubahan Wujud Zat
        </h2>
        <p className="mt-2 text-base text-slate-600 font-medium">
          Klik diagram atau tombol perubahan untuk menyaksikan simulasi animasi 3D live!
        </p>
      </div>

      {/* 1. INTERACTIVE TRIANGLE / MATRIX DIAGRAM & 3D STAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Diagram (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Group 1: Menerima Panas */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 p-5 rounded-3xl border border-amber-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-extrabold text-amber-900 uppercase tracking-wider font-heading">
                🔥 MENERIMA PANAS (Dipanaskan)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Mencair */}
              <button
                onClick={() => handleSelectTransition('melting')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTransition === 'melting'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-[1.02]'
                    : 'bg-white text-slate-800 border-amber-200/80 hover:bg-amber-50/50'
                }`}
              >
                <div className="text-xs font-bold opacity-80">PADAT ➔ CAIR</div>
                <div className="text-base font-extrabold mt-0.5">Mencair 🧊💧</div>
              </button>

              {/* Menguap */}
              <button
                onClick={() => handleSelectTransition('evaporation')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTransition === 'evaporation'
                    ? 'bg-orange-500 text-white border-orange-600 shadow-md scale-[1.02]'
                    : 'bg-white text-slate-800 border-orange-200/80 hover:bg-orange-50/50'
                }`}
              >
                <div className="text-xs font-bold opacity-80">CAIR ➔ GAS</div>
                <div className="text-base font-extrabold mt-0.5">Menguap 💧☁️</div>
              </button>

              {/* Menyublim */}
              <button
                onClick={() => handleSelectTransition('sublimation')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTransition === 'sublimation'
                    ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-[1.02]'
                    : 'bg-white text-slate-800 border-purple-200/80 hover:bg-purple-50/50'
                }`}
              >
                <div className="text-xs font-bold opacity-80">PADAT ➔ GAS</div>
                <div className="text-base font-extrabold mt-0.5">Menyublim 🧊☁️</div>
              </button>
            </div>
          </div>

          {/* Group 2: Melepaskan Panas */}
          <div className="bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-indigo-500/10 p-5 rounded-3xl border border-sky-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Snowflake className="w-5 h-5 text-sky-600" />
              <h3 className="text-sm font-extrabold text-sky-900 uppercase tracking-wider font-heading">
                ❄️ MELEPASKAN PANAS (Didinginkan)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Membeku */}
              <button
                onClick={() => handleSelectTransition('freezing')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTransition === 'freezing'
                    ? 'bg-sky-600 text-white border-sky-700 shadow-md scale-[1.02]'
                    : 'bg-white text-slate-800 border-sky-200/80 hover:bg-sky-50/50'
                }`}
              >
                <div className="text-xs font-bold opacity-80">CAIR ➔ PADAT</div>
                <div className="text-base font-extrabold mt-0.5">Membeku 💧🧊</div>
              </button>

              {/* Mengembun */}
              <button
                onClick={() => handleSelectTransition('condensation')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTransition === 'condensation'
                    ? 'bg-cyan-600 text-white border-cyan-700 shadow-md scale-[1.02]'
                    : 'bg-white text-slate-800 border-cyan-200/80 hover:bg-cyan-50/50'
                }`}
              >
                <div className="text-xs font-bold opacity-80">GAS ➔ CAIR</div>
                <div className="text-base font-extrabold mt-0.5">Mengembun ☁️💧</div>
              </button>

              {/* Mengkristal */}
              <button
                onClick={() => handleSelectTransition('deposition')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeTransition === 'deposition'
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-[1.02]'
                    : 'bg-white text-slate-800 border-indigo-200/80 hover:bg-indigo-50/50'
                }`}
              >
                <div className="text-xs font-bold opacity-80">GAS ➔ PADAT</div>
                <div className="text-base font-extrabold mt-0.5">Mengkristal ☁️🧊</div>
              </button>
            </div>
          </div>

          {/* Interactive Visual Cycle Map */}
          <div className="p-2.5 sm:p-6 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border-2 border-slate-200/90 shadow-xs flex flex-col items-center w-full max-w-full overflow-hidden box-border">
            <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 sm:mb-4">
              Peta Visual Hubungan Tiga Zat
            </div>
            <div className="w-full max-w-full flex justify-between items-center relative py-1.5 sm:py-4 gap-0.5 sm:gap-2 box-border">
              {/* Padat Node */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-sky-100 border border-sky-300 flex items-center justify-center text-base sm:text-2xl shadow-xs">
                  🧊
                </div>
                <span className="text-[9px] sm:text-xs font-bold text-slate-800 mt-0.5 sm:mt-1">PADAT</span>
              </div>

              {/* Center Arrows 1 */}
              <div className="flex-1 min-w-0 flex flex-col items-center gap-0.5 sm:gap-2 px-0.5 sm:px-2">
                <div className="w-full flex items-center justify-center text-[8px] sm:text-[11px] font-bold text-amber-600 bg-amber-50 px-0.5 sm:px-2 py-0.5 rounded-full border border-amber-200 truncate">
                  <span className="truncate">Mencair ➔</span>
                </div>
                <div className="w-full flex items-center justify-center text-[8px] sm:text-[11px] font-bold text-sky-600 bg-sky-50 px-0.5 sm:px-2 py-0.5 rounded-full border border-sky-200 truncate">
                  <span className="truncate hidden sm:inline">⬅ Membeku</span>
                  <span className="truncate sm:hidden">⬅ Beku</span>
                </div>
              </div>

              {/* Cair Node */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-teal-100 border border-teal-300 flex items-center justify-center text-base sm:text-2xl shadow-xs">
                  💧
                </div>
                <span className="text-[9px] sm:text-xs font-bold text-slate-800 mt-0.5 sm:mt-1">CAIR</span>
              </div>

              {/* Center Arrows 2 */}
              <div className="flex-1 min-w-0 flex flex-col items-center gap-0.5 sm:gap-2 px-0.5 sm:px-2">
                <div className="w-full flex items-center justify-center text-[8px] sm:text-[11px] font-bold text-orange-600 bg-orange-50 px-0.5 sm:px-2 py-0.5 rounded-full border border-orange-200 truncate">
                  <span className="truncate">Menguap ➔</span>
                </div>
                <div className="w-full flex items-center justify-center text-[8px] sm:text-[11px] font-bold text-cyan-600 bg-cyan-50 px-0.5 sm:px-2 py-0.5 rounded-full border border-cyan-200 truncate">
                  <span className="truncate hidden sm:inline">⬅ Mengembun</span>
                  <span className="truncate sm:hidden">⬅ Embun</span>
                </div>
              </div>

              {/* Gas Node */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center text-base sm:text-2xl shadow-xs">
                  ☁️
                </div>
                <span className="text-[9px] sm:text-xs font-bold text-slate-800 mt-0.5 sm:mt-1">GAS</span>
              </div>
            </div>
            
            {/* Long distance jump: Menyublim & Mengkristal */}
            <div className="w-full pt-2 sm:pt-3 mt-1.5 sm:mt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-1 text-[9px] sm:text-[11px] font-bold text-slate-500 text-center">
              <span className="text-purple-600">Padat ➜ Gas : Menyublim ✨</span>
              <span className="text-indigo-600">Gas ➜ Padat : Mengkristal ❄️</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Animation & Detailed Explanation (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <Transition3DViewer transitionType={activeTransition} />

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col gap-4">
            <div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 bg-slate-100 text-slate-800 border border-slate-200">
                {currentTransMeta.heatLabel}
              </div>
              <h4 className="text-2xl font-black text-slate-900 font-heading">
                Proses {currentTransMeta.name}
              </h4>
              <p className="text-xs font-mono font-bold text-indigo-600 mt-0.5">
                {currentTransMeta.simpleFormula}
              </p>
            </div>

            <p className="text-sm font-medium text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {currentTransMeta.explanation}
            </p>

            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
              <span className="text-xs font-bold uppercase text-sky-900 tracking-wide block mb-1">
                Contoh Nyata:
              </span>
              <p className="text-xs text-slate-700 font-medium">
                {currentTransMeta.dailyExample}
              </p>
            </div>

            <div className="text-xs font-semibold text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-100">
              💡 {currentTransMeta.funFact}
            </div>
          </div>
        </div>
      </div>

      {/* 2. FITUR "COBA SENDIRI" (Mini Simulasi Interaktif - Section 10) */}
      <section className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 p-6 sm:p-8 rounded-3xl border border-indigo-100 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-indigo-700 text-xs font-bold shadow-2xs mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Mini Lab Mandiri</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 font-heading">
            Fitur: Coba Sendiri!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Pilih zat mula-mula, lalu tentukan apakah kamu ingin memberi panas atau dingin. Lihat apa yang terjadi!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Step 1: Pilih Zat (4 cols) */}
          <div className="md:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col gap-3">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              1. Pilih Zat Awal:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  sound.playPop();
                  setSimSubstance('ice');
                }}
                className={`py-3 px-2 rounded-xl flex flex-col items-center gap-1 text-xs font-bold border transition-all cursor-pointer ${
                  simSubstance === 'ice'
                    ? 'bg-sky-500 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-2xl">🧊</span>
                <span>Es (Padat)</span>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  setSimSubstance('water');
                }}
                className={`py-3 px-2 rounded-xl flex flex-col items-center gap-1 text-xs font-bold border transition-all cursor-pointer ${
                  simSubstance === 'water'
                    ? 'bg-teal-500 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-2xl">💧</span>
                <span>Air (Cair)</span>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  setSimSubstance('steam');
                }}
                className={`py-3 px-2 rounded-xl flex flex-col items-center gap-1 text-xs font-bold border transition-all cursor-pointer ${
                  simSubstance === 'steam'
                    ? 'bg-purple-500 text-white border-purple-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-2xl">☁️</span>
                <span>Uap (Gas)</span>
              </button>
            </div>
          </div>

          {/* Step 2: Pilih Aksi Panas/Dingin (3 cols) */}
          <div className="md:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col gap-3">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              2. Beri Pengaruh:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  sound.playHeat();
                  setSimCondition('heat');
                }}
                className={`py-3 px-2 rounded-xl flex flex-col items-center gap-1 text-xs font-bold border transition-all cursor-pointer ${
                  simCondition === 'heat'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-2xl">☀️</span>
                <span>PANAS</span>
              </button>

              <button
                onClick={() => {
                  sound.playFreeze();
                  setSimCondition('cool');
                }}
                className={`py-3 px-2 rounded-xl flex flex-col items-center gap-1 text-xs font-bold border transition-all cursor-pointer ${
                  simCondition === 'cool'
                    ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="text-2xl">❄️</span>
                <span>DINGIN</span>
              </button>
            </div>
          </div>

          {/* Step 3: Hasil Reaksi Langsung (5 cols) */}
          <div className={`md:col-span-5 p-5 rounded-2xl border shadow-xs flex flex-col justify-between ${simResult.color}`}>
            <div>
              <span className="text-xs font-bold uppercase opacity-75 tracking-wider block">
                Hasil Eksperimenmu:
              </span>
              <h4 className="text-xl font-extrabold mt-1 font-heading">
                {simResult.title}
              </h4>
              <p className="text-xs sm:text-sm font-medium mt-1 leading-relaxed">
                {simResult.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-current/20 flex items-center justify-between">
              <button
                onClick={() => handleSelectTransition(simResult.type)}
                className="text-xs font-bold underline cursor-pointer"
              >
                Lihat animasi 3D lengkapnya ➜
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BAGIAN CONTOH DALAM KEHIDUPAN SEHARI-HARI (Section 9) */}
      <section className="flex flex-col gap-6">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Pernah Melihat Ini?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Perubahan wujud zat terjadi setiap hari di sekitar kita. Klik kartu untuk melihat penjelasannya!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {EVERYDAY_EXAMPLES.map(ex => (
            <div
              key={ex.id}
              onClick={() => {
                sound.playPop();
                setSelectedExample(ex);
              }}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-sky-300 shadow-2xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group transform hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {ex.emoji}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${ex.iconBg}`}>
                    {ex.transitionName}
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-slate-900 font-heading group-hover:text-sky-600 transition-colors">
                  {ex.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {ex.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600">
                <span>Pelajari sainsnya</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal for Everyday Example Detail */}
      {selectedExample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedExample(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-4xl mb-3">{selectedExample.emoji}</div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${selectedExample.iconBg}`}>
              Perubahan: {selectedExample.transitionName}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 font-heading mt-3">
              {selectedExample.title}
            </h3>

            <p className="text-sm text-slate-700 mt-2 font-medium">
              {selectedExample.description}
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs text-slate-700">
              <strong className="text-sky-900 block font-bold mb-1">
                🔬 Fakta Sains SD:
              </strong>
              {selectedExample.scienceDetail}
            </div>

            <button
              onClick={() => {
                sound.playPop();
                setActiveTransition(selectedExample.transitionType);
                setSelectedExample(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="mt-5 w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              Lihat Simulasi 3D {selectedExample.transitionName} ➜
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
