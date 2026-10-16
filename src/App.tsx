/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavPage, UserProgress } from './types';
import { Navbar } from './components/common/Navbar';
import { HelpModal } from './components/common/HelpModal';
import { DeveloperModal } from './components/common/DeveloperModal';
import { DynamicCartoonBackground } from './components/common/DynamicCartoonBackground';
import { HomeView } from './components/views/HomeView';
import { StatesView } from './components/views/StatesView';
import { LabView } from './components/views/LabView';
import { TransitionsView } from './components/views/TransitionsView';
import { QuizView } from './components/views/QuizView';
import { TopScorersModal } from './components/common/TopScorersModal';

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
  const [isTopScorersOpen, setIsTopScorersOpen] = useState(false);
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return defaultProgress;
  });

  // Global event listener for opening top scorers and navigating from any script/overlay
  useEffect(() => {
    const handleOpenEvent = () => setIsTopScorersOpen(true);
    const handleNavEvent = (e: any) => {
      const targetPage = e?.detail || 'home';
      handleNavigate(targetPage);
    };

    window.addEventListener('open-top-scorers', handleOpenEvent);
    window.addEventListener('navigate-to-page', handleNavEvent);
    (window as any).openTopScorers = () => setIsTopScorersOpen(true);
    (window as any).navigateToPage = (page: NavPage) => handleNavigate(page);

    return () => {
      window.removeEventListener('open-top-scorers', handleOpenEvent);
      window.removeEventListener('navigate-to-page', handleNavEvent);
      delete (window as any).openTopScorers;
      delete (window as any).navigateToPage;
    };
  }, []);

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
    <div className="relative min-h-screen flex flex-col text-slate-800 overflow-x-hidden selection:bg-amber-300 selection:text-amber-950">
      {/* Dynamic Cartoon Background: Overlapping vibrant panels, paper planes, bold clouds & stars */}
      <DynamicCartoonBackground />

      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        badgeUnlocked={progress.badgeUnlocked}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenDeveloper={() => setIsDeveloperOpen(true)}
        onOpenTopScorers={() => setIsTopScorersOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto pt-4 sm:pt-6 px-3 sm:px-6 pb-12">
        <div key={currentPage} className="animate-storybook-slide w-full">
          {currentPage === 'home' && (
            <HomeView
              onNavigate={handleNavigate}
              progress={progress}
              onOpenTopScorers={() => setIsTopScorersOpen(true)}
            />
          )}
          {currentPage === 'states' && <StatesView />}
          {currentPage === 'lab' && <LabView />}
          {currentPage === 'transitions' && <TransitionsView />}
          {currentPage === 'quiz' && (
            <QuizView
              onNavigate={handleNavigate}
              onUpdateProgress={handleUpdateProgress}
              onOpenTopScorers={() => setIsTopScorersOpen(true)}
            />
          )}
        </div>
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
            <span className="text-slate-300 hidden sm:inline">|</span>
            <button
              onClick={() => setIsTopScorersOpen(true)}
              className="text-amber-700 hover:text-amber-900 font-black transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              🏆 Top Scorers
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

      {/* Top Scorers Leaderboard Dialog */}
      <TopScorersModal
        isOpen={isTopScorersOpen}
        onClose={() => setIsTopScorersOpen(false)}
      />
    </div>
  );
}
