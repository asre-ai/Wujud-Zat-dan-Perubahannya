import React, { useState } from 'react';
import { NavPage, UserProgress } from '../../types';
import { QUIZ_QUESTIONS } from '../../data/learningData';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Home, BookOpen, Award, Sparkles, HelpCircle } from 'lucide-react';

interface QuizViewProps {
  onNavigate: (page: NavPage) => void;
  onUpdateProgress: (newProgress: Partial<UserProgress>) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ onNavigate, onUpdateProgress }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [scoreCount, setScoreCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

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
      // Finished all 10 questions!
      const totalScore = (scoreCount + (selectedAnswer === currentQ.correctAnswer ? 0 : 0)) * 10;
      setIsFinished(true);

      // Award Badges
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

      // Sinkronkan skor kuis ke histori_energi di localStorage untuk Panel Guru
      try {
        const rawHistory = localStorage.getItem('histori_energi');
        if (rawHistory) {
          const list = JSON.parse(rawHistory);
          if (Array.isArray(list) && list.length > 0) {
            // Perbarui entri siswa terakhir yang sedang aktif
            list[list.length - 1].skor = totalScore;
            localStorage.setItem('histori_energi', JSON.stringify(list));
          }
        }
      } catch {
        // Fallback jika localStorage tidak dapat diakses
      }
    }
  };

  const handleRestartQuiz = () => {
    sound.playPop();
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScoreCount(0);
    setIsFinished(false);
  };

  // Final Results Screen
  if (isFinished) {
    const finalScore = scoreCount * 10;
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
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white/95 rounded-[36px] p-8 sm:p-10 border-3 border-amber-300 shadow-xl text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-[24px] bg-gradient-to-tr from-amber-200 to-yellow-300 border-2 border-amber-400 flex items-center justify-center text-4xl mb-4 shadow-md shadow-amber-500/20">
            {feedbackIcon}
          </div>

          <div className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-950 text-xs sm:text-sm font-black mb-2 border border-amber-300 shadow-2xs font-heading">
            🎉 Kuis Selesai!
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
            Hasil Kuis Wujud Zat
          </h2>

          {/* Big Score Display */}
          <div className="my-6 p-6 rounded-[28px] bg-amber-50/70 border-2 border-amber-200/90 w-full max-w-sm shadow-xs">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 block font-heading">
              Skor Kamu:
            </span>
            <div className="text-5xl font-black text-orange-600 font-heading mt-1">
              {finalScore} <span className="text-2xl font-bold text-slate-400">/ 100</span>
            </div>
            <p className="text-sm font-black text-slate-700 mt-2 font-heading">
              {scoreCount} dari 10 jawaban benar ⭐
            </p>
          </div>

          {/* Feedback message */}
          <p className="text-base sm:text-lg font-bold text-slate-800 max-w-md">
            “{feedbackText}”
          </p>

          {/* Badge Display if achieved */}
          {finalScore >= 70 && (
            <div className="mt-5 p-4 rounded-[22px] bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 flex items-center gap-3 text-left w-full max-w-sm shadow-xs">
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

          {/* 3 Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-md">
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
        </div>
      </div>
    );
  }

  // Active Question Card
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Quiz Progress Indicator Bar */}
      <div className="bg-white/98 p-5 rounded-[28px] border-3 border-sky-300 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs sm:text-sm font-black text-slate-900">
          <span className="flex items-center gap-1.5 text-orange-700 font-heading">
            <span>📝 Soal {currentIdx + 1} dari 10</span>
          </span>
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
