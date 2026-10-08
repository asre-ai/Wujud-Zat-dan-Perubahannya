import React from 'react';

/**
 * DynamicCartoonBackground
 * 
 * Latar belakang dinamis bertema kartun cerita dengan kedalaman tinggi:
 * - Panel warna tumpang tindih yang vibrant (biru cerah, oranye ceria, kuning matahari)
 * - Pola bertekstur (polka dot halftone, garis putus-putus, dan aksen lengkung dinamis)
 * - Elemen dekoratif kartun bold:
 *   * Pesawat kertas (paper airplanes) dengan garis jejak terbang (flight trail loops)
 *   * Bintang kartun (bold cartoon 4-point & 5-point stars) dengan efek kilau
 *   * Awan gembul kartun (bold puffy cartoon clouds) dengan bayangan kontur
 */
export const DynamicCartoonBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden -z-10"
    >
      {/* ============================================================== */}
      {/* LAYER 0: Pondasi Latar Belakang Gradien Biru Cerah & Dinamis */}
      {/* ============================================================== */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-sky-300 to-amber-200 opacity-90" />

      {/* Grid Sains & Buku Cerita Lembut */}
      <div className="absolute inset-0 science-grid-bg opacity-35" />

      {/* ============================================================== */}
      {/* LAYER 1: Panel Warna Tumpang Tindih yang Vibrant (Depth & Shapes) */}
      {/* ============================================================== */}
      <svg
        className="absolute inset-0 w-full h-full preserve-3d"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <defs>
          {/* Pola Polka Dot Kuning Hangat */}
          <pattern id="dot-pattern-yellow" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="3" fill="#f59e0b" fillOpacity="0.35" />
          </pattern>

          {/* Pola Garis Diagonal Oranye */}
          <pattern id="stripe-pattern-orange" width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="20" stroke="#ea580c" strokeWidth="5" strokeOpacity="0.2" />
          </pattern>

          {/* Pola Titik Biru Cerah */}
          <pattern id="dot-pattern-blue" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="14" cy="14" r="3.5" fill="#0284c7" fillOpacity="0.25" />
          </pattern>

          {/* Gradien untuk Panel */}
          <linearGradient id="panel-orange-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="60%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          <linearGradient id="panel-yellow-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>

          <linearGradient id="panel-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          <filter id="panel-shadow" x="-5%" y="-5%" width="120%" height="120%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#0f172a" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* 1. Panel Biru Laut Menengah (Underlay Gelombang Belakang) */}
        <path
          d="M -100,200 Q 300,50 800,280 T 1600,150 L 1600,-100 L -100,-100 Z"
          fill="url(#panel-cyan-grad)"
          opacity="0.5"
        />

        {/* 2. Panel Oranye Vibrant (Sudut Kanan Atas - Tumpang Tindih) */}
        <path
          d="M 850,-80 C 1050,40 1200,120 1550,60 L 1600,-80 Z"
          fill="url(#panel-orange-grad)"
          filter="url(#panel-shadow)"
          opacity="0.85"
        />
        {/* Overlay Pola Garis pada Panel Oranye */}
        <path
          d="M 850,-80 C 1050,40 1200,120 1550,60 L 1600,-80 Z"
          fill="url(#stripe-pattern-orange)"
          opacity="0.7"
        />

        {/* 3. Panel Kuning Hangat Melengkung (Kiri Tengah & Bawah) */}
        <path
          d="M -100,520 C 150,480 320,620 480,720 C 620,810 750,780 900,980 L -100,1050 Z"
          fill="url(#panel-yellow-grad)"
          filter="url(#panel-shadow)"
          opacity="0.8"
        />
        {/* Overlay Polka Dot pada Panel Kuning */}
        <path
          d="M -100,520 C 150,480 320,620 480,720 C 620,810 750,780 900,980 L -100,1050 Z"
          fill="url(#dot-pattern-yellow)"
          opacity="0.85"
        />

        {/* 4. Panel Oranye Ceria (Bawah Kanan - Tumpang Tindih dengan Kuning) */}
        <path
          d="M 850,950 Q 1100,680 1550,750 L 1600,1050 L 800,1050 Z"
          fill="url(#panel-orange-grad)"
          filter="url(#panel-shadow)"
          opacity="0.85"
        />

        {/* 5. Pita Lengkung Aksen Biru Cerah (Tengah Menyapu) */}
        <path
          d="M 1200,320 C 1000,420 850,380 680,480 C 520,570 480,680 400,750"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="24"
          strokeLinecap="round"
          strokeDasharray="16 16"
          opacity="0.35"
        />
      </svg>

      {/* ============================================================== */}
      {/* LAYER 2: Awan Kartun Gembul (Bold Cartoon Clouds)              */}
      {/* ============================================================== */}
      {/* Awan 1 - Kiri Atas (Besar, Mengapung Pelan) */}
      <div className="absolute top-[3%] left-[2%] sm:left-[5%] animate-cloud-drift opacity-90 transition-transform">
        <svg width="220" height="130" viewBox="0 0 220 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Shadow Underside */}
          <ellipse cx="110" cy="88" rx="85" ry="34" fill="#93c5fd" opacity="0.4" />
          {/* Cloud Body with Cartoon Bumps */}
          <path
            d="M50 95 C30 95 15 80 20 62 C22 45 40 38 52 42 C60 22 88 12 112 18 C135 22 145 38 152 42 C168 38 190 48 195 68 C202 88 185 95 165 95 Z"
            fill="#ffffff"
            stroke="#bae6fd"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Highlight putih bulat di dalam */}
          <circle cx="85" cy="40" r="16" fill="#f8fafc" />
          <circle cx="130" cy="45" r="20" fill="#f8fafc" />
        </svg>
      </div>

      {/* Awan 2 - Kanan Atas (Sedang, dekat Panel Oranye) */}
      <div className="absolute top-[8%] right-[4%] sm:right-[10%] animate-cloud-drift [animation-delay:4s] opacity-90">
        <svg width="180" height="110" viewBox="0 0 180 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="90" cy="74" rx="70" ry="28" fill="#fdba74" opacity="0.3" />
          <path
            d="M40 80 C24 80 12 68 16 52 C18 38 34 32 44 35 C50 18 74 10 94 15 C114 18 122 32 128 35 C142 32 160 40 164 58 C170 74 156 80 140 80 Z"
            fill="#ffffff"
            stroke="#fed7aa"
            strokeWidth="4"
          />
        </svg>
      </div>

      {/* Awan 3 - Kiri Bawah (Mengambang dekat Panel Kuning) */}
      <div className="absolute bottom-[18%] left-[4%] animate-cloud-drift [animation-delay:7s] opacity-85 hidden md:block">
        <svg width="240" height="140" viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="120" cy="95" rx="92" ry="36" fill="#fde047" opacity="0.35" />
          <path
            d="M55 102 C32 102 16 85 22 66 C25 48 44 40 58 44 C66 22 98 12 124 18 C150 24 160 40 168 44 C186 40 210 52 216 74 C222 95 204 102 182 102 Z"
            fill="#ffffff"
            stroke="#fef08a"
            strokeWidth="5"
          />
        </svg>
      </div>

      {/* Awan 4 - Kanan Bawah */}
      <div className="absolute bottom-[8%] right-[3%] animate-cloud-drift [animation-delay:2s] opacity-90">
        <svg width="190" height="115" viewBox="0 0 190 115" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="95" cy="80" rx="75" ry="28" fill="#93c5fd" opacity="0.35" />
          <path
            d="M42 85 C26 85 14 72 18 56 C20 40 36 34 46 38 C52 20 78 12 98 16 C118 20 128 34 134 38 C148 34 168 44 172 62 C178 78 162 85 146 85 Z"
            fill="#ffffff"
            stroke="#bae6fd"
            strokeWidth="4"
          />
        </svg>
      </div>

      {/* ============================================================== */}
      {/* LAYER 3: Pesawat Kertas Kartun Bold (Paper Airplanes & Trails)  */}
      {/* ============================================================== */}
      {/* Pesawat Kertas 1 - Kiri Atas meluncur ke Kanan Bawah */}
      <div className="absolute top-[14%] left-[12%] sm:left-[18%] animate-plane-glide z-0">
        <svg width="260" height="180" viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Garis Jejak Terbang Loop-de-loop (Dashed Contrail) */}
          <path
            d="M 10 130 C 40 150 80 155 75 125 C 70 95 40 100 45 120 C 50 140 100 135 155 90"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeDasharray="7 7"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Ikon Pesawat Kertas dengan Bayangan Lipatan */}
          <g transform="translate(145, 65) rotate(22)">
            {/* Sayap Belakang / Bayangan Lipatan Bawah */}
            <polygon points="0,20 60,0 20,40" fill="#0284c7" />
            {/* Sayap Tengah Lipatan Gelap */}
            <polygon points="0,20 60,0 35,26" fill="#38bdf8" />
            {/* Sayap Atas Terang */}
            <polygon points="0,20 60,0 20,10" fill="#ffffff" />
            {/* Garis Kontur Kartun Bold */}
            <polygon
              points="0,20 60,0 20,40"
              fill="none"
              stroke="#0369a1"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <line x1="0" y1="20" x2="60" y2="0" stroke="#0369a1" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Pesawat Kertas 2 - Kanan Tengah Meluncur ke Atas (Dekat Panel Oranye/Kuning) */}
      <div className="absolute top-[48%] right-[6%] sm:right-[14%] animate-plane-glide [animation-delay:3.5s] z-0">
        <svg width="240" height="190" viewBox="0 0 240 190" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Jejak Lengkung Berputar */}
          <path
            d="M 210 160 C 180 180 140 170 145 140 C 150 110 180 115 175 135 C 170 155 120 140 75 75"
            stroke="#ea580c"
            strokeWidth="3"
            strokeDasharray="6 6"
            strokeLinecap="round"
            opacity="0.65"
          />
          {/* Pesawat Kertas Oranye Hangat */}
          <g transform="translate(65, 45) rotate(-35)">
            <polygon points="0,18 55,0 18,36" fill="#ea580c" />
            <polygon points="0,18 55,0 30,22" fill="#fb923c" />
            <polygon points="0,18 55,0 18,8" fill="#fed7aa" />
            <polygon
              points="0,18 55,0 18,36"
              fill="none"
              stroke="#9a3412"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <line x1="0" y1="18" x2="55" y2="0" stroke="#9a3412" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Pesawat Kertas 3 - Bawah Kiri Meluncur ke Atas */}
      <div className="absolute bottom-[22%] left-[10%] animate-plane-glide [animation-delay:5s] z-0 hidden lg:block">
        <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 15 120 Q 70 135 125 70"
            stroke="#eab308"
            strokeWidth="3"
            strokeDasharray="6 6"
            strokeLinecap="round"
            opacity="0.75"
          />
          <g transform="translate(120, 50) rotate(-18)">
            <polygon points="0,16 50,0 16,32" fill="#ca8a04" />
            <polygon points="0,16 50,0 28,20" fill="#facc15" />
            <polygon points="0,16 50,0 16,7" fill="#fef08a" />
            <polygon
              points="0,16 50,0 16,32"
              fill="none"
              stroke="#854d0e"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <line x1="0" y1="16" x2="50" y2="0" stroke="#854d0e" strokeWidth="2.2" />
          </g>
        </svg>
      </div>

      {/* ============================================================== */}
      {/* LAYER 4: Bintang-Bintang Kartun Bold & Sparkles                */}
      {/* ============================================================== */}
      {/* Bintang 1 (Kuning Emas 5 Sudut - Kiri Atas) */}
      <div className="absolute top-[7%] left-[28%] animate-star-twinkle">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <polygon
            points="22,2 28,14 42,16 32,26 34,40 22,33 10,40 12,26 2,16 16,14"
            fill="#facc15"
            stroke="#ca8a04"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="16" r="3" fill="#ffffff" opacity="0.8" />
        </svg>
      </div>

      {/* Bintang 2 (Kuning Cerah 4 Sudut Berlian - Kanan Atas) */}
      <div className="absolute top-[22%] right-[18%] animate-star-twinkle [animation-delay:1.5s]">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path
            d="M 20 2 Q 20 20 38 20 Q 20 20 20 38 Q 20 20 2 20 Q 20 20 20 2 Z"
            fill="#fde047"
            stroke="#eab308"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="16" r="2.5" fill="#ffffff" />
        </svg>
      </div>

      {/* Bintang 3 (Bintang Oranye Hangat - Kiri Tengah) */}
      <div className="absolute top-[42%] left-[4%] animate-star-twinkle [animation-delay:2.5s]">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <polygon
            points="24,3 30,16 45,18 34,29 37,44 24,36 11,44 14,29 3,18 18,16"
            fill="#fb923c"
            stroke="#c2410c"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="18" r="3" fill="#ffedd5" />
        </svg>
      </div>

      {/* Bintang 4 (Sparkle 4 Sudut - Kanan Tengah) */}
      <div className="absolute top-[68%] right-[8%] animate-star-twinkle [animation-delay:0.8s]">
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
          <path
            d="M 19 2 Q 19 19 36 19 Q 19 19 19 36 Q 19 19 2 19 Q 19 19 19 2 Z"
            fill="#facc15"
            stroke="#a16207"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Bintang 5 (Kuning Imut - Bawah Tengah) */}
      <div className="absolute bottom-[14%] left-[45%] animate-star-twinkle [animation-delay:3s]">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <polygon
            points="17,2 21,11 31,12 24,20 26,30 17,25 8,30 10,20 3,12 13,11"
            fill="#fef08a"
            stroke="#ca8a04"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Bintang 6 & 7 (Kilauan Kecil Tersebar) */}
      <div className="absolute top-[32%] left-[22%] animate-pulse-subtle opacity-80">
        <span className="text-2xl drop-shadow-sm">✨</span>
      </div>
      <div className="absolute top-[16%] right-[32%] animate-pulse-subtle [animation-delay:2s] opacity-80">
        <span className="text-xl drop-shadow-sm">⭐</span>
      </div>
      <div className="absolute bottom-[28%] right-[22%] animate-pulse-subtle [animation-delay:1.2s] opacity-80">
        <span className="text-2xl drop-shadow-sm">🌟</span>
      </div>
      <div className="absolute bottom-[40%] left-[14%] animate-pulse-subtle [animation-delay:2.8s] opacity-70">
        <span className="text-xl drop-shadow-sm">✨</span>
      </div>

      {/* ============================================================== */}
      {/* LAYER 5: Spiral Garis Angin Kartun (Cartoon Wind Swirls)       */}
      {/* ============================================================== */}
      <div className="absolute top-[28%] left-[38%] opacity-35 hidden md:block">
        <svg width="80" height="50" viewBox="0 0 80 50" fill="none">
          <path
            d="M 5 25 Q 30 25 45 15 Q 60 5 65 15 Q 70 25 55 30 Q 40 35 45 42"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="absolute bottom-[35%] right-[30%] opacity-30 hidden md:block">
        <svg width="70" height="45" viewBox="0 0 70 45" fill="none">
          <path
            d="M 5 20 Q 25 20 40 12 Q 55 4 60 12 Q 65 20 50 24"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};
