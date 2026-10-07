import { StateInfo, TransitionInfo, EverydayExample, QuizQuestion } from '../types';

export const STATES_DATA: Record<'solid' | 'liquid' | 'gas', StateInfo> = {
  solid: {
    id: 'solid',
    name: 'Zat Padat',
    emoji: '🧊',
    iconName: 'Box',
    shortDesc: 'Benda padat memiliki bentuk dan volume yang tetap.',
    particleDesc: 'Partikel tersusun sangat rapat, teratur, dan hanya bergetar sedikit di tempatnya.',
    particleLabel: 'Partikel rapat',
    characteristics: {
      shape: 'Bentuk tetap (tidak berubah meski dipindah tempat)',
      volume: 'Volume tetap (ukurannya tidak bertambah atau berkurang)',
      particles: 'Jarak partikel sangat rapat dan tidak bebas berpindah'
    },
    examples: ['Es batu', 'Batu kali', 'Pensil & buku', 'Meja kayu', 'Sendok logam'],
    color: '#0284c7', // Sky-600
    accentBg: 'bg-sky-50',
    badgeColor: 'border-sky-300 text-sky-700 bg-sky-100'
  },
  liquid: {
    id: 'liquid',
    name: 'Zat Cair',
    emoji: '💧',
    iconName: 'Droplet',
    shortDesc: 'Benda cair memiliki volume tetap, tetapi bentuknya mengikuti wadah.',
    particleDesc: 'Partikel lebih renggang, tidak tersusun tetap, dan bergerak perlahan saling bergeser.',
    particleLabel: 'Partikel dapat bergerak',
    characteristics: {
      shape: 'Bentuk berubah-ubah mengikuti wadahnya (gelas, botol, mangkuk)',
      volume: 'Volume selalu tetap',
      particles: 'Jarak partikel agak renggang dan dapat mengalir bebas'
    },
    examples: ['Air putih', 'Minyak goreng', 'Susu cair', 'Madu manis', 'Sirup'],
    color: '#0d9488', // Teal-600
    accentBg: 'bg-teal-50',
    badgeColor: 'border-teal-300 text-teal-700 bg-teal-100'
  },
  gas: {
    id: 'gas',
    name: 'Zat Gas',
    emoji: '☁️',
    iconName: 'Cloud',
    shortDesc: 'Gas tidak memiliki bentuk dan volume tetap.',
    particleDesc: 'Partikel sangat berjauhan, bergerak sangat cepat ke segala arah, dan memenuhi seluruh ruangan.',
    particleLabel: 'Partikel berjauhan',
    characteristics: {
      shape: 'Bentuk berubah mengisi seluruh wadah/ruangan',
      volume: 'Volume berubah-ubah sesuai ruang yang ditempatinya',
      particles: 'Jarak partikel sangat renggang dan bergerak bebas sangat cepat'
    },
    examples: ['Udara yang kita hirup', 'Uap air saat mendidih', 'Gas helium dalam balon', 'Asap wangi dupa'],
    color: '#8b5cf6', // Violet-500
    accentBg: 'bg-purple-50',
    badgeColor: 'border-purple-300 text-purple-700 bg-purple-100'
  }
};

export const TRANSITIONS_DATA: Record<string, TransitionInfo> = {
  melting: {
    id: 'melting',
    name: 'Mencair',
    from: 'solid',
    to: 'liquid',
    heatAction: 'absorb',
    heatLabel: 'Menerima Panas 🔥',
    simpleFormula: 'PADAT → CAIR',
    explanation: 'Benda padat berubah menjadi cair karena menerima panas dari lingkungan sekitarnya.',
    dailyExample: 'Es batu yang ditaruh di suhu ruang perlahan meleleh menjadi genangan air segar.',
    funFact: 'Es mulai mencair pada suhu di atas 0°C!',
    color: '#f97316', // Orange
    icon: 'Flame'
  },
  freezing: {
    id: 'freezing',
    name: 'Membeku',
    from: 'liquid',
    to: 'solid',
    heatAction: 'release',
    heatLabel: 'Melepaskan Panas ❄️',
    simpleFormula: 'CAIR → PADAT',
    explanation: 'Benda cair berubah menjadi padat karena melepaskan panas (didinginkan sampai suhu titik bekunya).',
    dailyExample: 'Air di dalam cetakan yang dimasukkan ke freezer membeku menjadi balok es keras.',
    funFact: 'Air membeku tepat pada suhu 0°C dan volumenya justru sedikit mengembang!',
    color: '#0284c7', // Sky
    icon: 'Snowflake'
  },
  evaporation: {
    id: 'evaporation',
    name: 'Menguap',
    from: 'liquid',
    to: 'gas',
    heatAction: 'absorb',
    heatLabel: 'Menerima Panas 🔥',
    simpleFormula: 'CAIR → GAS',
    explanation: 'Benda cair berubah menjadi gas karena menerima energi panas, partikelnya bergerak semakin cepat dan lepas ke udara.',
    dailyExample: 'Air yang direbus sampai mendidih akan mengeluarkan uap putih yang naik ke atas.',
    funFact: 'Baju basah yang dijemur di bawah sinar matahari bisa kering karena airnya menguap!',
    color: '#ea580c', // Dark Orange
    icon: 'Wind'
  },
  condensation: {
    id: 'condensation',
    name: 'Mengembun',
    from: 'gas',
    to: 'liquid',
    heatAction: 'release',
    heatLabel: 'Melepaskan Panas ❄️',
    simpleFormula: 'GAS → CAIR',
    explanation: 'Gas berubah menjadi cair karena kehilangan panas saat bersentuhan dengan permukaan yang lebih dingin.',
    dailyExample: 'Munculnya titik-titik tetesan air di bagian luar gelas yang berisi es batu dingin.',
    funFact: 'Awan di langit terbentuk karena uap air mengembun menjadi butiran air kecil-kecil!',
    color: '#0891b2', // Cyan
    icon: 'Droplets'
  },
  sublimation: {
    id: 'sublimation',
    name: 'Menyublim',
    from: 'solid',
    to: 'gas',
    heatAction: 'absorb',
    heatLabel: 'Menerima Panas 🔥',
    simpleFormula: 'PADAT → GAS',
    explanation: 'Benda padat langsung berubah menjadi gas tanpa melewati wujud cair terlebih dahulu.',
    dailyExample: 'Kapur barus (kamper) di dalam lemari yang lama-kelamaan mengecil dan habis karena berubah jadi gas wangi.',
    funFact: 'Dry ice (es kering karbon dioksida) juga langsung menyublim menjadi asap gas tebal!',
    color: '#9333ea', // Purple
    icon: 'Sparkles'
  },
  deposition: {
    id: 'deposition',
    name: 'Mengkristal',
    from: 'gas',
    to: 'solid',
    heatAction: 'release',
    heatLabel: 'Melepaskan Panas ❄️',
    simpleFormula: 'GAS → PADAT',
    explanation: 'Gas langsung berubah menjadi benda padat karena melepaskan panas yang sangat drastis.',
    dailyExample: 'Terbentuknya bunga-bunga kristal es pada dinding bagian dalam freezer.',
    funFact: 'Di negara bermusim dingin, uap air di udara bisa langsung mengkristal menjadi butiran salju yang indah!',
    color: '#2563eb', // Blue
    icon: 'Sparkle'
  }
};

export const EVERYDAY_EXAMPLES: EverydayExample[] = [
  {
    id: 'ice_melting',
    title: 'Es Batu Mencair',
    emoji: '🧊',
    transitionType: 'melting',
    transitionName: 'Mencair',
    description: 'Es batu di dalam mangkuk perlahan mengecil dan berubah menjadi air minum.',
    scienceDetail: 'Padat menjadi Cair karena es batu menyerap panas dari udara di sekitarnya.',
    iconBg: 'bg-amber-100 text-amber-800'
  },
  {
    id: 'boiling_water',
    title: 'Air Mendidih di Panci',
    emoji: '🍳',
    transitionType: 'evaporation',
    transitionName: 'Menguap',
    description: 'Ketika air dimasak hingga 100°C di kompor, muncul gelembung dan uap panas.',
    scienceDetail: 'Cair menjadi Gas karena air menerima panas kuat dari api kompor.',
    iconBg: 'bg-orange-100 text-orange-800'
  },
  {
    id: 'steam_rising',
    title: 'Uap Nasi Panas',
    emoji: '☁️',
    transitionType: 'evaporation',
    transitionName: 'Menguap',
    description: 'Saat tutup penanak nasi dibuka, kepulan uap air putih membubung ke atas.',
    scienceDetail: 'Air dalam butiran nasi berubah wujud menjadi gas yang menyebar ke udara.',
    iconBg: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'freezer_ice',
    title: 'Air Membeku di Freezer',
    emoji: '🥶',
    transitionType: 'freezing',
    transitionName: 'Membeku',
    description: 'Air sirup yang dimasukkan ke cetakan es batu menjadi es lilin yang padat dan beku.',
    scienceDetail: 'Cair menjadi Padat karena suhu freezer sangat dingin di bawah 0°C.',
    iconBg: 'bg-sky-100 text-sky-800'
  },
  {
    id: 'morning_dew',
    title: 'Embun Pagi di Dedaunan',
    emoji: '💧',
    transitionType: 'condensation',
    transitionName: 'Mengembun',
    description: 'Tetesan air segar di ujung daun rumput saat matahari pagi mulai terbit.',
    scienceDetail: 'Gas (uap air di malam hari yang dingin) berubah menjadi tetesan cairan di atas daun.',
    iconBg: 'bg-teal-100 text-teal-800'
  },
  {
    id: 'camphor_shrink',
    title: 'Kapur Barus yang Mengecil',
    emoji: '🧴',
    transitionType: 'sublimation',
    transitionName: 'Menyublim',
    description: 'Kapur barus putih bulat di lemari pakaian mengecil sendiri tanpa membasahi baju.',
    scienceDetail: 'Padat langsung menjadi Gas wangi tanpa pernah menjadi cairan terlebih dahulu.',
    iconBg: 'bg-fuchsia-100 text-fuchsia-800'
  },
  {
    id: 'frost_crystals',
    title: 'Bunga Kristal Es di Kulkas',
    emoji: '❄️',
    transitionType: 'deposition',
    transitionName: 'Mengkristal',
    description: 'Lapisan kristal es putih mirip salju yang menempel di dinding freezer.',
    scienceDetail: 'Gas (uap air di udara kulkas) langsung membeku menjadi kristal padat saat menyentuh dinding yang beku.',
    iconBg: 'bg-indigo-100 text-indigo-800'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Benda yang memiliki bentuk dan volume tetap disebut...',
    options: [
      { key: 'A', text: 'Gas' },
      { key: 'B', text: 'Cair' },
      { key: 'C', text: 'Padat' },
      { key: 'D', text: 'Uap' }
    ],
    correctAnswer: 'C',
    explanation: 'Benda padat memiliki bentuk dan volume yang selalu tetap di mana pun ia berada.'
  },
  {
    id: 2,
    question: 'Air yang dimasukkan ke dalam freezer lama-kelamaan akan...',
    options: [
      { key: 'A', text: 'Menguap' },
      { key: 'B', text: 'Membeku' },
      { key: 'C', text: 'Mencair' },
      { key: 'D', text: 'Menyublim' }
    ],
    correctAnswer: 'B',
    explanation: 'Suhu dingin di freezer menyebabkan air melepaskan panas dan membeku menjadi es batu padat.'
  },
  {
    id: 3,
    question: 'Es batu yang dibiarkan di tempat panas akan...',
    options: [
      { key: 'A', text: 'Membeku' },
      { key: 'B', text: 'Mengembun' },
      { key: 'C', text: 'Mencair' },
      { key: 'D', text: 'Mengkristal' }
    ],
    correctAnswer: 'C',
    explanation: 'Es batu menerima panas dari udara luar sehingga berubah wujud dari padat menjadi cair (mencair).'
  },
  {
    id: 4,
    question: 'Perubahan dari cair menjadi gas disebut...',
    options: [
      { key: 'A', text: 'Membeku' },
      { key: 'B', text: 'Menguap' },
      { key: 'C', text: 'Mengembun' },
      { key: 'D', text: 'Mencair' }
    ],
    correctAnswer: 'B',
    explanation: 'Ketika zat cair dipanaskan, partikelnya akan terlepas ke udara menjadi gas. Ini disebut menguap.'
  },
  {
    id: 5,
    question: 'Titik-titik air yang muncul pada bagian luar gelas berisi es merupakan contoh...',
    options: [
      { key: 'A', text: 'Menguap' },
      { key: 'B', text: 'Membeku' },
      { key: 'C', text: 'Mengembun' },
      { key: 'D', text: 'Menyublim' }
    ],
    correctAnswer: 'C',
    explanation: 'Uap air di udara sekitar gelas kehilangan panas saat menyentuh dinding gelas dingin, sehingga mengembun menjadi tetesan air.'
  },
  {
    id: 6,
    question: 'Kapur barus yang semakin lama semakin kecil merupakan contoh...',
    options: [
      { key: 'A', text: 'Menyublim' },
      { key: 'B', text: 'Membeku' },
      { key: 'C', text: 'Mencair' },
      { key: 'D', text: 'Mengembun' }
    ],
    correctAnswer: 'A',
    explanation: 'Kapur barus adalah benda padat yang langsung berubah wujud menjadi gas harum tanpa menjadi cair (menyublim).'
  },
  {
    id: 7,
    question: 'Partikel pada benda gas biasanya...',
    options: [
      { key: 'A', text: 'Sangat rapat dan teratur' },
      { key: 'B', text: 'Berjauhan dan bergerak bebas' },
      { key: 'C', text: 'Tidak bergerak' },
      { key: 'D', text: 'Selalu berada di dasar wadah' }
    ],
    correctAnswer: 'B',
    explanation: 'Partikel gas memiliki gaya tarik yang sangat lemah sehingga saling berjauhan dan bergerak sangat bebas ke segala arah.'
  },
  {
    id: 8,
    question: 'Perubahan dari gas menjadi cair disebut...',
    options: [
      { key: 'A', text: 'Menguap' },
      { key: 'B', text: 'Mencair' },
      { key: 'C', text: 'Mengembun' },
      { key: 'D', text: 'Membeku' }
    ],
    correctAnswer: 'C',
    explanation: 'Gas yang melepaskan kalor atau bersentuhan dengan benda dingin akan berubah menjadi cair (mengembun).'
  },
  {
    id: 9,
    question: 'Contoh perubahan wujud dari cair menjadi padat adalah...',
    options: [
      { key: 'A', text: 'Es mencair' },
      { key: 'B', text: 'Air menjadi es' },
      { key: 'C', text: 'Air menjadi uap' },
      { key: 'D', text: 'Embun menjadi uap' }
    ],
    correctAnswer: 'B',
    explanation: 'Air (benda cair) yang didinginkan akan menjadi es (benda padat), proses ini dinamakan membeku.'
  },
  {
    id: 10,
    question: 'Ketika air mendidih, air berubah dari...',
    options: [
      { key: 'A', text: 'Padat menjadi cair' },
      { key: 'B', text: 'Cair menjadi gas' },
      { key: 'C', text: 'Gas menjadi cair' },
      { key: 'D', text: 'Padat menjadi gas' }
    ],
    correctAnswer: 'B',
    explanation: 'Saat air mendidih pada suhu 100°C, air cair berubah wujud menjadi uap air (gas).'
  }
];

export const FUN_FACTS = [
  'Air adalah satu-satunya zat di bumi yang secara alami bisa kita temukan dalam tiga wujud sekaligus: es (padat), air (cair), dan uap (gas)!',
  'Saat air membeku menjadi es batu, es justru mengembang dan menjadi lebih ringan, sehingga es bisa mengapung di atas air!',
  'Awan putih berarak yang kita lihat di langit sebenarnya adalah kumpulan miliaran tetesan air kecil yang mengembun, bukan gas kosong!',
  'Tahukah kamu? Di kutub utara yang sangat beku, air panas yang dilempar ke udara bisa langsung berubah menjadi kristal es seketika!'
];
