import React, { useState, useEffect } from 'react';
import { NavPage } from '../../types';
import { Volume2, VolumeX, HelpCircle, Award, User, Trophy, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { sound } from '../../utils/audio';
import { getActiveStudentName, isTeacherName } from '../../utils/quizHistory';

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
    glossary: {
      active: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-300 scale-[1.02] border-b-2 border-emerald-800 font-black',
      inactive: 'bg-white/95 hover:bg-emerald-50 text-emerald-950 border-2 border-emerald-300 border-b-4 border-b-emerald-500 active:border-b-2 shadow-2xs font-extrabold',
    },
  };

  const navScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (navScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navScrollRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
    }
  };

  const scrollNav = (direction: 'left' | 'right') => {
    if (navScrollRef.current) {
      const amount = direction === 'left' ? -150 : 150;
      navScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
      sound.playPop();
    }
  };

  useEffect(() => {
    const activeBtn = document.getElementById(`nav-btn-${currentPage}`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    const timer = setTimeout(checkScroll, 200);
    return () => clearTimeout(timer);
  }, [currentPage]);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const renderActionButtons = (isMobile: boolean = false) => {
    const isTeacher = isTeacherName(studentName) || localStorage.getItem('user_role') === 'guru';

    return (
      <>
        {/* Badge indicator if unlocked (desktop only) */}
        {!isMobile && badgeUnlocked !== 'none' && (
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
          className={`${
            isMobile ? 'h-7 px-1.5 rounded-lg text-[11px]' : 'h-7 sm:h-9 px-2 sm:px-3 rounded-xl sm:rounded-2xl text-xs'
          } bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 border-2 border-amber-300 text-amber-950 font-black flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95 shrink-0`}
          title="Papan Peringkat Top 5 Scorers (histori_energi)"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-900" />
          <span className={isMobile ? 'text-[10px]' : 'hidden sm:inline'}>Top 5</span>
        </button>

        {/* Sound ON/OFF Toggle */}
        <button
          onClick={handleSoundToggle}
          className={`${
            isMobile ? 'w-7 h-7 rounded-lg' : 'w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl'
          } border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
            soundEnabled
              ? 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100'
              : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
          }`}
          title={soundEnabled ? 'Matikan Suara (Sound ON)' : 'Nyalakan Suara (Sound OFF)'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Help Modal Toggle */}
        <button
          onClick={() => {
            sound.playPop();
            onOpenHelp();
          }}
          className={`${
            isMobile ? 'w-7 h-7 rounded-lg' : 'w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl'
          } bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 flex items-center justify-center transition-colors cursor-pointer shrink-0`}
          title="Petunjuk Belajar"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        {/* Profile / Student Name Button */}
        <button
          onClick={handleStudentNameClick}
          className={`${
            isMobile ? 'h-7 px-1.5 rounded-lg' : 'h-7 sm:h-9 px-2 sm:px-3 rounded-xl sm:rounded-2xl'
          } border-2 text-xs flex items-center gap-1 sm:gap-1.5 transition-all shrink-0 group ${
            isQuizPage
              ? 'bg-amber-50/95 border-amber-300 text-amber-950 cursor-not-allowed shadow-2xs'
              : isTeacher
              ? 'bg-sky-50/95 hover:bg-sky-100 border-sky-300 text-sky-950 hover:scale-105 active:scale-95 cursor-pointer shadow-2xs'
              : 'bg-indigo-50/95 hover:bg-indigo-100 border-indigo-200 text-indigo-950 hover:scale-105 active:scale-95 cursor-pointer shadow-2xs'
          }`}
          title={
            isQuizPage
              ? `🔒 Kuis Sedang Berlangsung (${studentName})${isTeacher ? ' - Mode Guru: Tidak masuk peringkat' : ' - Nama Terkunci'}`
              : isTeacher
              ? `👨‍🏫 Mode Guru Aktif: ${studentName}`
              : `Siswa Aktif: ${studentName}`
          }
        >
          <div
            className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full text-white flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0 shadow-2xs transition-transform ${
              isQuizPage
                ? 'bg-gradient-to-tr from-amber-600 to-orange-500'
                : isTeacher
                ? 'bg-gradient-to-tr from-sky-600 to-teal-500 group-hover:scale-110'
                : 'bg-gradient-to-tr from-indigo-600 to-sky-500 group-hover:scale-110'
            }`}
          >
            {isQuizPage ? (
              <Lock className="w-2.5 h-2.5" />
            ) : isTeacher ? (
              <span className="text-[10px]">👨‍🏫</span>
            ) : (
              <User className="w-2.5 h-2.5" />
            )}
          </div>
          <span
            className={`${
              isMobile ? 'max-w-[55px]' : 'max-w-[70px] sm:max-w-[110px] md:max-w-[140px]'
            } truncate font-black text-xs ${
              isQuizPage
                ? 'text-amber-950'
                : isTeacher
                ? 'text-sky-950'
                : 'text-indigo-900'
            }`}
          >
            {studentName}
          </span>
        </button>
      </>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-slate-300/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-1.5 sm:py-0 sm:h-18 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-3">
        {/* Mobile Top Row / Desktop Left Side: Brand and Quick Actions */}
        <div className="flex items-center justify-between gap-2 w-full sm:w-auto shrink-0">
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

          {/* Mobile-only Quick Actions Row */}
          <div className="flex sm:hidden items-center gap-1 shrink-0">
            {renderActionButtons(true)}
          </div>
        </div>

        {/* Zone 2: Navigation Buttons Carousel with Clear Swipe Indicators */}
        <div className="relative w-full sm:flex-1 sm:min-w-0 sm:max-w-xl lg:max-w-2xl sm:mx-2">
          <div className="relative flex items-center">
            {/* Left Scroll Button / Fade Indicator */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollNav('left')}
                className="absolute left-0 z-20 h-full w-8 bg-gradient-to-r from-white via-white/95 to-transparent flex items-center justify-start text-sky-900 transition-all cursor-pointer pl-0.5"
                title="Geser menu ke kiri"
                aria-label="Geser menu ke kiri"
              >
                <div className="w-6 h-6 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shadow-md active:scale-95">
                  <ChevronLeft className="w-4 h-4 stroke-[3]" />
                </div>
              </button>
            )}

            {/* Nav Items Container */}
            <nav
              ref={navScrollRef}
              onScroll={checkScroll}
              className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 scroll-smooth w-full px-1.5 bg-gradient-to-r from-sky-50/90 via-indigo-50/70 to-amber-50/90 sm:bg-slate-100/70 p-1 sm:p-1.5 rounded-2xl border-2 border-sky-300/80 sm:border-0 shadow-inner sm:shadow-none"
            >
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                const theme = navThemeMap[item.id];
                return (
                  <button
                    id={`nav-btn-${item.id}`}
                    key={item.id}
                    onClick={() => {
                      sound.playPop();
                      onNavigate(item.id);
                    }}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      isActive ? theme.active : theme.inactive
                    }`}
                  >
                    <span className="text-base sm:text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Scroll Button / Fade Indicator */}
            {canScrollRight && (
              <button
                type="button"
                onClick={() => scrollNav('right')}
                className="absolute right-0 z-20 h-full w-8 bg-gradient-to-l from-white via-white/95 to-transparent flex items-center justify-end text-sky-900 transition-all cursor-pointer pr-0.5"
                title="Geser menu ke kanan"
                aria-label="Geser menu ke kanan"
              >
                <div className="w-6 h-6 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shadow-md active:scale-95 animate-pulse">
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Desktop-only Quick Actions */}
        <div className="hidden sm:flex items-center gap-1 sm:gap-2 shrink-0">
          {renderActionButtons(false)}
        </div>
      </div>
    </header>
  );
};
