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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-950 border-2 border-amber-300 text-xs sm:text-sm font-black mb-3 shadow-xs">
          <span>🔄 Cerita Siklus Perubahan Wujud Zat ⭐</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-950 font-heading tracking-tight">
          Diagram Perubahan Wujud Zat
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-900 font-black">
          Klik diagram atau tombol perubahan untuk menyaksikan simulasi animasi 3D live!
        </p>
      </div>

      {/* 1. INTERACTIVE TRIANGLE / MATRIX DIAGRAM & 3D STAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Diagram (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Group 1: Menerima Panas */}
          <div className="bg-gradient-to-br from-amber-100/95 via-yellow-50 to-orange-100/85 p-5 sm:p-6 rounded-[32px] border-3 border-amber-300 shadow-md shadow-amber-500/10">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-orange-600 stroke-[2.5]" />
              <h3 className="text-sm sm:text-base font-black text-amber-950 uppercase tracking-wider font-heading">
                🔥 MENERIMA PANAS (Dipanaskan)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Mencair */}
              <button
                onClick={() => handleSelectTransition('melting')}
                className={`p-3.5 rounded-[22px] border-2 text-left transition-all cursor-pointer ${
                  activeTransition === 'melting'
                    ? 'bg-amber-400 text-amber-950 border-amber-600 font-black shadow-md scale-[1.02] ring-2 ring-amber-300'
                    : 'bg-white/98 text-slate-950 font-black border-amber-300 hover:bg-amber-50'
                }`}
              >
                <div className="text-xs font-black opacity-90 font-heading">PADAT ➔ CAIR</div>
                <div className="text-base sm:text-lg font-black mt-0.5 font-heading">Mencair 🧊💧</div>
              </button>

              {/* Menguap */}
              <button
                onClick={() => handleSelectTransition('evaporation')}
                className={`p-3.5 rounded-[22px] border-2 text-left transition-all cursor-pointer ${
                  activeTransition === 'evaporation'
                    ? 'bg-orange-500 text-white border-orange-700 font-black shadow-md scale-[1.02] ring-2 ring-orange-300'
                    : 'bg-white/98 text-slate-950 font-black border-orange-300 hover:bg-orange-50'
                }`}
              >
                <div className="text-xs font-black opacity-90 font-heading">CAIR ➔ GAS</div>
                <div className="text-base sm:text-lg font-black mt-0.5 font-heading">Menguap 💧☁️</div>
              </button>

              {/* Menyublim */}
              <button
                onClick={() => handleSelectTransition('sublimation')}
                className={`p-3.5 rounded-[22px] border-2 text-left transition-all cursor-pointer ${
                  activeTransition === 'sublimation'
                    ? 'bg-purple-600 text-white border-purple-800 font-black shadow-md scale-[1.02] ring-2 ring-purple-300'
                    : 'bg-white/98 text-slate-950 font-black border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="text-xs font-black opacity-90 font-heading">PADAT ➔ GAS</div>
                <div className="text-base sm:text-lg font-black mt-0.5 font-heading">Menyublim 🧊☁️</div>
              </button>
            </div>
          </div>

          {/* Group 2: Melepaskan Panas */}
          <div className="bg-gradient-to-br from-sky-100/95 via-cyan-50 to-indigo-100/85 p-5 sm:p-6 rounded-[32px] border-3 border-sky-300 shadow-md shadow-sky-500/10">
            <div className="flex items-center gap-2 mb-3">
              <Snowflake className="w-5 h-5 text-sky-700 stroke-[3]" />
              <h3 className="text-sm sm:text-base font-black text-sky-950 uppercase tracking-wider font-heading">
                ❄️ MELEPASKAN PANAS (Didinginkan)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Membeku */}
              <button
                onClick={() => handleSelectTransition('freezing')}
                className={`p-3.5 rounded-[22px] border-2 text-left transition-all cursor-pointer ${
                  activeTransition === 'freezing'
                    ? 'bg-sky-500 text-white border-sky-700 font-black shadow-md scale-[1.02] ring-2 ring-sky-300'
                    : 'bg-white/98 text-slate-950 font-black border-sky-300 hover:bg-sky-50'
                }`}
              >
                <div className="text-xs font-black opacity-90 font-heading">CAIR ➔ PADAT</div>
                <div className="text-base sm:text-lg font-black mt-0.5 font-heading">Membeku 💧🧊</div>
              </button>

              {/* Mengembun */}
              <button
                onClick={() => handleSelectTransition('condensation')}
                className={`p-3.5 rounded-[22px] border-2 text-left transition-all cursor-pointer ${
                  activeTransition === 'condensation'
                    ? 'bg-cyan-600 text-white border-cyan-800 font-black shadow-md scale-[1.02] ring-2 ring-cyan-300'
                    : 'bg-white/98 text-slate-950 font-black border-cyan-300 hover:bg-cyan-50'
                }`}
              >
                <div className="text-xs font-black opacity-90 font-heading">GAS ➔ CAIR</div>
                <div className="text-base sm:text-lg font-black mt-0.5 font-heading">Mengembun ☁️💧</div>
              </button>

              {/* Mengkristal */}
              <button
                onClick={() => handleSelectTransition('deposition')}
                className={`p-3.5 rounded-[22px] border-2 text-left transition-all cursor-pointer ${
                  activeTransition === 'deposition'
                    ? 'bg-indigo-600 text-white border-indigo-800 font-black shadow-md scale-[1.02] ring-2 ring-indigo-300'
                    : 'bg-white/98 text-slate-950 font-black border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                <div className="text-xs font-black opacity-90 font-heading">GAS ➔ PADAT</div>
                <div className="text-base sm:text-lg font-black mt-0.5 font-heading">Mengkristal ☁️🧊</div>
              </button>
            </div>
          </div>

          {/* Interactive Visual Cycle Map */}
          <div className="p-2.5 sm:p-6 bg-white/98 backdrop-blur-md rounded-2xl sm:rounded-3xl border-3 border-slate-300 shadow-md flex flex-col items-center w-full max-w-full overflow-hidden box-border">
            <div className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider mb-1.5 sm:mb-4">
              Peta Visual Hubungan Tiga Zat
            </div>
            <div className="w-full max-w-full flex justify-between items-center relative py-1.5 sm:py-4 gap-0.5 sm:gap-2 box-border">
              {/* Padat Node */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-sky-100 border-2 border-sky-400 flex items-center justify-center text-base sm:text-2xl shadow-xs">
                  🧊
                </div>
                <span className="text-[10px] sm:text-xs font-black text-slate-950 mt-0.5 sm:mt-1">PADAT</span>
              </div>

              {/* Center Arrows 1 */}
              <div className="flex-1 min-w-0 flex flex-col items-center gap-0.5 sm:gap-2 px-0.5 sm:px-2">
                <div className="w-full flex items-center justify-center text-[9px] sm:text-[11px] font-black text-amber-950 bg-amber-100 px-0.5 sm:px-2 py-0.5 rounded-full border-2 border-amber-300 truncate">
                  <span className="truncate">Mencair ➔</span>
                </div>
                <div className="w-full flex items-center justify-center text-[9px] sm:text-[11px] font-black text-sky-950 bg-sky-100 px-0.5 sm:px-2 py-0.5 rounded-full border-2 border-sky-300 truncate">
                  <span className="truncate hidden sm:inline">⬅ Membeku</span>
                  <span className="truncate sm:hidden">⬅ Beku</span>
                </div>
              </div>

              {/* Cair Node */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-teal-100 border-2 border-teal-400 flex items-center justify-center text-base sm:text-2xl shadow-xs">
                  💧
                </div>
                <span className="text-[10px] sm:text-xs font-black text-slate-950 mt-0.5 sm:mt-1">CAIR</span>
              </div>

              {/* Center Arrows 2 */}
              <div className="flex-1 min-w-0 flex flex-col items-center gap-0.5 sm:gap-2 px-0.5 sm:px-2">
                <div className="w-full flex items-center justify-center text-[9px] sm:text-[11px] font-black text-orange-950 bg-orange-100 px-0.5 sm:px-2 py-0.5 rounded-full border-2 border-orange-300 truncate">
                  <span className="truncate">Menguap ➔</span>
                </div>
                <div className="w-full flex items-center justify-center text-[9px] sm:text-[11px] font-black text-cyan-950 bg-cyan-100 px-0.5 sm:px-2 py-0.5 rounded-full border-2 border-cyan-300 truncate">
                  <span className="truncate hidden sm:inline">⬅ Mengembun</span>
                  <span className="truncate sm:hidden">⬅ Embun</span>
                </div>
              </div>

              {/* Gas Node */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-purple-100 border-2 border-purple-400 flex items-center justify-center text-base sm:text-2xl shadow-xs">
                  ☁️
                </div>
                <span className="text-[10px] sm:text-xs font-black text-slate-950 mt-0.5 sm:mt-1">GAS</span>
              </div>
            </div>
            
            {/* Long distance jump: Menyublim & Mengkristal */}
            <div className="w-full pt-2 sm:pt-3 mt-1.5 sm:mt-2 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] sm:text-xs font-black text-slate-900 text-center">
              <span className="text-purple-900 font-black">Padat ➜ Gas : Menyublim ✨</span>
              <span className="text-indigo-900 font-black">Gas ➜ Padat : Mengkristal ❄️</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Animation & Detailed Explanation (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <Transition3DViewer transitionType={activeTransition} />

          <div className="bg-white/95 p-6 rounded-[32px] border-3 border-sky-200 shadow-md shadow-sky-500/10 flex flex-col gap-4">
            <div>
              <div className="inline-block px-3.5 py-1.5 rounded-full text-xs font-black mb-2 bg-amber-100 text-amber-950 border-2 border-amber-300 shadow-2xs">
                {currentTransMeta.heatLabel}
              </div>
              <h4 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                Proses {currentTransMeta.name}
              </h4>
              <p className="text-xs sm:text-sm font-black text-orange-600 mt-0.5 font-heading">
                {currentTransMeta.simpleFormula}
              </p>
            </div>

            <p className="text-sm sm:text-base font-bold text-slate-700 leading-relaxed bg-amber-50/70 p-4 rounded-[22px] border-2 border-amber-200/90">
              {currentTransMeta.explanation}
            </p>

            <div className="p-4 rounded-[22px] bg-sky-50 border-2 border-sky-200">
              <span className="text-xs font-black uppercase text-sky-950 tracking-wide block mb-1 font-heading">
                🌟 Contoh di Kehidupan Sehari-hari:
              </span>
              <p className="text-xs sm:text-sm text-slate-700 font-bold">
                {currentTransMeta.dailyExample}
              </p>
            </div>

            <div className="text-xs sm:text-sm font-black text-amber-950 bg-gradient-to-r from-amber-100 to-yellow-100 p-3.5 rounded-[20px] border-2 border-amber-300 shadow-2xs">
              💡 {currentTransMeta.funFact}
            </div>
          </div>
        </div>
      </div>

      {/* 2. FITUR "COBA SENDIRI" (Mini Simulasi Interaktif - Section 10) */}
      <section className="bg-gradient-to-br from-amber-100/90 via-sky-50 to-orange-100/80 p-6 sm:p-8 rounded-[36px] border-3 border-amber-300 shadow-lg shadow-amber-500/10">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-300 text-amber-950 text-xs sm:text-sm font-black shadow-xs mb-2 border border-amber-400">
            <Compass className="w-4 h-4 text-orange-700 stroke-[2.5]" />
            <span>Mini Lab Mandiri Siswa ⭐</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            Fitur: Coba Sendiri!
          </h3>
          <p className="text-xs sm:text-base text-slate-700 font-bold mt-1">
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
