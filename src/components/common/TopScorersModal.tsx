import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Trophy,
  X,
  Medal,
  Crown,
  RotateCcw,
  Star,
  Users,
  Award,
  Calendar,
} from 'lucide-react';
import { sound } from '../../utils/audio';
import {
  getTop5FromHistoriEnergi,
  TopScorerStudent,
} from '../../utils/topScorers';
import { getActiveStudentName } from '../../utils/quizHistory';

interface TopScorersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TopScorersModal: React.FC<TopScorersModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [top5, setTop5] = useState<TopScorerStudent[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [activeStudent, setActiveStudent] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'highest' | 'all'>('highest');

  const loadData = (mode: 'highest' | 'all' = filterMode) => {
    const data = getTop5FromHistoriEnergi(mode);
    setTop5(data.students);
    setTotalRecords(data.totalRecords);
    setActiveStudent(getActiveStudentName());
  };

  useEffect(() => {
    if (isOpen) {
      loadData(filterMode);
    }
  }, [isOpen, filterMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRefresh = () => {
    sound.playPop();
    loadData();
  };

  // Find ranks for podium
  const rank1 = top5.find((s) => s.rank === 1);
  const rank2 = top5.find((s) => s.rank === 2);
  const rank3 = top5.find((s) => s.rank === 3);

  return createPortal(
    <div
      className="fixed inset-0 z-[10002] flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sound.playPop();
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="top-scorers-title"
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border-4 border-amber-300 relative animate-in zoom-in-95 duration-200 overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background playful glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/50 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-amber-200 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-amber-950 relative shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-amber-600 shrink-0 border-2 border-amber-200">
                <Trophy className="w-6 h-6 sm:w-7 sm:h-7 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs uppercase tracking-wider font-extrabold text-amber-900/80">
                    Papan Juara Kuis IPA
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-900 text-white text-[10px] font-bold">
                    Top 5
                  </span>
                </div>
                <h2
                  id="top-scorers-title"
                  className="text-lg sm:text-2xl font-black font-heading leading-tight flex items-center gap-1.5 text-amber-950"
                >
                  <span>🏆 Top Scorers Kelas</span>
                </h2>
              </div>
            </div>

            {/* Action buttons on header */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleRefresh}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/80 hover:bg-white text-amber-900 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                title="Muat Ulang Data (Refresh dari histori_energi)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  sound.playPop();
                  onClose();
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-950/20 hover:bg-amber-950/30 text-amber-950 flex items-center justify-center transition-colors cursor-pointer"
                title="Tutup Papan Juara"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-2 text-xs font-semibold text-amber-950/90 flex flex-wrap items-center justify-between gap-2">
            <span>Disinkronkan langsung dari data <code className="bg-white/60 px-1 py-0.5 rounded font-mono text-[11px]">histori_energi</code></span>
            {totalRecords > 0 && (
              <span className="inline-flex items-center gap-1 bg-amber-950/15 px-2 py-0.5 rounded-full text-[11px] font-bold">
                <Users className="w-3 h-3" />
                {totalRecords} Siswa Terdaftar
              </span>
            )}
          </div>
        </div>

        {/* Filter Bar (Nilai Tertinggi vs Semua Percobaan) */}
        <div className="px-4 sm:px-5 py-2.5 bg-amber-50/90 border-b border-amber-200/80 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-1.5 font-bold text-amber-950">
            <span className="text-sm">🛡️</span>
            <span>Filter Peringkat:</span>
          </div>

          <div className="inline-flex rounded-xl bg-amber-200/70 p-1 border border-amber-300">
            <button
              onClick={() => {
                sound.playPop();
                setFilterMode('highest');
              }}
              className={`px-3 py-1 rounded-lg font-black transition-all cursor-pointer ${
                filterMode === 'highest'
                  ? 'bg-amber-500 text-amber-950 shadow-xs'
                  : 'text-amber-900 hover:text-amber-950 hover:bg-amber-300/60'
              }`}
              title="Mengambil hanya nilai tertinggi per nama siswa (Aman dari nama ganda/nilai jelek sabotase teman)"
            >
              ⭐ Nilai Tertinggi Saja
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setFilterMode('all');
              }}
              className={`px-3 py-1 rounded-lg font-black transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-amber-500 text-amber-950 shadow-xs'
                  : 'text-amber-900 hover:text-amber-950 hover:bg-amber-300/60'
              }`}
              title="Menampilkan semua percobaan secara lengkap"
            >
              📋 Semua Percobaan
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-5">
          {filterMode === 'highest' && (
            <div className="p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-300 text-emerald-950 text-xs font-semibold flex items-center gap-2">
              <span className="text-sm">✅</span>
              <span><strong>Mode Aman Aktif:</strong> Jika ada nama yang sama, sistem otomatis memilih nilai tertinggi yang sah.</span>
            </div>
          )}
          {top5.length === 0 ? (
            /* Empty State */
            <div className="text-center py-8 px-4 rounded-2xl bg-amber-50/60 border-2 border-dashed border-amber-300">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-3">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-800">
                Belum Ada Nilai di Papan Juara!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm mx-auto">
                Selesaikan 10 soal di menu Kuis agar namamu dan skormu tercatat di posisi pertama <code className="font-mono text-amber-700 bg-amber-100 px-1 rounded">histori_energi</code>.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => {
                    sound.playPop();
                    onClose();
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-black text-xs shadow-md transition-all cursor-pointer font-heading"
                >
                  Tutup & Mulai Kuis
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* PODIUM VISUAL for TOP 3 (Gold, Silver, Bronze) */}
              <div className="pt-2 pb-1">
                <div className="text-center mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    Podium Kehormatan 3 Besar
                  </span>
                </div>

                <div className="grid grid-cols-3 items-end gap-2 sm:gap-3 max-w-md mx-auto pt-4">
                  {/* Rank 2 - SILVER PODIUM */}
                  <div className="flex flex-col items-center text-center">
                    {rank2 ? (
                      <>
                        <div className="relative mb-1">
                          <span className="text-2xl sm:text-3xl filter drop-shadow">
                            {rank2.avatarEmoji}
                          </span>
                          <span className="absolute -top-1 -right-1 text-base">
                            🥈
                          </span>
                        </div>
                        <p className="font-black text-xs sm:text-sm text-slate-800 truncate max-w-[85px] sm:max-w-[110px]" title={rank2.nama}>
                          {rank2.nama}
                        </p>
                        <span className="text-[11px] font-extrabold text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded-md mt-0.5">
                          {rank2.skor} Poin
                        </span>
                      </>
                    ) : (
                      <div className="text-xs text-slate-400 pb-2">-</div>
                    )}
                    {/* Podium Column Silver */}
                    <div className="w-full h-20 sm:h-24 mt-2 rounded-t-2xl bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 border-2 border-slate-300 shadow-md flex flex-col items-center justify-center text-slate-700">
                      <Medal className="w-5 h-5 text-slate-600 mb-0.5" />
                      <span className="text-xs font-black text-slate-700">2nd</span>
                      <span className="text-[9px] font-bold text-slate-600 uppercase">Perak</span>
                    </div>
                  </div>

                  {/* Rank 1 - GOLD PODIUM (Tallest Center) */}
                  <div className="flex flex-col items-center text-center">
                    {rank1 ? (
                      <>
                        <div className="relative mb-1">
                          <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 absolute -top-4 left-1/2 -translate-x-1/2 animate-pulse" />
                          <span className="text-3xl sm:text-4xl filter drop-shadow">
                            {rank1.avatarEmoji}
                          </span>
                          <span className="absolute -bottom-1 -right-1 text-lg">
                            🥇
                          </span>
                        </div>
                        <p className="font-black text-xs sm:text-sm text-amber-950 truncate max-w-[95px] sm:max-w-[120px]" title={rank1.nama}>
                          {rank1.nama}
                        </p>
                        <span className="text-[11px] font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md mt-0.5 shadow-xs">
                          {rank1.skor} Poin
                        </span>
                      </>
                    ) : (
                      <div className="text-xs text-slate-400 pb-2">-</div>
                    )}
                    {/* Podium Column Gold */}
                    <div className="w-full h-28 sm:h-32 mt-2 rounded-t-2xl bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 border-2 border-amber-300 shadow-lg flex flex-col items-center justify-center text-amber-950">
                      <Crown className="w-6 h-6 text-amber-900 mb-0.5" />
                      <span className="text-sm font-black text-amber-950">1st</span>
                      <span className="text-[9px] font-extrabold text-amber-900 uppercase">Emas</span>
                    </div>
                  </div>

                  {/* Rank 3 - BRONZE PODIUM */}
                  <div className="flex flex-col items-center text-center">
                    {rank3 ? (
                      <>
                        <div className="relative mb-1">
                          <span className="text-2xl sm:text-3xl filter drop-shadow">
                            {rank3.avatarEmoji}
                          </span>
                          <span className="absolute -top-1 -right-1 text-base">
                            🥉
                          </span>
                        </div>
                        <p className="font-black text-xs sm:text-sm text-slate-800 truncate max-w-[85px] sm:max-w-[110px]" title={rank3.nama}>
                          {rank3.nama}
                        </p>
                        <span className="text-[11px] font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md mt-0.5">
                          {rank3.skor} Poin
                        </span>
                      </>
                    ) : (
                      <div className="text-xs text-slate-400 pb-2">-</div>
                    )}
                    {/* Podium Column Bronze */}
                    <div className="w-full h-16 sm:h-20 mt-2 rounded-t-2xl bg-gradient-to-b from-amber-600 via-orange-600 to-amber-700 border-2 border-orange-400 shadow-md flex flex-col items-center justify-center text-white">
                      <Award className="w-4 h-4 text-amber-200 mb-0.5" />
                      <span className="text-xs font-black text-white">3rd</span>
                      <span className="text-[9px] font-bold text-amber-100 uppercase">Perunggu</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* DETAILED TOP 5 LIST with Medals UI */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
                  <span>Daftar Peringkat 5 Terbaik</span>
                  <span>Nilai Maksimal: 100</span>
                </div>

                {top5.map((student) => {
                  const isCurrent =
                    activeStudent &&
                    student.nama.toLowerCase() === activeStudent.toLowerCase();

                  // Medal UI specifics
                  if (student.medal === 'gold') {
                    return (
                      <div
                        key={`rank-${student.rank}-${student.nama}`}
                        className="relative p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-200 border-2 border-amber-400 shadow-md transition-all hover:scale-[1.01]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          {/* Rank & Medal & Student Info */}
                          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                            {/* Gold Medal Icon Badge */}
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 border-2 border-yellow-200 shadow-md flex items-center justify-center text-2xl shrink-0">
                              🥇
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full shadow-2xs">
                                  <Crown className="w-3 h-3 text-amber-950" />
                                  Medali Emas • Juara 1
                                </span>
                                {isCurrent && (
                                  <span className="text-[10px] font-extrabold bg-sky-500 text-white px-2 py-0.5 rounded-full">
                                    Kamu!
                                  </span>
                                )}
                              </div>
                              <h4 className="font-black text-sm sm:text-base text-amber-950 truncate mt-0.5">
                                {student.nama}
                              </h4>
                              <p className="text-[11px] font-semibold text-amber-900/80 flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3 shrink-0" />
                                {student.waktu}
                              </p>
                            </div>
                          </div>

                          {/* Score Badge */}
                          <div className="text-right shrink-0">
                            <div className="inline-block px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 font-black text-base sm:text-lg shadow-sm border border-amber-300">
                              {student.skor} <span className="text-xs font-bold">Poin</span>
                            </div>
                            <div className="text-[10px] font-extrabold text-amber-800 text-right mt-1">
                              ⭐⭐⭐ Sempurna
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (student.medal === 'silver') {
                    return (
                      <div
                        key={`rank-${student.rank}-${student.nama}`}
                        className="relative p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-100 via-gray-50 to-slate-200 border-2 border-slate-300 shadow-sm transition-all hover:scale-[1.01]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          {/* Rank & Silver Medal */}
                          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-400 border-2 border-white shadow-md flex items-center justify-center text-2xl shrink-0">
                              🥈
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-slate-300 text-slate-800 px-2 py-0.5 rounded-full">
                                  <Medal className="w-3 h-3 text-slate-700" />
                                  Medali Perak • Juara 2
                                </span>
                                {isCurrent && (
                                  <span className="text-[10px] font-extrabold bg-sky-500 text-white px-2 py-0.5 rounded-full">
                                    Kamu!
                                  </span>
                                )}
                              </div>
                              <h4 className="font-black text-sm sm:text-base text-slate-900 truncate mt-0.5">
                                {student.nama}
                              </h4>
                              <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3 shrink-0" />
                                {student.waktu}
                              </p>
                            </div>
                          </div>

                          {/* Score Badge */}
                          <div className="text-right shrink-0">
                            <div className="inline-block px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 text-white font-black text-base sm:text-lg shadow-sm border border-slate-400">
                              {student.skor} <span className="text-xs font-bold">Poin</span>
                            </div>
                            <div className="text-[10px] font-bold text-slate-500 text-right mt-1">
                              Hebat!
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (student.medal === 'bronze') {
                    return (
                      <div
                        key={`rank-${student.rank}-${student.nama}`}
                        className="relative p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-orange-100/80 via-amber-50 to-orange-200/70 border-2 border-orange-300 shadow-sm transition-all hover:scale-[1.01]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          {/* Rank & Bronze Medal */}
                          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-500 border-2 border-orange-200 shadow-md flex items-center justify-center text-2xl shrink-0">
                              🥉
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-orange-300 text-orange-950 px-2 py-0.5 rounded-full">
                                  <Award className="w-3 h-3 text-orange-900" />
                                  Medali Perunggu • Juara 3
                                </span>
                                {isCurrent && (
                                  <span className="text-[10px] font-extrabold bg-sky-500 text-white px-2 py-0.5 rounded-full">
                                    Kamu!
                                  </span>
                                )}
                              </div>
                              <h4 className="font-black text-sm sm:text-base text-orange-950 truncate mt-0.5">
                                {student.nama}
                              </h4>
                              <p className="text-[11px] font-semibold text-orange-900/80 flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3 shrink-0" />
                                {student.waktu}
                              </p>
                            </div>
                          </div>

                          {/* Score Badge */}
                          <div className="text-right shrink-0">
                            <div className="inline-block px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-700 to-orange-600 text-white font-black text-base sm:text-lg shadow-sm border border-orange-400">
                              {student.skor} <span className="text-xs font-bold">Poin</span>
                            </div>
                            <div className="text-[10px] font-bold text-orange-800 text-right mt-1">
                              Luar Biasa!
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Rank 4 & 5
                  return (
                    <div
                      key={`rank-${student.rank}-${student.nama}`}
                      className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 transition-colors hover:bg-slate-100/80"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-200 text-slate-700 font-black text-sm sm:text-base flex items-center justify-center shrink-0 border border-slate-300">
                          #{student.rank}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 truncate">
                              {student.nama}
                            </h4>
                            {isCurrent && (
                              <span className="text-[9px] font-bold bg-sky-500 text-white px-1.5 py-0.2 rounded-full">
                                Kamu
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-2.5 h-2.5 shrink-0" />
                            {student.waktu}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm">
                          {student.skor} Poin
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Kuis IPA SD: Wujud Zat & Perubahannya</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playPop();
                onClose();
              }}
              className="px-5 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm cursor-pointer transition-all shadow-xs"
            >
              Tutup Papan Juara
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
