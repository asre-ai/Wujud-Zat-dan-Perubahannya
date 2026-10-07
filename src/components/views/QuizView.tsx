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
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center text-4xl mb-4 shadow-xs">
            {feedbackIcon}
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            🎉 Kuis Selesai!
          </div>

          <h2 className="text-3xl font-black text-slate-900 font-heading">
            Hasil Kuis Wujud Zat
          </h2>

          {/* Big Score Display */}
          <div className="my-6 p-6 rounded-3xl bg-slate-50 border border-slate-200/80 w-full max-w-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Skor Kamu:
            </span>
            <div className="text-5xl font-black text-sky-600 font-mono mt-1">
              {finalScore} <span className="text-2xl font-bold text-slate-400">/ 100</span>
            </div>
            <p className="text-sm font-bold text-slate-700 mt-2">
              {scoreCount} dari 10 jawaban benar
            </p>
          </div>

          {/* Feedback message */}
          <p className="text-base sm:text-lg font-bold text-slate-800 max-w-md">
            “{feedbackText}”
          </p>

          {/* Badge Display if achieved */}
          {finalScore >= 70 && (
            <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-left w-full max-w-sm">
              <Award className="w-8 h-8 text-amber-600 shrink-0" />
              <div>
                <span className="text-xs font-bold uppercase text-amber-800 tracking-wide block">
                  Badge Berhasil Diraih:
                </span>
                <span className="text-sm font-extrabold text-amber-950 font-heading">
                  {finalScore >= 90 ? '🏆 Ahli Wujud Zat' : '🏅 Penjelajah Wujud Zat'}
                </span>
              </div>
            </div>
          )}

          {/* 3 Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <button
              onClick={handleRestartQuiz}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>🔄 Coba Lagi</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                onNavigate('states');
              }}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>📚 Belajar Lagi</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                onNavigate('home');
              }}
              className="py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
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
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span className="flex items-center gap-1.5 text-sky-700">
            <span>📝 Soal {currentIdx + 1} dari 10</span>
          </span>
          <span className="font-mono text-slate-500">
            Skor Sementara: {scoreCount * 10} poin
          </span>
        </div>

        {/* 10 Dots Progress */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {QUIZ_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors ${
                i < currentIdx
                  ? 'bg-sky-500'
                  : i === currentIdx
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-black text-lg shrink-0">
            {currentIdx + 1}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading leading-snug">
            {currentQ.question}
          </h3>
        </div>

        {/* 4 Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {currentQ.options.map((opt) => {
            const isSelected = selectedAnswer === opt.key;
            const isCorrectAnswer = opt.key === currentQ.correctAnswer;

            let btnStyle = 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800';

            if (isAnswered) {
              if (isCorrectAnswer) {
                btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
              } else if (isSelected && !isCorrectAnswer) {
                btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 line-through';
              } else {
                btnStyle = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={opt.key}
                onClick={() => handleChooseOption(opt.key)}
                disabled={isAnswered}
                className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer disabled:cursor-default ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-slate-700 shadow-2xs">
                    {opt.key}
                  </span>
                  <span className="text-sm sm:text-base font-semibold">
                    {opt.text}
                  </span>
                </div>

                {isAnswered && isCorrectAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrectAnswer && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Feedback Callout when answered */}
        {isAnswered && (
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 animate-in fade-in duration-200 ${
              selectedAnswer === currentQ.correctAnswer
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/80 border-rose-200 text-rose-950'
            }`}
          >
            {selectedAnswer === currentQ.correctAnswer ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs sm:text-sm">
              <strong className="block font-bold mb-0.5">
                {selectedAnswer === currentQ.correctAnswer
                  ? 'Jawaban Benar! 🎉'
                  : `Jawaban Kurang Tepat. (Pilihan benar adalah ${currentQ.correctAnswer})`}
              </strong>
              <p className="leading-relaxed opacity-90">{currentQ.explanation}</p>
            </div>
          </div>
        )}

        {/* Next Question Button */}
        {isAnswered && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextQuestion}
              className="py-3 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm shadow-md shadow-sky-600/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>
                {currentIdx + 1 === QUIZ_QUESTIONS.length ? 'Lihat Hasil Kuis 🎉' : 'Soal Selanjutnya'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
