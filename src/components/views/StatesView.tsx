import React, { useState } from 'react';
import { StateOfMatter } from '../../types';
import { STATES_DATA } from '../../data/learningData';
import { Matter3DViewer } from '../3d/Matter3DViewer';
import { Sparkles, ArrowRight, Check, Droplets, Box, Wind, Compass } from 'lucide-react';
import { sound } from '../../utils/audio';

export const StatesView: React.FC = () => {
  const [selectedState, setSelectedState] = useState<StateOfMatter>('solid');
  const [isParticleMode, setIsParticleMode] = useState<boolean>(false);
  const [liquidContainer, setLiquidContainer] = useState<'glass' | 'flask' | 'bowl'>('glass');

  const currentState = STATES_DATA[selectedState];

  const handleSelectState = (state: StateOfMatter) => {
    sound.playPop();
    setSelectedState(state);
  };

  const handleToggleParticle = () => {
    setIsParticleMode(!isParticleMode);
  };

  const handleSelectContainer = (shape: 'glass' | 'flask' | 'bowl') => {
    sound.playPop();
    setLiquidContainer(shape);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 pb-16 flex flex-col gap-4 sm:gap-8">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mt-2 sm:mt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-950 border-2 border-amber-300 text-xs sm:text-sm font-black mb-2 sm:mb-3 shadow-xs">
          <span>🧊 Cerita 3 Wujud Materi di Sekitar Kita ⭐</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading tracking-tight">
          Mengenal Wujud Zat & Partikel
        </h2>
        <p className="mt-1 sm:mt-2 text-xs sm:text-base text-slate-700 font-bold">
          Pilih zat di bawah ini, amati objek 3D interaktif, dan intip rahasia susunan partikelnya!
        </p>
      </div>

      {/* 3 Main Choice Cards - Compact on mobile */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6">
        {/* Padat Card */}
        <button
          onClick={() => handleSelectState('solid')}
          className={`p-2.5 sm:p-6 rounded-2xl sm:rounded-[30px] border-3 text-center sm:text-left transition-all duration-200 cursor-pointer flex flex-col justify-between items-center sm:items-stretch ${
            selectedState === 'solid'
              ? 'bg-sky-50 border-sky-400 ring-4 ring-amber-300/70 shadow-lg shadow-sky-500/20 scale-[1.02]'
              : 'bg-white/95 border-sky-200/90 hover:border-amber-400 hover:shadow-md'
          }`}
        >
          <div className="w-full flex flex-col items-center sm:items-start">
            <div className="flex items-center justify-between w-full mb-1 sm:mb-3">
              <span className="text-2xl sm:text-4xl mx-auto sm:mx-0">🧊</span>
              {selectedState === 'solid' && (
                <span className="hidden sm:flex w-7 h-7 rounded-full bg-amber-400 text-amber-950 items-center justify-center font-black shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </span>
              )}
            </div>
            <h3 className="text-xs sm:text-2xl font-black text-slate-900 font-heading tracking-tight sm:tracking-normal">
              PADAT
            </h3>
            <p className="hidden sm:block text-xs text-amber-900 font-bold mt-1">
              Contoh: Es batu, batu, pensil
            </p>
            <p className="hidden sm:block text-sm font-bold text-slate-700 mt-2.5 leading-relaxed">
              “Benda padat memiliki bentuk dan volume yang tetap.”
            </p>
          </div>

          <div className="hidden sm:flex mt-5 pt-3 border-t border-slate-200/60 items-center text-xs font-black text-orange-600 font-heading">
            <span>Buka Model 3D ✨</span>
          </div>
        </button>

        {/* Cair Card */}
        <button
          onClick={() => handleSelectState('liquid')}
          className={`p-2.5 sm:p-6 rounded-2xl sm:rounded-[30px] border-3 text-center sm:text-left transition-all duration-200 cursor-pointer flex flex-col justify-between items-center sm:items-stretch ${
            selectedState === 'liquid'
              ? 'bg-teal-50 border-teal-400 ring-4 ring-amber-300/70 shadow-lg shadow-teal-500/20 scale-[1.02]'
              : 'bg-white/95 border-teal-200/90 hover:border-amber-400 hover:shadow-md'
          }`}
        >
          <div className="w-full flex flex-col items-center sm:items-start">
            <div className="flex items-center justify-between w-full mb-1 sm:mb-3">
              <span className="text-2xl sm:text-4xl mx-auto sm:mx-0">💧</span>
              {selectedState === 'liquid' && (
                <span className="hidden sm:flex w-7 h-7 rounded-full bg-amber-400 text-amber-950 items-center justify-center font-black shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </span>
              )}
            </div>
            <h3 className="text-xs sm:text-2xl font-black text-slate-900 font-heading tracking-tight sm:tracking-normal">
              CAIR
            </h3>
            <p className="hidden sm:block text-xs text-amber-900 font-bold mt-1">
              Contoh: Air, minyak, susu
            </p>
            <p className="hidden sm:block text-sm font-bold text-slate-700 mt-2.5 leading-relaxed">
              “Benda cair memiliki volume tetap, tetapi bentuknya mengikuti wadah.”
            </p>
          </div>

          <div className="hidden sm:flex mt-5 pt-3 border-t border-slate-200/60 items-center text-xs font-black text-orange-600 font-heading">
            <span>Buka Model 3D ✨</span>
          </div>
        </button>

        {/* Gas Card */}
        <button
          onClick={() => handleSelectState('gas')}
          className={`p-2.5 sm:p-6 rounded-2xl sm:rounded-[30px] border-3 text-center sm:text-left transition-all duration-200 cursor-pointer flex flex-col justify-between items-center sm:items-stretch ${
            selectedState === 'gas'
              ? 'bg-purple-50 border-purple-400 ring-4 ring-amber-300/70 shadow-lg shadow-purple-500/20 scale-[1.02]'
              : 'bg-white/95 border-purple-200/90 hover:border-amber-400 hover:shadow-md'
          }`}
        >
          <div className="w-full flex flex-col items-center sm:items-start">
            <div className="flex items-center justify-between w-full mb-1 sm:mb-3">
              <span className="text-2xl sm:text-4xl mx-auto sm:mx-0">☁️</span>
              {selectedState === 'gas' && (
                <span className="hidden sm:flex w-7 h-7 rounded-full bg-amber-400 text-amber-950 items-center justify-center font-black shadow-xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </span>
              )}
            </div>
            <h3 className="text-xs sm:text-2xl font-black text-slate-900 font-heading tracking-tight sm:tracking-normal">
              GAS
            </h3>
            <p className="hidden sm:block text-xs text-amber-900 font-bold mt-1">
              Contoh: Udara, uap, balon
            </p>
            <p className="hidden sm:block text-sm font-bold text-slate-700 mt-2.5 leading-relaxed">
              “Gas tidak memiliki bentuk dan volume tetap.”
            </p>
          </div>

          <div className="hidden sm:flex mt-5 pt-3 border-t border-slate-200/60 items-center text-xs font-black text-orange-600 font-heading">
            <span>Buka Model 3D ✨</span>
          </div>
        </button>
      </div>

      {/* 3D Showcase & In-Depth Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3D Stage (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5">
          <div className="h-[360px] sm:h-[480px] w-full">
            <Matter3DViewer
              stateType={selectedState}
              isParticleMode={isParticleMode}
              onToggleParticleMode={handleToggleParticle}
              containerShape={liquidContainer}
            />
          </div>

          {/* Liquid Special Feature: Pouring into different containers */}
          {selectedState === 'liquid' && !isParticleMode && (
            <div className="mt-5 sm:mt-4 relative z-10 p-4 sm:p-5 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border-2 border-teal-300 shadow-md flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs sm:text-sm font-bold text-slate-800 font-heading">
                🧪 Buktikan sifat cair: Bentuk mengikuti wadah!
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => handleSelectContainer('glass')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer font-heading ${
                    liquidContainer === 'glass'
                      ? 'bg-teal-600 text-white shadow-xs scale-[1.02]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Gelas Silinder
                </button>
                <button
                  onClick={() => handleSelectContainer('flask')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer font-heading ${
                    liquidContainer === 'flask'
                      ? 'bg-teal-600 text-white shadow-xs scale-[1.02]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Labu Kerucut
                </button>
                <button
                  onClick={() => handleSelectContainer('bowl')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer font-heading ${
                    liquidContainer === 'bowl'
                      ? 'bg-teal-600 text-white shadow-xs scale-[1.02]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Mangkuk Bulat
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Characteristics & Particle Explanation (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Main Info Card */}
          <div className="bg-white/95 p-6 sm:p-7 rounded-[32px] border-3 border-sky-200 shadow-md shadow-sky-500/10 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentState.emoji}</span>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                    {currentState.name}
                  </h4>
                  <span className="text-xs font-black text-orange-600 uppercase tracking-wider font-heading">
                    ⭐ Ciri-Ciri Utama
                  </span>
                </div>
              </div>
              <span className={`px-3.5 py-1.5 rounded-full text-xs font-black border-2 shadow-2xs ${currentState.badgeColor}`}>
                {currentState.particleLabel}
              </span>
            </div>

            {/* 3 Core Characteristics */}
            <div className="space-y-3 text-sm">
              <div className="p-3.5 rounded-[20px] bg-amber-50/70 border-2 border-amber-200/90 shadow-2xs">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wide block font-heading">
                  Bentuk (Shape)
                </span>
                <span className="font-bold text-slate-800 mt-0.5 block text-sm sm:text-base">
                  {currentState.characteristics.shape}
                </span>
              </div>

              <div className="p-3.5 rounded-[20px] bg-amber-50/70 border-2 border-amber-200/90 shadow-2xs">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wide block font-heading">
                  Volume (Isi)
                </span>
                <span className="font-bold text-slate-800 mt-0.5 block text-sm sm:text-base">
                  {currentState.characteristics.volume}
                </span>
              </div>

              <div className="p-3.5 rounded-[20px] bg-amber-50/70 border-2 border-amber-200/90 shadow-2xs">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wide block font-heading">
                  Susunan Partikel
                </span>
                <span className="font-bold text-slate-800 mt-0.5 block text-sm sm:text-base">
                  {currentState.characteristics.particles}
                </span>
              </div>
            </div>

            {/* Particle Special Callout */}
            <div className="p-4 rounded-[22px] bg-gradient-to-r from-yellow-50 to-amber-100/80 border-2 border-amber-300 shadow-2xs">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-orange-600 stroke-[2.5]" />
                <span className="text-xs font-black uppercase text-amber-950 tracking-wider font-heading">
                  Mengapa Bisa Begitu?
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
                {currentState.particleDesc}
              </p>
            </div>

            {/* Everyday Examples */}
            <div>
              <span className="text-xs font-black uppercase text-amber-900 tracking-wider block mb-2 font-heading">
                Contoh di Rumah & Sekolah:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentState.examples.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-100/80 text-amber-950 text-xs sm:text-sm font-black border border-amber-300 shadow-2xs"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
