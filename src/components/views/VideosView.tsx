import React, { useState } from 'react';
import { EDUCATIONAL_VIDEOS, EducationalVideo } from '../../data/videosData';
import { Youtube, ExternalLink, Play, Sparkles, Filter, CheckCircle2, Tv } from 'lucide-react';
import { sound } from '../../utils/audio';

export const VideosView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredVideos = EDUCATIONAL_VIDEOS.filter((video) => {
    const matchesCategory = selectedCategory === 'semua' || video.category === selectedCategory;
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.keyTopics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'semua', label: 'Semua Video', count: EDUCATIONAL_VIDEOS.length, icon: '🌟' },
    { id: 'perubahan', label: 'Perubahan Wujud', count: EDUCATIONAL_VIDEOS.filter(v => v.category === 'perubahan').length, icon: '🔄' },
    { id: 'wujud', label: 'Wujud Zat', count: EDUCATIONAL_VIDEOS.filter(v => v.category === 'wujud').length, icon: '🧊' },
    { id: 'eksperimen', label: 'Eksperimen', count: EDUCATIONAL_VIDEOS.filter(v => v.category === 'eksperimen').length, icon: '🔬' },
  ];

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-10">
      {/* Channel Header Banner (YouTube Channel Style) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 text-white shadow-xl shadow-rose-500/15 border-4 border-white/80 p-6 sm:p-8">
        {/* Background Decorative Patterns */}
        <div className="absolute -right-8 -bottom-10 opacity-15 pointer-events-none text-white">
          <Youtube className="w-64 h-64" />
        </div>
        <div className="absolute top-4 right-12 text-2xl animate-bounce pointer-events-none opacity-40">✨</div>
        <div className="absolute bottom-4 left-1/3 text-xl animate-pulse pointer-events-none opacity-30">☁️</div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-5 sm:gap-6 text-center md:text-left">
          {/* Channel Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-amber-300 text-3xl sm:text-4xl shadow-rose-950/20">
              📺
            </div>
            <div className="absolute -bottom-1 -right-1 bg-red-600 text-white rounded-full p-1.5 shadow-md border-2 border-white">
              <Play className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          {/* Channel Info */}
          <div className="flex-1 space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-wide border border-white/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>KANAL VIDEO EDUKASI RESMI</span>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight text-white drop-shadow-sm">
                Kanal Video Wujud Zat & Perubahannya
              </h1>
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 fill-amber-300/30 shrink-0" />
            </div>
            <p className="text-sm sm:text-base text-rose-50 font-medium max-w-2xl leading-relaxed">
              Koleksi video animasi sains pilihan untuk memperdalam pemahaman wujud zat (padat, cair, gas), peristiwa perubahan kalor, dan eksperimen laboratorium.
            </p>

            {/* Badges / Stats */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs font-bold text-rose-100">
              <span className="bg-red-700/50 backdrop-blur-xs px-3 py-1 rounded-xl border border-red-300/30">
                🎬 {EDUCATIONAL_VIDEOS.length} Video Pilihan
              </span>
              <span className="bg-red-700/50 backdrop-blur-xs px-3 py-1 rounded-xl border border-red-300/30">
                🎒 Kurikulum Merdeka IPAS SD
              </span>
              <span className="bg-emerald-600/60 backdrop-blur-xs text-emerald-100 px-3 py-1 rounded-xl border border-emerald-300/30">
                ⚡ Mode Ringan (Bebas Lag & Hemat Kuota)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Notice Card (Highlighting Lightweight Optimization) */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border-2 border-rose-200 p-3.5 sm:p-4 shadow-sm flex items-start gap-3 text-slate-700 text-xs sm:text-sm">
        <div className="p-2 rounded-xl bg-rose-50 text-rose-600 shrink-0">
          <Tv className="w-5 h-5" />
        </div>
        <div className="flex-1 leading-relaxed">
          <span className="font-extrabold text-rose-700">Tips Pembelajaran Nyaman: </span>
          Video disajikan dengan sistem gambar preview cepat (thumbnail), sehingga website tetap ringan dan hemat memori. Cukup <span className="font-bold underline decoration-rose-400">klik kartu video mana saja</span> untuk langsung memutar video beresolusi penuh di aplikasi YouTube atau tab browser baru!
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border-2 border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    sound.playPop();
                  }}
                  className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-300 scale-102'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder="Cari video materi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-red-400 focus:bg-white rounded-2xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none transition-all pl-9"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 text-xs font-bold bg-slate-200/80 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Video Cards Grid */}
      {filteredVideos.length === 0 ? (
        <div className="bg-white/90 rounded-3xl border-2 border-dashed border-slate-300 p-12 text-center space-y-3">
          <div className="text-5xl">🔍📺</div>
          <h3 className="text-lg font-black text-slate-700">Video Tidak Ditemukan</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Tidak ada video yang cocok dengan kata kunci "{searchQuery}". Silakan coba kata kunci lain atau pilih kategori "Semua Video".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('semua');
              sound.playPop();
            }}
            className="mt-2 px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-red-700 cursor-pointer"
          >
            Tampilkan Semua Video
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredVideos.map((video, idx) => (
            <VideoCard key={video.id} video={video} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
};

interface VideoCardProps {
  video: EducationalVideo;
  index: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, index }) => {
  const [imgError, setImgError] = useState(false);

  // YouTube high quality default thumbnail with reliable fallback
  const thumbUrl = imgError
    ? `https://i.ytimg.com/vi/${video.youtubeId}/mqdefault.jpg`
    : `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        try {
          sound.playPop();
        } catch {}
      }}
      className="group relative flex flex-col bg-white/95 rounded-3xl border-2 border-slate-200/90 hover:border-red-400 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus:ring-4 focus:ring-red-300 cursor-pointer text-left"
      title={`Tonton "${video.title}" di YouTube`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
        {/* Thumbnail Image */}
        <img
          src={thumbUrl}
          alt={video.title}
          onError={() => setImgError(true)}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-300 ease-out"
        />

        {/* Play Overlay (Soft Flat Red YouTube Button) */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-lg transform group-hover:scale-115 transition-all duration-200 border-2 border-white/60">
            <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white translate-x-0.5" />
          </div>
        </div>

        {/* Top-Left Category Badge */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`inline-block px-2.5 py-1 rounded-xl text-[10px] font-black border shadow-xs backdrop-blur-md ${video.badgeColor}`}
          >
            {video.badge}
          </span>
        </div>

        {/* Bottom-Right Duration Badge */}
        <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-lg border border-white/20">
          ⏱️ {video.duration}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Video Title */}
          <h2 className="text-sm sm:text-base font-extrabold text-slate-800 font-heading leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
            {video.title}
          </h2>

          {/* Description */}
          <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
            {video.description}
          </p>
        </div>

        {/* Key Topic Badges */}
        <div className="flex flex-wrap gap-1">
          {video.keyTopics.slice(0, 3).map((topic, i) => (
            <span
              key={i}
              className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/80"
            >
              #{topic}
            </span>
          ))}
          {video.keyTopics.length > 3 && (
            <span className="text-[10px] font-bold text-slate-400 self-center">
              +{video.keyTopics.length - 3}
            </span>
          )}
        </div>

        {/* Bottom Bar: Channel Info & YouTube Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-black shrink-0">
              ▶
            </div>
            <span className="text-[11px] font-bold text-slate-600 truncate">
              {video.channelName}
            </span>
          </div>

          <div className="inline-flex items-center gap-1 text-[11px] font-black text-red-600 group-hover:text-red-700 shrink-0">
            <span>Tonton</span>
            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </a>
  );
};
