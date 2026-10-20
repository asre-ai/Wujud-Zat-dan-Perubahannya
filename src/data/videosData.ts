export interface EducationalVideo {
  id: string;
  youtubeId: string;
  url: string;
  title: string;
  description: string;
  category: 'semua' | 'perubahan' | 'wujud' | 'eksperimen';
  categoryLabel: string;
  badge: string;
  badgeColor: string;
  duration: string;
  channelName: string;
  keyTopics: string[];
}

export const EDUCATIONAL_VIDEOS: EducationalVideo[] = [
  {
    id: 'vid-1',
    youtubeId: '8r4KFU1g-Vs',
    url: 'https://youtu.be/8r4KFU1g-Vs',
    title: 'Perubahan Wujud Zat & Benda di Sekitar Kita',
    description: 'Penjelasan lengkap 6 perubahan wujud: mencair, membeku, menguap, mengembun, menyublim, dan mengkristal dengan contoh nyata kehidupan sehari-hari.',
    category: 'perubahan',
    categoryLabel: 'Perubahan Wujud',
    badge: 'Materi Lengkap',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-300',
    duration: '06:12',
    channelName: 'Sains Edukasi Indonesia',
    keyTopics: ['Mencair', 'Membeku', 'Menguap', 'Mengembun', 'Menyublim', 'Mengkristal'],
  },
  {
    id: 'vid-2',
    youtubeId: 'iUf-jrcwQ7E',
    url: 'https://youtu.be/iUf-jrcwQ7E',
    title: 'Mengenal Karakteristik Wujud Zat: Padat, Cair, & Gas',
    description: 'Pahami perbedaan bentuk, volume, susunan partikel, dan kerapatan molekul zat padat, cair, serta gas secara visual dan mudah dimengerti.',
    category: 'wujud',
    categoryLabel: 'Wujud Zat',
    badge: 'Konsep Dasar',
    badgeColor: 'bg-sky-100 text-sky-700 border-sky-300',
    duration: '04:45',
    channelName: 'Belajar IPA Ceria',
    keyTopics: ['Bentuk & Volume', 'Zat Padat', 'Zat Cair', 'Zat Gas'],
  },
  {
    id: 'vid-3',
    youtubeId: 'vNvElea-124',
    url: 'https://youtu.be/vNvElea-124',
    title: 'States of Matter: Simulasi Interaktif & Gerak Partikel',
    description: 'Visualisasi bagaimana molekul dan atom bergetar lebih cepat saat dipanaskan serta melambat saat didinginkan hingga berubah wujud.',
    category: 'wujud',
    categoryLabel: 'Wujud Zat',
    badge: 'Simulasi Partikel',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    duration: '05:30',
    channelName: 'Interactive Science Lab',
    keyTopics: ['Molekul', 'Gerak Partikel', 'Pengaruh Suhu'],
  },
  {
    id: 'vid-4',
    youtubeId: '7Bz39tK5lTM',
    url: 'https://youtu.be/7Bz39tK5lTM',
    title: 'Animasi Edukasi: Petualangan Siklus Wujud Zat di Bumi',
    description: 'Kisah animasi seru tentang perjalanan air dari lautan menjadi awan, hujan, salju, dan es di puncak gunung dalam siklus hidrologi alam.',
    category: 'perubahan',
    categoryLabel: 'Perubahan Wujud',
    badge: 'Animasi Kartun',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-300',
    duration: '04:18',
    channelName: 'Kartun Sains Anak',
    keyTopics: ['Siklus Air', 'Kondensasi', 'Evaporasi', 'Presipitasi'],
  },
  {
    id: 'vid-5',
    youtubeId: '5eXNFoPWw0o',
    url: 'https://youtu.be/5eXNFoPWw0o',
    title: 'Perubahan Wujud Benda Cair ke Padat | Dafa & Lulu',
    description: 'Serial animasi edukasi Ruangguru untuk SD: belajar seru memahami konsep membeku saat membuat es lilin bersama Dafa dan Lulu.',
    category: 'perubahan',
    categoryLabel: 'Perubahan Wujud',
    badge: 'Ruangguru SD',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    duration: '03:55',
    channelName: 'Ruangguru Juara',
    keyTopics: ['Membeku', 'Pelepasan Kalor', 'Pembuatan Es'],
  },
  {
    id: 'vid-6',
    youtubeId: 'JO3VMDnykz4',
    url: 'https://youtu.be/JO3VMDnykz4',
    title: 'Eksperimen Seru Perubahan Wujud Benda di Sekitar Kita',
    description: 'Demonstrasi percobaan nyata menggunakan lilin, es batu, air panas, dan kapur barus yang memperlihatkan perubahan wujud zat seketika.',
    category: 'eksperimen',
    categoryLabel: 'Eksperimen Praktik',
    badge: 'Praktik Nyata',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    duration: '07:05',
    channelName: 'Laboratorium Sains Cilik',
    keyTopics: ['Eksperimen Lilin', 'Kapur Barus', 'Titik Lebur'],
  },
  {
    id: 'vid-7',
    youtubeId: 'QQsybALJoew',
    url: 'https://youtu.be/QQsybALJoew',
    title: 'Mengenal Tiga Wujud Zat & Eksperimen Sederhana Sains',
    description: 'Percobaan pembuktian bahwa udara (gas) memiliki massa dan menempati ruang, serta sifat unik fluida zat cair di berbagai wadah.',
    category: 'eksperimen',
    categoryLabel: 'Eksperimen Praktik',
    badge: 'Eksperimen Gas',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    duration: '05:12',
    channelName: 'Eksplorasi Sains SD',
    keyTopics: ['Massa Gas', 'Volume Benda', 'Sifat Zat Cair'],
  },
  {
    id: 'vid-8',
    youtubeId: 'UQ6T0awqQfs',
    url: 'https://youtu.be/UQ6T0awqQfs',
    title: 'Bagaimana Wujud Benda dan Perubahannya? (IPAS Kurikulum Merdeka)',
    description: 'Pembahasan materi pembelajaran IPAS Kelas 4 Bab 2 Kurikulum Merdeka: fenomena wujud materi, perubahan fisika, dan peran kalor dalam kehidupan.',
    category: 'perubahan',
    categoryLabel: 'Perubahan Wujud',
    badge: 'Kurikulum Merdeka',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    duration: '08:24',
    channelName: 'Guru Inovatif IPAS',
    keyTopics: ['IPAS Kelas 4', 'Kurikulum Merdeka', 'Kalor & Wujud'],
  },
];
