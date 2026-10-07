import React, { useState } from 'react';
import { X, Mail, Instagram, MapPin, GraduationCap, Copy, Check, ExternalLink, Code2, Sparkles } from 'lucide-react';
import { sound } from '../../utils/audio';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({ isOpen, onClose }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const email = 'mhdasr171717@gmail.com';
  const instagramHandle = '@mhdasr__';
  const instagramUrl = 'https://www.instagram.com/mhdasr__';

  const handleCopyEmail = () => {
    sound.playPop();
    navigator.clipboard.writeText(email).catch(() => {});
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border-2 border-indigo-200/90 relative animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Background decorative glows */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-sky-200/40 rounded-full blur-2xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-amber-200/40 rounded-full blur-2xl pointer-events-none -z-10" />

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          title="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Avatar and Developer Badge */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-500/30">
              MA
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-xs shadow-xs" title="Pengembang">
              <Code2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-1.5 shadow-2xs">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>Pengembang Media Pembelajaran</span>
          </div>

          <h3 className="text-2xl font-black text-slate-900 font-heading">
            Muhammad Asri
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Website Pembelajaran 3D Wujud Zat & Perubahannya
          </p>
        </div>

        {/* Information Cards List */}
        <div className="space-y-3 mb-6 text-sm text-slate-700">
          {/* University */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-sky-50/80 border border-sky-100">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-sky-900 uppercase tracking-wide block">
                Perguruan Tinggi
              </span>
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm truncate block">
                Universitas Lambung Mangkurat
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-teal-50/80 border border-teal-100">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wide block">
                Asal Daerah
              </span>
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm truncate block">
                Banjarmasin - Indonesia
              </span>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/80 border border-amber-100 gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide block">
                  Alamat Email
                </span>
                <a
                  href={`mailto:${email}`}
                  className="font-extrabold text-slate-900 hover:text-amber-700 text-xs sm:text-sm truncate block transition-colors"
                >
                  {email}
                </a>
              </div>
            </div>
            <button
              onClick={handleCopyEmail}
              className="p-2 rounded-xl bg-white hover:bg-amber-100 border border-amber-200 text-amber-800 transition-colors shrink-0 cursor-pointer shadow-2xs"
              title="Salin Email"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Instagram */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/80 border border-purple-100 hover:bg-purple-100/70 transition-all gap-2 group cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wide block">
                  Instagram
                </span>
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm truncate block group-hover:text-purple-700 transition-colors">
                  {instagramHandle}
                </span>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-white text-purple-700 border border-purple-200 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0 shadow-2xs">
              <ExternalLink className="w-4 h-4" />
            </div>
          </a>
        </div>

        {/* Close action */}
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
        >
          Tutup Informasi
        </button>
      </div>
    </div>
  );
};
