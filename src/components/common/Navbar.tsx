import React, { useState, useEffect } from 'react';
import { NavPage } from '../../types';
import { Volume2, VolumeX, HelpCircle, Award, User, Trophy, Lock } from 'lucide-react';
import { sound } from '../../utils/audio';
import { getActiveStudentName } from '../../utils/quizHistory';

interface NavbarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  badgeUnlocked: 'none' | 'explorer' | 'expert';
  onOpenHelp: () => void;
  onOpenDeveloper?: () => void;
  onOpenTopScorers: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  badgeUnlocked,
  onOpenHelp,
  onOpenTopScorers,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(sound.isEnabled());
  const [studentName, setStudentName] = useState<string>(() => getActiveStudentName());

  useEffect(() => {
    const syncStudentName = () => {
      setStudentName(getActiveStudentName());
    };

    window.addEventListener('storage', syncStudentName);
    window.addEventListener('siswa-login-success', syncStudentName);
    const interval = setInterval(syncStudentName, 1500);

    return () => {
      window.removeEventListener('storage', syncStudentName);
      window.removeEventListener('siswa-login-success', syncStudentName);
      clearInterval(interval);
    };
  }, []);

  const isQuizPage = currentPage === 'quiz';

  const handleStudentNameClick = () => {
    sound.playPop();
    if (isQuizPage) {
      sound.playWrong();
      alert('🔒 Nama siswa terkunci selama kuis dan rekap nilai berlangsung demi keamanan nilai!');
      return;
    }
    const loginOverlay = document.getElementById('ui-login-energi');
    if (loginOverlay) {
      loginOverlay.style.display = 'flex';
      const input = document.getElementById('ui-login-input') as HTMLInputElement | null;
      if (input) {
        input.value = studentName && studentName !== 'Siswa Cilik' ? studentName : '';
        input.focus();
        input.select();
      }
    }
  };

  const handleSoundToggle = () => {
    const newState = sound.toggleSound();
    setSoundEnabled(newState);
  };

  const navItems: { id: NavPage; label: string; icon: string }[] = [
    { id: 'home', label: 'Beranda', icon: '🏠' },
    { id: 'states', label: 'Wujud Zat', icon: '🧊' },
    { id: 'lab', label: 'Eksperimen 3D', icon: '🔬' },
    { id: 'transitions', label: 'Perubahan Wujud', icon: '🔄' },
    { id: 'quiz', label: 'Kuis', icon: '📝' },
  ];

  const navThemeMap: Record<NavPage, { active: string; inactive: string }> = {
    home: {
      active: 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-300 scale-[1.02] border-b-2 border-blue-800 font-black',
      inactive: 'bg-white/95 hover:bg-blue-50 text-blue-950 border-2 border-blue-300 border-b-4 border-b-blue-500 active:border-b-2 shadow-2xs font-extrabold',
    },
    states: {
      active: 'bg-sky-600 text-white shadow-md shadow-sky-600/30 ring-2 ring-sky-300 scale-[1.02] border-b-2 border-sky-800 font-black',
      inactive: 'bg-white/95 hover:bg-sky-50 text-sky-950 border-2 border-sky-300 border-b-4 border-b-sky-500 active:border-b-2 shadow-2xs font-extrabold',
    },
    lab: {
      active: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-300 scale-[1.02] border-b-2 border-emerald-800 font-black',
      inactive: 'bg-white/95 hover:bg-emerald-50 text-emerald-950 border-2 border-emerald-300 border-b-4 border-b-emerald-500 active:border-b-2 shadow-2xs font-extrabold',
    },
    transitions: {
      active: 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-2 ring-purple-300 scale-[1.02] border-b-2 border-purple-800 font-black',
      inactive: 'bg-white/95 hover:bg-purple-50 text-purple-950 border-2 border-purple-300 border-b-4 border-b-purple-500 active:border-b-2 shadow-2xs font-extrabold',
    },
    quiz: {
      active: 'bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-300 scale-[1.02] border-b-2 border-amber-700 font-black',
      inactive: 'bg-white/95 hover:bg-amber-50 text-amber-950 border-2 border-amber-400 border-b-4 border-b-amber-500 active:border-b-2 shadow-2xs font-extrabold',
    },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-300/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 h-14 sm:h-18 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Zone 1: Brand title wordmark (Target CSS selector 4) */}
        <button
          onClick={() => {
            sound.playPop();
            onNavigate('home');
          }}
          className="flex items-center gap-1.5 sm:gap-2.5 text-left group cursor-pointer focus:outline-none shrink-0"
        >
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-sm sm:text-xl shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform shrink-0">
            🧊
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-xl font-black text-slate-950 tracking-tight font-heading leading-tight group-hover:text-sky-700 transition-colors">
              Zat 3D Edu
            </span>
            <span className="text-[10px] sm:text-[11px] font-black text-sky-900 hidden md:block">
              Sains Sekolah Dasar
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Buttons with Large Icons */}
        <div className="relative flex-1 min-w-0 max-w-full overflow-hidden">
          <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 scrollbar-none max-w-full px-1 scroll-smooth bg-slate-100/70 sm:bg-transparent p-1 rounded-2xl">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              const theme = navThemeMap[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playPop();
                    onNavigate(item.id);
                  }}
                  className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isActive ? theme.active : theme.inactive
                  }`}
                >
                  <span className="text-sm sm:text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Zone 3: Quick Actions (Sound, Help, Badges) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Badge indicator if unlocked */}
          {badgeUnlocked !== 'none' && (
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shadow-xs ${
                badgeUnlocked === 'expert'
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-sky-50 text-sky-900 border-sky-300'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>{badgeUnlocked === 'expert' ? '🏆 Ahli Zat' : '🏅 Penjelajah'}</span>
            </div>
          )}

          {/* Top Scorers Leaderboard Modal Toggle */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenTopScorers();
            }}
            className="h-7 sm:h-9 px-2 sm:px-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 border-2 border-amber-300 text-amber-950 font-black text-xs flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95 shrink-0"
            title="Papan Peringkat Top 5 Scorers (histori_energi)"
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-900" />
            <span className="hidden sm:inline">Top Scorers</span>
          </button>

          {/* Sound ON/OFF Toggle (Target CSS selector 3) */}
          <button
            onClick={handleSoundToggle}
            className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              soundEnabled
                ? 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
            }`}
            title={soundEnabled ? 'Matikan Suara (Sound ON)' : 'Nyalakan Suara (Sound OFF)'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Help Modal Toggle (Target CSS selector 2) */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenHelp();
            }}
            className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Petunjuk Belajar"
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Tombol Profil & Nama Siswa yang Login (Target CSS selector 1) */}
          <button
            onClick={handleStudentNameClick}
            className={`h-7 sm:h-9 px-2 sm:px-3 rounded-xl sm:rounded-2xl border-2 text-xs flex items-center gap-1.5 transition-all shrink-0 group ${
              isQuizPage
                ? 'bg-amber-50/95 border-amber-300 text-amber-950 cursor-not-allowed shadow-2xs'
                : 'bg-indigo-50/95 hover:bg-indigo-100 border-indigo-200 text-indigo-950 hover:scale-105 active:scale-95 cursor-pointer shadow-2xs'
            }`}
            title={
              isQuizPage
                ? `🔒 Nama Terkunci: ${studentName} (Tidak dapat diganti selama kuis berlangsung)`
                : `Siswa Aktif: ${studentName} (Klik untuk ganti siswa / ubah nama)`
            }
          >
            <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full text-white flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0 shadow-2xs transition-transform ${
              isQuizPage ? 'bg-gradient-to-tr from-amber-600 to-orange-500' : 'bg-gradient-to-tr from-indigo-600 to-sky-500 group-hover:scale-110'
            }`}>
              {isQuizPage ? <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <User className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
            </div>
            <span className={`max-w-[70px] sm:max-w-[110px] md:max-w-[140px] truncate font-black text-xs ${
              isQuizPage ? 'text-amber-950' : 'text-indigo-900 group-hover:text-indigo-950'
            }`}>
              {studentName}
            </span>
            {isQuizPage && (
              <span className="text-[10px] text-amber-700 font-extrabold hidden sm:inline" title="Nama Terkunci">
                🔒
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
