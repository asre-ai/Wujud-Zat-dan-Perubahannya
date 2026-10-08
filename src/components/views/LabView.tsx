import React from 'react';
import { LabExperiment3D } from '../3d/LabExperiment3D';
import { Sparkles, FlaskConical, Flame, Snowflake, ShieldCheck } from 'lucide-react';

export const LabView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 pb-16 flex flex-col gap-4 sm:gap-6">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mt-1 sm:mt-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-950 border-2 border-amber-300 text-xs sm:text-sm font-black mb-2 shadow-xs">
          <FlaskConical className="w-4 h-4 text-orange-600 stroke-[2.5]" />
          <span>🔬 Laboratorium Cerita Sains Siswa SD ⭐</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading tracking-tight">
          Laboratorium Sains 3D
        </h2>
        <p className="mt-1 text-xs sm:text-base text-slate-700 font-bold max-w-2xl mx-auto leading-relaxed">
          Lakukan 4 eksperimen seru! Nyalakan api pemanas atau masukkan zat ke pendingin untuk mengamati perubahan wujud dan suhunya secara nyata.
        </p>
      </div>

      {/* Main 3D Experiment Environment */}
      <LabExperiment3D />

      {/* Educational Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Heat Absorption Principle */}
        <div className="bg-gradient-to-br from-amber-100/90 via-yellow-50 to-orange-100/80 p-6 sm:p-7 rounded-[32px] border-3 border-amber-300 shadow-md shadow-amber-500/10 flex items-start gap-4">
          <div className="w-13 h-13 rounded-[20px] bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25 border-2 border-amber-300">
            <Flame className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
              Prinsip 1: Menerima Panas (Dipanaskan 🔥)
            </h4>
            <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1.5 leading-relaxed">
              Ketika benda menerima panas, suhu benda akan <strong>naik</strong>. Energi membuat partikel bergetar lebih kencang sehingga benda padat bisa <strong>mencair</strong>, dan benda cair bisa <strong>menguap</strong> menjadi gas.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs font-black px-3 py-1 rounded-xl bg-amber-200 text-amber-950 border border-amber-400 shadow-2xs font-heading">
                Padat ➜ Cair (Mencair 🧊💧)
              </span>
              <span className="text-xs font-black px-3 py-1 rounded-xl bg-orange-200 text-orange-950 border border-orange-400 shadow-2xs font-heading">
                Cair ➜ Gas (Menguap 💧☁️)
              </span>
            </div>
          </div>
        </div>

        {/* Heat Release Principle */}
        <div className="bg-gradient-to-br from-sky-100/90 via-cyan-50 to-indigo-100/80 p-6 sm:p-7 rounded-[32px] border-3 border-sky-300 shadow-md shadow-sky-500/10 flex items-start gap-4">
          <div className="w-13 h-13 rounded-[20px] bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/25 border-2 border-sky-300">
            <Snowflake className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-black text-slate-900 font-heading">
              Prinsip 2: Melepaskan Panas (Didinginkan ❄️)
            </h4>
            <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1.5 leading-relaxed">
              Ketika zat didinginkan, zat kehilangan energi panas dan suhunya <strong>turun</strong>. Partikel melambat dan merapat, sehingga gas bisa <strong>mengembun</strong> menjadi cairan, dan cairan bisa <strong>membeku</strong> menjadi padat.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs font-black px-3 py-1 rounded-xl bg-cyan-200 text-cyan-950 border border-cyan-400 shadow-2xs font-heading">
                Gas ➜ Cair (Mengembun ☁️💧)
              </span>
              <span className="text-xs font-black px-3 py-1 rounded-xl bg-sky-200 text-sky-950 border border-sky-400 shadow-2xs font-heading">
                Cair ➜ Padat (Membeku 💧🧊)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
