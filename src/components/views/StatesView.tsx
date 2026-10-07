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
        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-sky-100 text-sky-800 text-[11px] sm:text-xs font-bold mb-2 sm:mb-3">
          <span>🧊 3 Wujud Materi di Sekitar Kita</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
          Mengenal Wujud Zat & Partikel
        </h2>
        <p className="mt-1 sm:mt-2 text-xs sm:text-base text-slate-600 font-medium">
          Pilih zat di bawah ini, amati objek 3D secara interaktif, dan lihat susunan molekul partikelnya!
        </p>
      </div>

      {/* 3 Main Choice Cards - Compact on mobile */}
      <div className="grid grid-cols-3 gap-2 sm:gap-6">
        {/* Padat Card */}
        <button
          onClick={() => handleSelectState('solid')}
          className={`p-2.5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 text-center sm:text-left transition-all duration-200 cursor-pointer flex flex-col justify-between items-center sm:items-stretch ${
            selectedState === 'solid'
              ? 'bg-sky-50/80 border-sky-500 shadow-md sm:shadow-lg shadow-sky-500/15 scale-[1.02]'
              : 'bg-white border-slate-200/80 hover:border-sky-300 hover:shadow-md'
          }`}
        >
          <div className="w-full flex flex-col items-center sm:items-start">
            <div className="flex items-center justify-between w-full mb-1 sm:mb-3">
              <span className="text-2xl sm:text-4xl mx-auto sm:mx-0">🧊</span>
              {selectedState === 'solid' && (
                <span className="hidden sm:flex w-7 h-7 rounded-full bg-sky-500 text-white items-center justify-center">
                  <Check className="w-4 h-4 stroke-[3]" />
                </span>
              )}
            </div>
            <h3 className="text-xs sm:text-xl font-extrabold text-slate-900 font-heading tracking-tight sm:tracking-normal">
              PADAT
            </h3>
            <p className="hidden sm:block text-xs text-slate-500 font-semibold mt-1">
              Contoh: Es batu, batu, pensil
            </p>
            <p className="hidden sm:block text-sm font-medium text-slate-700 mt-2.5 leading-relaxed">
              “Benda padat memiliki bentuk dan volume yang tetap.”
            </p>
          </div>

          <div className="hidden sm:flex mt-5 pt-3 border-t border-slate-200/60 items-center text-xs font-bold text-sky-600">
            <span>Lihat dalam 3D →</span>
          </div>
        </button>

        {/* Cair Card */}
        <button
          onClick={() => handleSelectState('liquid')}
          className={`p-2.5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 text-center sm:text-left transition-all duration-200 cursor-pointer flex flex-col justify-between items-center sm:items-stretch ${
            selectedState === 'liquid'
              ? 'bg-teal-50/80 border-teal-500 shadow-md sm:shadow-lg shadow-teal-500/15 scale-[1.02]'
              : 'bg-white border-slate-200/80 hover:border-teal-300 hover:shadow-md'
          }`}
        >
          <div className="w-full flex flex-col items-center sm:items-start">
            <div className="flex items-center justify-between w-full mb-1 sm:mb-3">
              <span className="text-2xl sm:text-4xl mx-auto sm:mx-0">💧</span>
              {selectedState === 'liquid' && (
                <span className="hidden sm:flex w-7 h-7 rounded-full bg-teal-500 text-white items-center justify-center">
                  <Check className="w-4 h-4 stroke-[3]" />
                </span>
              )}
            </div>
            <h3 className="text-xs sm:text-xl font-extrabold text-slate-900 font-heading tracking-tight sm:tracking-normal">
              CAIR
            </h3>
            <p className="hidden sm:block text-xs text-slate-500 font-semibold mt-1">
              Contoh: Air, minyak, susu
            </p>
            <p className="hidden sm:block text-sm font-medium text-slate-700 mt-2.5 leading-relaxed">
              “Benda cair memiliki volume tetap, tetapi bentuknya mengikuti wadah.”
            </p>
          </div>

          <div className="hidden sm:flex mt-5 pt-3 border-t border-slate-200/60 items-center text-xs font-bold text-teal-600">
            <span>Lihat dalam 3D →</span>
          </div>
        </button>

        {/* Gas Card */}
        <button
          onClick={() => handleSelectState('gas')}
          className={`p-2.5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 text-center sm:text-left transition-all duration-200 cursor-pointer flex flex-col justify-between items-center sm:items-stretch ${
            selectedState === 'gas'
              ? 'bg-purple-50/80 border-purple-500 shadow-md sm:shadow-lg shadow-purple-500/15 scale-[1.02]'
              : 'bg-white border-slate-200/80 hover:border-purple-300 hover:shadow-md'
          }`}
        >
          <div className="w-full flex flex-col items-center sm:items-start">
            <div className="flex items-center justify-between w-full mb-1 sm:mb-3">
              <span className="text-2xl sm:text-4xl mx-auto sm:mx-0">☁️</span>
              {selectedState === 'gas' && (
                <span className="hidden sm:flex w-7 h-7 rounded-full bg-purple-500 text-white items-center justify-center">
                  <Check className="w-4 h-4 stroke-[3]" />
                </span>
              )}
            </div>
            <h3 className="text-xs sm:text-xl font-extrabold text-slate-900 font-heading tracking-tight sm:tracking-normal">
              GAS
            </h3>
            <p className="hidden sm:block text-xs text-slate-500 font-semibold mt-1">
              Contoh: Udara, uap, balon
            </p>
            <p className="hidden sm:block text-sm font-medium text-slate-700 mt-2.5 leading-relaxed">
              “Gas tidak memiliki bentuk dan volume tetap.”
            </p>
          </div>

          <div className="hidden sm:flex mt-5 pt-3 border-t border-slate-200/60 items-center text-xs font-bold text-purple-600">
            <span>Lihat dalam 3D →</span>
          </div>
        </button>
      </div>

      {/* 3D Showcase & In-Depth Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3D Stage (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="h-[340px] sm:h-[480px]">
            <Matter3DViewer
              stateType={selectedState}
              isParticleMode={isParticleMode}
              onToggleParticleMode={handleToggleParticle}
              containerShape={liquidContainer}
            />
          </div>

          {/* Liquid Special Feature: Pouring into different containers */}
          {selectedState === 'liquid' && !isParticleMode && (
            <div className="p-4 bg-white rounded-2xl border border-teal-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-bold text-slate-700">
                🧪 Buktikan sifat cair: Bentuk mengikuti wadah!
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleSelectContainer('glass')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    liquidContainer === 'glass'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Gelas Silinder
                </button>
                <button
                  onClick={() => handleSelectContainer('flask')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    liquidContainer === 'flask'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Labu Kerucut
                </button>
                <button
                  onClick={() => handleSelectContainer('bowl')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    liquidContainer === 'bowl'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentState.emoji}</span>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 font-heading">
                    {currentState.name}
                  </h4>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Karakteristik Utama
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${currentState.badgeColor}`}>
                {currentState.particleLabel}
              </span>
            </div>

            {/* 3 Core Characteristics */}
            <div className="space-y-3 text-sm">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
                  Bentuk (Shape)
                </span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {currentState.characteristics.shape}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
                  Volume (Isi)
                </span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {currentState.characteristics.volume}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
                  Susunan Partikel
                </span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {currentState.characteristics.particles}
                </span>
              </div>
            </div>

            {/* Particle Special Callout */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-black uppercase text-indigo-900 tracking-wider">
                  Mengapa Bisa Begitu?
                </span>
              </div>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">
                {currentState.particleDesc}
              </p>
            </div>

            {/* Everyday Examples */}
            <div>
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-2">
                Contoh di Rumah & Sekolah:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentState.examples.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold"
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
