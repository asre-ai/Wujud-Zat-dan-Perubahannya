import React, { useState } from 'react';
import { NavPage, UserProgress } from '../../types';
import { QUIZ_QUESTIONS } from '../../data/learningData';
import { sound } from '../../utils/audio';
import {
  QuizHistoryRecord,
  getActiveStudentName,
  setActiveStudentName,
  saveQuizResult,
  exportStudentCsv,
  exportTeacherCsv,
  isCurrentUserTeacher,
  isTeacherName,
} from '../../utils/quizHistory';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Home,
  BookOpen,
  Award,
  Download,
  Lock,
  User,
  Check,
  Trophy,
} from 'lucide-react';

interface QuizViewProps {
  onNavigate: (page: NavPage) => void;
  onUpdateProgress: (newProgress: Partial<UserProgress>) => void;
  onOpenTopScorers?: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  onNavigate,
  onUpdateProgress,
  onOpenTopScorers,
}) => {
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isNameLocked, setIsNameLocked] = useState<boolean>(false);
  const [studentNameInput, setStudentNameInput] = useState<string>(() => getActiveStudentName());
  const [nameError, setNameError] = useState<string | null>(null);

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [scoreCount, setScoreCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Status ekspor kuis siswa & guru
  const [quizRecord, setQuizRecord] = useState<QuizHistoryRecord | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  // Handler Mulai Kuis & KUNCI NAMA (Name Lock)
  const handleStartQuiz = () => {
    sound.playPop();
    const cleanName = studentNameInput.trim();
    if (!cleanName || cleanName === 'Siswa Cilik') {
      setNameError('Tuliskan namamu terlebih dahulu sebelum menekan tombol Mulai Kuis! 😊');
      return;
    }

    setNameError(null);
    // Kunci Nama: Simpan ke localStorage dan jadikan input tidak bisa diedit
    setActiveStudentName(cleanName);
    setIsNameLocked(true);
    setIsStarted(true);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScoreCount(0);
    setIsFinished(false);
  };

  const handleChooseOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswered) return;

    setSelectedAnswer(key);
    setIsAnswered(true);

    const isCorrect = key === currentQ.correctAnswer;
    if (isCorrect) {
      sound.playCorrect();
      setScoreCount((prev) => prev + 1);
    } else {
      sound.playWrong();
    }
  };

  const handleNextQuestion = () => {
    sound.playPop();
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Selesai seluruh 10 soal
      const totalScore = scoreCount * 10;
      const correctAnswers = scoreCount;
      const wrongAnswers = QUIZ_QUESTIONS.length - scoreCount;

      setIsFinished(true);

      // Gunakan nama yang telah terkunci sejak Mulai Kuis
      const lockedName = studentNameInput.trim() || getActiveStudentName();

      // Simpan riwayat kuis ke localStorage ('riwayatKuisEnergi' & 'histori_energi') secara Append-Only
      const saved = saveQuizResult({
        nama: lockedName,
        jumlahBenar: correctAnswers,
        jumlahSalah: wrongAnswers,
        nilaiAkhir: totalScore,
      });
      setQuizRecord(saved);

      // Berikan Lencana Prestasi
      let badge: 'none' | 'explorer' | 'expert' = 'none';
      if (totalScore >= 90) {
        badge = 'expert';
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
        sound.playFanfare();
      } else if (totalScore >= 70) {
        badge = 'explorer';
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
        sound.playFanfare();
      }

      onUpdateProgress({
        completedQuiz: true,
        quizScore: totalScore,
        badgeUnlocked: badge,
      });
    }
  };

  const handleRestartQuiz = () => {
    sound.playPop();
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScoreCount(0);
    setIsFinished(false);
    setQuizRecord(null);
    setDownloadNotice(null);
    // Nama tetap terkunci untuk siswa yang sedang mengerjakan
  };

  // Unduh CSV Siswa (Individu)
  const handleDownloadStudentCsv = () => {
    sound.playPop();
    if (!quizRecord) return;

    // Pastikan menggunakan nama terkunci
    exportStudentCsv(quizRecord);

    const safeName = (quizRecord.nama || 'Siswa').replace(/[^a-zA-Z0-9_\-]/g, '_');
    setDownloadNotice(`Nilai_${safeName}.csv`);
  };

  // Unduh CSV Guru (Rekap Semua Siswa)
  const handleDownloadTeacherCsv = () => {
    sound.playPop();
    const result = exportTeacherCsv('highest');
    if (!result.success) {
      alert('Belum ada riwayat kuis siswa yang tersimpan.');
    } else {
      setDownloadNotice(result.filename);
    }
  };

  // Layar Persiapan Kuis (Sebelum Mulai Kuis & Kunci Nama)
  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white/98 rounded-[36px] p-6 sm:p-10 border-3 border-sky-300 shadow-xl text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-[24px] bg-gradient-to-tr from-sky-400 via-amber-300 to-yellow-400 border-2 border-sky-400 flex items-center justify-center text-4xl mb-4 shadow-md shadow-sky-500/20">
            📝
          </div>

          <div className="inline-block px-4 py-1.5 rounded-full bg-sky-100 text-sky-950 text-xs sm:text-sm font-black mb-2 border border-sky-300 shadow-2xs font-heading">
            ⭐ Kuis Interaktif IPA SD
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
            Kuis Wujud Zat & Perubahannya
          </h2>

          <p className="mt-3 text-slate-600 text-sm sm:text-base font-bold max-w-md leading-relaxed">
            Uji pemahamanmu tentang zat padat, cair, dan gas dalam 10 soal interaktif. Raih skor maksimal 100 poin dan lencana juara!
          </p>

          {/* Form Input Nama Siswa dengan Kunci Nama (Name Lock) */}
          <div className="mt-6 w-full max-w-md bg-amber-50/85 p-5 rounded-[26px] border-2 border-amber-300 shadow-xs text-left">
            <label className="block text-xs font-black uppercase tracking-wider text-amber-950 mb-2 font-heading flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-700" />
              <span>Nama Peserta Kuis:</span>
            </label>

            <div className="relative">
              <input
                type="text"
                value={studentNameInput}
                onChange={(e) => {
                  setStudentNameInput(e.target.value);
                  if (nameError) setNameError(null);
                }}
                disabled={isNameLocked}
                placeholder="Ketik namamu di sini..."
                maxLength={30}
                className={`w-full px-4 py-3 rounded-2xl bg-white border-2 text-slate-900 font-bold text-base focus:outline-none transition-all ${
                  isNameLocked
                    ? 'border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed'
                    : nameError
                    ? 'border-rose-400 ring-2 ring-rose-200'
                    : 'border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                }`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStartQuiz();
                }}
              />
              {isNameLocked && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2 py-1 rounded-lg">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Terkunci</span>
                </div>
              )}
            </div>

            {nameError && (
              <p className="mt-2 text-xs font-bold text-rose-600 flex items-center gap-1">
                <span>⚠️</span>
                <span>{nameError}</span>
              </p>
            )}

            {/* Indikator Mode Guru atau Catatan Keamanan Name Lock */}
            {isCurrentUserTeacher() || isTeacherName(studentNameInput) ? (
              <div className="mt-3.5 p-3 rounded-xl bg-sky-50 border border-sky-300 text-sky-950 text-xs font-semibold flex items-start gap-2">
                <span className="text-base shrink-0">👨‍🏫</span>
                <p className="leading-snug">
                  <strong>Mode Guru (Pengajar):</strong> Anda dapat mencoba kuis secara bebas. Sesuai sistem keamanan, nilai Guru <strong>tidak akan dimasukkan ke Papan Juara / Top Scorers siswa</strong>.
                </p>
              </div>
            ) : (
              <div className="mt-3.5 p-3 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-950 text-xs font-semibold flex items-start gap-2">
                <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <strong>Pengamanan Kuis (Name Lock):</strong> Saat kamu menekan tombol <strong>Mulai Kuis</strong>, kolom nama akan otomatis dikunci dan tombol ganti nama disembunyikan sampai hasil kuis selesai demi keamanan nilai kuis.
                </p>
              </div>
            )}
          </div>

          {/* Tombol Mulai Kuis */}
          <div className="mt-6 w-full max-w-md flex flex-col gap-3">
            <button
              onClick={handleStartQuiz}
              className="w-full py-4 px-6 rounded-[24px] bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-500 hover:to-orange-600 text-white font-black text-base shadow-lg shadow-orange-500/25 border-3 border-amber-300 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 font-heading"
            >
              <span>🚀 Mulai Kuis</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>

            <button
              onClick={() => {
                sound.playPop();
                onNavigate('home');
              }}
              className="w-full py-3 px-4 rounded-[20px] bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm border-2 border-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Layar Akhir Hasil Kuis
  if (isFinished) {
    const finalScore = scoreCount * 10;
    const correctCount = quizRecord ? quizRecord.jumlahBenar : scoreCount;
    const wrongCount = quizRecord ? quizRecord.jumlahSalah : (10 - scoreCount);
    const displayName = quizRecord ? quizRecord.nama : (studentNameInput || 'Siswa Cilik');

    let feedbackText = '';
    let feedbackIcon = '🌟';

    if (finalScore >= 90) {
      feedbackIcon = '🌟';
      feedbackText = 'Hebat! Kamu sudah sangat memahami wujud zat!';
    } else if (finalScore >= 70) {
      feedbackIcon = '👏';
      feedbackText = 'Bagus! Tinggal sedikit lagi untuk menjadi ahli wujud zat.';
    } else if (finalScore >= 50) {
      feedbackIcon = '💪';
      feedbackText = 'Lumayan! Yuk pelajari lagi bagian yang masih membingungkan.';
    } else {
      feedbackIcon = '🔍';
      feedbackText = 'Tidak apa-apa. Yuk coba belajar lagi dan ulangi kuis!';
    }

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white/98 rounded-[36px] p-6 sm:p-10 border-3 border-amber-300 shadow-xl text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-[24px] bg-gradient-to-tr from-amber-200 to-yellow-300 border-2 border-amber-400 flex items-center justify-center text-4xl mb-4 shadow-md shadow-amber-500/20">
            {feedbackIcon}
          </div>

          <div className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-950 text-xs sm:text-sm font-black mb-2 border border-amber-300 shadow-2xs font-heading">
            🎉 Kuis Selesai!
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
            Hasil Kuis Wujud Zat
          </h2>

          {/* Kartu Identitas Siswa / Guru */}
          <div className="mt-4 mb-2 flex items-center justify-center gap-2 w-full max-w-sm">
            {(quizRecord?.isTeacher || isCurrentUserTeacher() || isTeacherName(displayName)) ? (
              <div className="inline-flex items-center gap-2 bg-sky-50 px-4 py-2.5 rounded-2xl border-2 border-sky-300 text-slate-800 shadow-2xs">
                <span className="text-sm">👨‍🏫</span>
                <span className="text-xs font-bold text-slate-500">Akun:</span>
                <strong className="text-sm font-black text-sky-900 font-heading">{displayName}</strong>
                <span className="text-[10px] font-black uppercase tracking-wider bg-sky-200 text-sky-950 px-2 py-0.5 rounded-full border border-sky-300">
                  Mode Guru
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2.5 bg-emerald-50 px-4 py-2.5 rounded-2xl border-2 border-emerald-300 text-slate-800 shadow-2xs">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-500">Nama Siswa:</span>
                <strong className="text-sm font-black text-slate-900 font-heading">{displayName}</strong>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300">
                  🔒 Terkunci
                </span>
              </div>
            )}
          </div>

          {(quizRecord?.isTeacher || isCurrentUserTeacher() || isTeacherName(displayName)) && (
            <div className="mt-1 mb-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-semibold flex items-center justify-center gap-2 max-w-md w-full shadow-2xs">
              <span>🛡️</span>
              <span><strong>Aman:</strong> Nilai kuis ini tidak dicatat ke Papan Peringkat Juara Siswa.</span>
            </div>
          )}

          {/* Big Score Display */}
          <div className="my-5 p-6 rounded-[28px] bg-amber-50/70 border-2 border-amber-200/90 w-full max-w-md shadow-xs">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 block font-heading">
              Skor Kamu:
            </span>
            <div className="text-5xl font-black text-orange-600 font-heading mt-1">
              {finalScore} <span className="text-2xl font-bold text-slate-400">/ 100</span>
            </div>

            {/* Rekap Rincian Benar / Salah */}
            <div className="mt-4 pt-3 border-t border-amber-200/80 grid grid-cols-2 gap-3 text-xs sm:text-sm font-bold">
              <div className="bg-emerald-50 text-emerald-950 p-2.5 rounded-xl border border-emerald-300 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                <span>Benar: <strong>{correctCount}</strong></span>
              </div>
              <div className="bg-rose-50 text-rose-950 p-2.5 rounded-xl border border-rose-300 flex items-center justify-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 stroke-[2.5]" />
                <span>Salah: <strong>{wrongCount}</strong></span>
              </div>
            </div>
          </div>

          {/* Feedback message */}
          <p className="text-base sm:text-lg font-bold text-slate-800 max-w-md mb-2">
            “{feedbackText}”
          </p>

          {/* Badge Display if achieved */}
          {finalScore >= 70 && (
            <div className="mt-2 mb-6 p-4 rounded-[22px] bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 flex items-center gap-3 text-left w-full max-w-md shadow-xs">
              <Award className="w-8 h-8 text-orange-600 shrink-0 stroke-[2.5]" />
              <div>
                <span className="text-xs font-black uppercase text-amber-950 tracking-wide block font-heading">
                  Lencana Berhasil Diraih:
                </span>
                <span className="text-base font-black text-amber-950 font-heading">
                  {finalScore >= 90 ? '🏆 Ahli Wujud Zat' : '🏅 Penjelajah Wujud Zat'}
                </span>
              </div>
            </div>
          )}

          {/* TOMBOL SISWA: Unduh Nilaiku (CSV Individu) */}
          <div className="w-full max-w-md mt-2 mb-4">
            <button
              onClick={handleDownloadStudentCsv}
              className="w-full py-4 px-6 rounded-[24px] bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-base shadow-lg shadow-emerald-500/25 border-3 border-emerald-300 flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-95 font-heading"
            >
              <Download className="w-5 h-5 stroke-[2.5]" />
              <span>Unduh Nilaiku (CSV)</span>
            </button>

            {downloadNotice && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>File <strong>{downloadNotice}</strong> berhasil diunduh!</span>
              </div>
            )}

            {/* Tombol Lihat Top Scorers */}
            {onOpenTopScorers && (
              <button
                onClick={() => {
                  sound.playPop();
                  onOpenTopScorers();
                }}
                className="w-full mt-3 py-3.5 px-5 rounded-[22px] bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-black text-sm shadow-md border-2 border-amber-300 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 font-heading"
              >
                <Trophy className="w-4 h-4 text-amber-900" />
                <span>🏆 Lihat Top Scorers (Papan Juara)</span>
              </button>
            )}
          </div>

          {/* 3 Action Buttons (Coba Lagi, Belajar Lagi, Beranda) */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <button
              onClick={handleRestartQuiz}
              className="flex-1 py-3.5 px-4 rounded-[22px] bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-500 hover:to-orange-600 text-white font-black text-sm shadow-md shadow-orange-500/25 border-2 border-amber-300 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 font-heading"
            >
              <RotateCcw className="w-4 h-4" />
              <span>🔄 Coba Lagi</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                onNavigate('states');
              }}
              className="flex-1 py-3.5 px-4 rounded-[22px] bg-white hover:bg-amber-50 text-slate-800 font-black text-sm border-2 border-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-all font-heading"
            >
              <BookOpen className="w-4 h-4" />
              <span>📚 Belajar Lagi</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                onNavigate('home');
              }}
              className="py-3.5 px-4 rounded-[22px] bg-white hover:bg-amber-50 text-slate-800 font-black text-sm border-2 border-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
              title="Kembali ke Beranda"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>

          {/* Opsi Guru Tambahan (Tersimpan di pojok bawah kartu kuis) */}
          <div className="mt-8 pt-4 border-t border-slate-200/80 w-full max-w-md flex items-center justify-between text-xs text-slate-500 font-bold">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Khusus Guru:</span>
            </span>
            <button
              onClick={handleDownloadTeacherCsv}
              className="text-sky-600 hover:text-sky-800 underline cursor-pointer hover:font-black transition-all flex items-center gap-1"
              title="Unduh seluruh rekap nilai kuis siswa di kelas"
            >
              <span>📥 Rekap Nilai (Guru)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Layar Soal Aktif
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Quiz Progress Indicator Bar */}
      <div className="bg-white/98 p-5 rounded-[28px] border-3 border-sky-300 shadow-sm flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-black text-slate-900">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-orange-700 font-heading">
              <span>📝 Soal {currentIdx + 1} dari 10</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-300 text-xs font-bold text-amber-950">
              <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="text-slate-500">Peserta:</span>
              <strong className="text-slate-900 font-heading truncate max-w-[120px] sm:max-w-[180px]">{studentNameInput}</strong>
              <span className="text-[10px] bg-amber-200 text-amber-950 px-1.5 py-0.2 rounded font-black">🔒 Terkunci</span>
            </span>
          </div>
          <span className="font-heading text-amber-950 font-black bg-amber-100 px-3.5 py-1 rounded-full border-2 border-amber-300 shadow-2xs">
            Skor Sementara: {scoreCount * 10} poin
          </span>
        </div>

        {/* 10 Dots Progress */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {QUIZ_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-2.5 flex-1 rounded-full transition-colors ${
                i < currentIdx
                  ? 'bg-orange-500'
                  : i === currentIdx
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white/98 p-6 sm:p-8 rounded-[36px] border-3 border-sky-300 shadow-md flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-[18px] bg-gradient-to-tr from-amber-300 to-yellow-400 text-amber-950 flex items-center justify-center font-black text-xl shrink-0 border-2 border-amber-500 shadow-xs font-heading">
            {currentIdx + 1}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-heading leading-snug">
            {currentQ.question}
          </h3>
        </div>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {currentQ.options.map((opt) => {
            const isSelected = selectedAnswer === opt.key;
            const isCorrectAnswer = opt.key === currentQ.correctAnswer;

            let btnStyle = 'bg-white hover:bg-amber-50 border-2 border-slate-300 hover:border-amber-400 text-slate-950 font-black shadow-xs';

            if (isAnswered) {
              if (isCorrectAnswer) {
                btnStyle = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-500/20';
              } else if (isSelected && !isCorrectAnswer) {
                btnStyle = 'bg-rose-50 border-2 border-rose-400 text-rose-950 line-through font-bold';
              } else {
                btnStyle = 'bg-slate-100 border-2 border-slate-200 text-slate-500 opacity-60 font-bold';
              }
            }

            return (
              <button
                key={opt.key}
                onClick={() => handleChooseOption(opt.key)}
                disabled={isAnswered}
                className={`p-4 rounded-[22px] text-left flex items-center justify-between transition-all cursor-pointer disabled:cursor-default font-heading ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-amber-100 border-2 border-amber-400 text-amber-950 flex items-center justify-center text-xs font-black shadow-2xs font-heading">
                    {opt.key}
                  </span>
                  <span className="text-sm sm:text-base font-black text-slate-950">
                    {opt.text}
                  </span>
                </div>

                {isAnswered && isCorrectAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 stroke-[2.5]" />
                )}
                {isAnswered && isSelected && !isCorrectAnswer && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Feedback Callout when answered */}
        {isAnswered && (
          <div
            className={`p-4 rounded-[22px] border-2 flex items-start gap-3 animate-in fade-in duration-200 ${
              selectedAnswer === currentQ.correctAnswer
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            {selectedAnswer === currentQ.correctAnswer ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 stroke-[2.5]" />
            )}
            <div className="flex-1 text-xs sm:text-sm">
              <strong className="block font-black mb-0.5 font-heading">
                {selectedAnswer === currentQ.correctAnswer
                  ? 'Jawaban Benar! 🎉 Hebat Sekali!'
                  : `Jawaban Kurang Tepat. (Pilihan yang benar adalah ${currentQ.correctAnswer})`}
              </strong>
              <p className="leading-relaxed font-bold opacity-90">{currentQ.explanation}</p>
            </div>
          </div>
        )}

        {/* Next Question Button */}
        {isAnswered && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextQuestion}
              className="py-3.5 px-6 rounded-[22px] bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-500 hover:to-orange-600 text-white font-black text-sm sm:text-base shadow-md shadow-orange-500/30 border-2 border-amber-300 flex items-center gap-2 cursor-pointer transition-all active:scale-95 font-heading"
            >
              <span>
                {currentIdx + 1 === QUIZ_QUESTIONS.length ? 'Lihat Hasil Kuis 🎉' : 'Soal Selanjutnya →'}
              </span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
