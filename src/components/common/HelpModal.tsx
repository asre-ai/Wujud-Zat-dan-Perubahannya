import React from 'react';
import { X, MousePointer, ZoomIn, Flame, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../../utils/audio';
import { UserProgress } from '../../types';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, progress }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl shadow-xs">
            💡
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-950 font-heading">
              Petunjuk Belajar 3D
            </h3>
            <p className="text-xs text-slate-800 font-bold">
              Panduan interaksi dan eksplorasi seru untuk siswa
            </p>
          </div>
        </div>

        {/* Tips List */}
        <div className="space-y-3.5 mb-6 text-sm text-slate-900">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-sky-50 border-2 border-sky-200">
            <MousePointer className="w-5 h-5 text-sky-700 shrink-0 mt-0.5 stroke-[2.5]" />
            <div>
              <strong className="text-slate-950 block font-black text-xs uppercase tracking-wide">
                Putar Objek 3D
              </strong>
              <span className="font-bold">Klik dan seret (drag) menggunakan mouse atau jari di layar untuk melihat benda dari segala sisi.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-indigo-50 border-2 border-indigo-200">
            <ZoomIn className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5 stroke-[2.5]" />
            <div>
              <strong className="text-slate-950 block font-black text-xs uppercase tracking-wide">
                Perbesar & Perkecil
              </strong>
              <span className="font-bold">Gunakan roda putar mouse (scroll) atau tombol 🔍 untuk mengamati bagian lebih detail.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-teal-50 border-2 border-teal-200">
            <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5 stroke-[2.5]" />
            <div>
              <strong className="text-slate-950 block font-black text-xs uppercase tracking-wide">
                Tombol "Lihat Partikelnya!"
              </strong>
              <span className="font-bold">Klik tombol ini untuk melihat rahasia molekul kecil penyusun benda padat, cair, dan gas!</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50 border-2 border-amber-200">
            <Flame className="w-5 h-5 text-amber-700 shrink-0 mt-0.5 stroke-[2.5]" />
            <div>
              <strong className="text-slate-950 block font-black text-xs uppercase tracking-wide">
                Eksperimen Laboratorium
              </strong>
              <span className="font-bold">Nyalakan pemanas atau pendingin untuk menyaksikan perubahan wujud nyata dengan termometer langsung.</span>
            </div>
          </div>
        </div>

        {/* Learning Progress Snapshot */}
        <div className="border-t-2 border-slate-200 pt-4">
          <div className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
            Status Perjalanan Belajarmu:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-black">
            <div className={`p-2 rounded-xl border-2 flex items-center gap-1.5 ${progress.visitedStates ? 'bg-emerald-50 text-emerald-950 border-emerald-300' : 'bg-slate-100 text-slate-700 border-slate-300'}`}>
              <CheckCircle2 className={`w-3.5 h-3.5 stroke-[2.5] ${progress.visitedStates ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span>Wujud Zat</span>
            </div>
            <div className={`p-2 rounded-xl border-2 flex items-center gap-1.5 ${progress.visitedLab ? 'bg-emerald-50 text-emerald-950 border-emerald-300' : 'bg-slate-100 text-slate-700 border-slate-300'}`}>
              <CheckCircle2 className={`w-3.5 h-3.5 stroke-[2.5] ${progress.visitedLab ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span>Laboratorium</span>
            </div>
            <div className={`p-2 rounded-xl border-2 flex items-center gap-1.5 ${progress.visitedTransitions ? 'bg-emerald-50 text-emerald-950 border-emerald-300' : 'bg-slate-100 text-slate-700 border-slate-300'}`}>
              <CheckCircle2 className={`w-3.5 h-3.5 stroke-[2.5] ${progress.visitedTransitions ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span>Perubahan</span>
            </div>
          </div>
        </div>

        {/* Understood Button */}
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="mt-6 w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-all cursor-pointer"
        >
          Siap, Ayo Lanjut Belajar! 🚀
        </button>
      </div>
    </div>
  );
};
