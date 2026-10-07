import React from 'react';
import { LabExperiment3D } from '../3d/LabExperiment3D';
import { Sparkles, FlaskConical, Flame, Snowflake, ShieldCheck } from 'lucide-react';

export const LabView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 pb-16 flex flex-col gap-4 sm:gap-6">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mt-1 sm:mt-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-bold mb-2">
          <FlaskConical className="w-3.5 h-3.5 text-amber-700" />
          <span>Laboratorium Virtual Siswa</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
          Laboratorium Sains 3D
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium max-w-2xl mx-auto">
          Lakukan 4 eksperimen seru! Nyalakan api pemanas atau masukkan zat ke pendingin untuk mengamati perubahan wujud dan suhunya secara nyata.
        </p>
      </div>

      {/* Main 3D Experiment Environment */}
      <LabExperiment3D />

      {/* Educational Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Heat Absorption Principle */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-6 rounded-3xl border border-amber-200/80 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/25">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-extrabold text-slate-900 font-heading">
              Prinsip 1: Menerima Panas (Dipanaskan)
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
              Ketika benda menerima panas, suhu benda akan <strong>naik</strong>. Energi membuat partikel bergetar lebih kencang sehingga benda padat bisa <strong>mencair</strong> menjadi cair, dan benda cair bisa <strong>menguap</strong> menjadi gas.
            </p>
            <div className="mt-3 flex gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-200/70 text-amber-900">
                Padat ➜ Cair (Mencair)
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-orange-200/70 text-orange-900">
                Cair ➜ Gas (Menguap)
              </span>
            </div>
          </div>
        </div>

        {/* Heat Release Principle */}
        <div className="bg-gradient-to-br from-sky-50 to-indigo-50/60 p-6 rounded-3xl border border-sky-200/80 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-600/25">
            <Snowflake className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-extrabold text-slate-900 font-heading">
              Prinsip 2: Melepaskan Panas (Didinginkan)
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
              Ketika zat didinginkan, zat kehilangan energi panas dan suhunya <strong>turun</strong>. Partikel melambat dan merapat, sehingga gas bisa <strong>mengembun</strong> menjadi cairan, dan cairan bisa <strong>membeku</strong> menjadi padat.
            </p>
            <div className="mt-3 flex gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-cyan-200/70 text-cyan-900">
                Gas ➜ Cair (Mengembun)
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-200/70 text-sky-900">
                Cair ➜ Padat (Membeku)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
