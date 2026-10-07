/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavPage, UserProgress } from './types';
import { Navbar } from './components/common/Navbar';
import { HelpModal } from './components/common/HelpModal';
import { DeveloperModal } from './components/common/DeveloperModal';
import { HomeView } from './components/views/HomeView';
import { StatesView } from './components/views/StatesView';
import { LabView } from './components/views/LabView';
import { TransitionsView } from './components/views/TransitionsView';
import { QuizView } from './components/views/QuizView';

const STORAGE_KEY = 'zat_3d_user_progress_v1';

const defaultProgress: UserProgress = {
  visitedHome: true,
  visitedStates: false,
  visitedLab: false,
  visitedTransitions: false,
  completedQuiz: false,
  quizScore: 0,
  badgeUnlocked: 'none',
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isDeveloperOpen, setIsDeveloperOpen] = useState(false);
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return defaultProgress;
  });

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  const handleNavigate = (page: NavPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track visited sections
    if (page === 'states' && !progress.visitedStates) {
      setProgress((p) => ({ ...p, visitedStates: true }));
    } else if (page === 'lab' && !progress.visitedLab) {
      setProgress((p) => ({ ...p, visitedLab: true }));
    } else if (page === 'transitions' && !progress.visitedTransitions) {
      setProgress((p) => ({ ...p, visitedTransitions: true }));
    }
  };

  const handleUpdateProgress = (newProg: Partial<UserProgress>) => {
    setProgress((prev) => ({ ...prev, ...newProg }));
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-sky-100/50 via-amber-50/30 to-indigo-100/40 text-slate-800 overflow-x-hidden">
      {/* 1. Atmospheric Ambient Color Orbs */}
      <div className="fixed top-0 left-[-5%] w-[450px] h-[450px] bg-gradient-to-br from-sky-400/20 to-teal-300/15 rounded-full blur-3xl pointer-events-none -z-10 animate-drift" />
      <div className="fixed top-[20%] right-[-8%] w-[420px] h-[420px] bg-gradient-to-bl from-amber-300/20 to-orange-300/15 rounded-full blur-3xl pointer-events-none -z-10 animate-drift [animation-delay:4s]" />
      <div className="fixed bottom-[10%] left-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-purple-300/15 to-indigo-300/20 rounded-full blur-3xl pointer-events-none -z-10 animate-drift [animation-delay:8s]" />
      <div className="fixed top-[50%] right-[25%] w-[350px] h-[350px] bg-gradient-to-r from-emerald-200/15 to-cyan-200/15 rounded-full blur-3xl pointer-events-none -z-10 animate-drift [animation-delay:6s]" />

      {/* 2. Interactive Science Blueprint Dot Grid Pattern */}
      <div className="fixed inset-0 science-grid-bg pointer-events-none opacity-50 -z-10" />

      {/* 3. Playful Floating Science Icons in Background */}
      <div className="fixed inset-0 pointer-events-none select-none -z-10 overflow-hidden">
        <span className="absolute top-[14%] left-[6%] text-3xl opacity-20 animate-drift">
          🧊
        </span>
        <span className="absolute top-[28%] right-[8%] text-3xl opacity-20 animate-drift [animation-delay:3s]">
          💧
        </span>
        <span className="absolute top-[65%] left-[4%] text-3xl opacity-20 animate-drift [animation-delay:7s]">
          ☁️
        </span>
        <span className="absolute top-[48%] right-[5%] text-2xl opacity-20 animate-drift [animation-delay:5s]">
          ❄️
        </span>
        <span className="absolute bottom-[18%] left-[22%] text-2xl opacity-15 animate-drift [animation-delay:9s]">
          ⚗️
        </span>
        <span className="absolute bottom-[22%] right-[15%] text-2xl opacity-15 animate-drift [animation-delay:2s]">
          ⚛️
        </span>
        <span className="absolute top-[8%] right-[30%] text-2xl opacity-15 animate-drift [animation-delay:11s]">
          🧪
        </span>
      </div>

      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        badgeUnlocked={progress.badgeUnlocked}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenDeveloper={() => setIsDeveloperOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto pt-4 sm:pt-6">
        {currentPage === 'home' && (
          <HomeView onNavigate={handleNavigate} progress={progress} />
        )}
        {currentPage === 'states' && <StatesView />}
        {currentPage === 'lab' && <LabView />}
        {currentPage === 'transitions' && <TransitionsView />}
        {currentPage === 'quiz' && (
          <QuizView
            onNavigate={handleNavigate}
            onUpdateProgress={handleUpdateProgress}
          />
        )}
      </main>

      {/* Educational Simple Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/80 backdrop-blur-md py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🧊💧☁️</span>
            <span className="font-extrabold text-slate-800 font-heading">
              Wujud Zat & Perubahannya 3D
            </span>
            <span className="text-slate-300">|</span>
            <span>Media Pembelajaran IPA SD Kelas 4–6</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-medium text-slate-600">
            <button
              onClick={() => handleNavigate('home')}
              className="hover:text-sky-600 transition-colors cursor-pointer"
            >
              Beranda
            </button>
            <button
              onClick={() => handleNavigate('states')}
              className="hover:text-sky-600 transition-colors cursor-pointer"
            >
              Wujud Zat
            </button>
            <button
              onClick={() => handleNavigate('lab')}
              className="hover:text-sky-600 transition-colors cursor-pointer"
            >
              Eksperimen
            </button>
            <button
              onClick={() => handleNavigate('transitions')}
              className="hover:text-sky-600 transition-colors cursor-pointer"
            >
              Perubahan Wujud
            </button>
            <button
              onClick={() => handleNavigate('quiz')}
              className="hover:text-sky-600 transition-colors cursor-pointer"
            >
              Kuis 10 Soal
            </button>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <button
              onClick={() => setIsDeveloperOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              👤 Info Pengembang
            </button>
          </div>
        </div>
      </footer>

      {/* Help / Guide Dialog */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        progress={progress}
      />

      {/* Developer Profile Dialog */}
      <DeveloperModal
        isOpen={isDeveloperOpen}
        onClose={() => setIsDeveloperOpen(false)}
      />
    </div>
  );
}
