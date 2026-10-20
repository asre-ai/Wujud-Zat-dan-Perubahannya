export type NavPage = 'home' | 'states' | 'lab' | 'transitions' | 'videos' | 'quiz' | 'glossary';

export type StateOfMatter = 'solid' | 'liquid' | 'gas';

export type TransitionType = 
  | 'melting'      // Mencair (Padat -> Cair)
  | 'freezing'     // Membeku (Cair -> Padat)
  | 'evaporation'  // Menguap (Cair -> Gas)
  | 'condensation' // Mengembun (Gas -> Cair)
  | 'sublimation'  // Menyublim (Padat -> Gas)
  | 'deposition';  // Mengkristal (Gas -> Padat)

export interface StateInfo {
  id: StateOfMatter;
  name: string;
  emoji: string;
  iconName: string;
  shortDesc: string;
  particleDesc: string;
  particleLabel: string;
  characteristics: {
    shape: string;
    volume: string;
    particles: string;
  };
  examples: string[];
  color: string;
  accentBg: string;
  badgeColor: string;
}

export interface TransitionInfo {
  id: TransitionType;
  name: string;
  from: StateOfMatter;
  to: StateOfMatter;
  heatAction: 'absorb' | 'release'; // Menerima Panas | Melepaskan Panas
  heatLabel: string;
  simpleFormula: string;
  explanation: string;
  dailyExample: string;
  funFact: string;
  color: string;
  icon: string;
}

export interface EverydayExample {
  id: string;
  title: string;
  emoji: string;
  transitionType: TransitionType;
  transitionName: string;
  description: string;
  scienceDetail: string;
  iconBg: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface UserProgress {
  visitedHome: boolean;
  visitedStates: boolean;
  visitedLab: boolean;
  visitedTransitions: boolean;
  completedQuiz: boolean;
  quizScore: number;
  badgeUnlocked: 'none' | 'explorer' | 'expert';
}
