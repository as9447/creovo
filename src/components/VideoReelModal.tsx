import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Star,
  ShieldCheck,
  Sparkles,
  Heart,
  Share2,
  Check,
} from 'lucide-react';

export const VideoReelModal: React.FC = () => {
  const { reelModal, closeReelModal, openOrderWizard, formatPrice, favorites, toggleFavorite } = useApp();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(30);
  const [watermarkOverride, setWatermarkOverride] = useState<boolean | null>(null);

  const creator = reelModal.creator;
  const isWatermarked =
    watermarkOverride !== null ? watermarkOverride : reelModal.hasWatermark;

  useEffect(() => {
    let interval: any;
    if (isPlaying && reelModal.isOpen) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1.5));
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, reelModal.isOpen]);

  if (!reelModal.isOpen || !creator) return null;

  const isFav = favorites.includes(creator.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
      <div className="relative flex flex-col md:flex-row items-center gap-6 max-h-[96vh] w-full max-w-4xl text-right">
        {/* Close Button Top Right/Left */}
        <button
          onClick={closeReelModal}
          className="absolute -top-12 left-0 md:top-2 md:left-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 9:16 Smartphone Mockup Display */}
        <div className="relative aspect-[9/16] w-full max-w-[340px] sm:max-w-[360px] rounded-[36px] overflow-hidden bg-slate-950 border-4 border-slate-700 shadow-2xl shadow-indigo-500/20 shrink-0">
          {/* Top Smartphone Camera Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 h-4 w-28 rounded-full bg-slate-900 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-slate-800 mr-2" />
          </div>

          {/* Video Asset Display */}
          <img
            src={reelModal.videoUrl || creator.reelImage}
            alt="Reel Showcase"
            className="h-full w-full object-cover"
          />

          {/* Watermark Overlay (If Enabled or In Review) */}
          {isWatermarked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden z-10 bg-black/20">
              <div className="transform -rotate-45 space-y-6 opacity-60">
                <div className="text-base font-black tracking-widest text-white font-mono border-2 border-white/70 px-3 py-1 rounded bg-black/50">
                  CREOVO · DRAFT PREVIEW
                </div>
                <div className="text-base font-black tracking-widest text-white font-mono border-2 border-white/70 px-3 py-1 rounded bg-black/50">
                  نسخة مراجعة غير مرخصة
                </div>
                <div className="text-base font-black tracking-widest text-white font-mono border-2 border-white/70 px-3 py-1 rounded bg-black/50">
                  ESCROW PROTECTED
                </div>
              </div>

              <div className="absolute bottom-16 left-3 right-3 bg-amber-500/95 text-slate-950 px-3 py-1.5 rounded-lg text-center text-[10px] font-bold shadow-md">
                🔒 مسودة مائية — تزال تلقائياً فور اعتماد الفيديو
              </div>
            </div>
          )}

          {/* Gradient Scrim for Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />

          {/* Controls Overlay */}
          <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-20">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-colors"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            {/* Sound Wave Animation Visualizer */}
            {!isMuted && isPlaying && (
              <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-md">
                <span className="h-2 w-0.5 bg-orange-400 animate-[pulse_0.4s_infinite]" />
                <span className="h-3.5 w-0.5 bg-orange-400 animate-[pulse_0.6s_infinite]" />
                <span className="h-2 w-0.5 bg-orange-400 animate-[pulse_0.3s_infinite]" />
                <span className="h-4 w-0.5 bg-orange-400 animate-[pulse_0.5s_infinite]" />
                <span className="text-[10px] font-mono font-bold text-white ml-1">صوت نقي</span>
              </div>
            )}
          </div>

          {/* Click to Play/Pause on whole screen */}
          <div
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
          >
            {!isPlaying && (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-slate-950 shadow-2xl">
                <Play className="h-7 w-7 fill-current mr-0.5" />
              </div>
            )}
          </div>

          {/* Reel Interactive Progress Bar */}
          <div className="absolute bottom-2 left-4 right-4 z-20">
            <div className="h-1 w-full bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-400 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Creator & Caption Bottom Overlay */}
          <div className="absolute bottom-6 left-4 right-4 z-20 pointer-events-none text-right">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={creator.avatar}
                alt=""
                className="h-8 w-8 rounded-full border border-white/60 object-cover"
              />
              <div>
                <span className="text-xs font-bold text-white drop-shadow block">
                  {creator.name}
                </span>
                <span className="text-[10px] text-indigo-300 drop-shadow">
                  {creator.handle} · {creator.dialectLabel}
                </span>
              </div>
            </div>
            <p className="text-xs text-white/95 leading-snug drop-shadow line-clamp-2">
              "{creator.sampleVideoTitle}"
            </p>
          </div>
        </div>

        {/* Modal Side Details Panel (Creator Profile & Direct Order Action) */}
        <div className="flex-1 rounded-3xl bg-[#14172c] border border-white/10 p-6 sm:p-8 shadow-2xl flex flex-col justify-between max-w-md w-full">
          <div>
            <div className="flex items-start justify-between mb-4">
              <button
                onClick={() => toggleFavorite(creator.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hover:text-white"
              >
                <Heart className={`h-4 w-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{isFav ? 'في المفضلة' : 'حفظ بالمفضلة'}</span>
              </button>

              <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                <Star className="h-4 w-4 fill-amber-400" />
                <span className="font-mono tabular-nums">{creator.rating}</span>
                <span className="text-xs text-slate-400">({creator.reviewsCount} تقييم)</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{creator.name}</h3>
            <p className="text-xs text-indigo-400 font-semibold mb-3">
              {creator.categoryLabel} · {creator.dialectLabel}
            </p>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {creator.bio}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {creator.badges.map((b, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-bold"
                >
                  {b}
                </span>
              ))}
            </div>

            {/* Equipment Breakdown */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1.5 mb-5">
              <div className="font-bold text-white mb-1">المعدات وجودة التصوير:</div>
              <div className="text-slate-300">
                • الكاميرا: <span className="text-white font-mono">{creator.equipment.camera}</span>
              </div>
              <div className="text-slate-300">
                • الإضاءة: <span className="text-white">{creator.equipment.lighting}</span>
              </div>
              <div className="text-slate-300">
                • الصوت: <span className="text-white">{creator.equipment.mic}</span>
              </div>
            </div>

            {/* Interactive Watermark Toggle Demo */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 text-xs mb-5">
              <span className="text-slate-300">محاكاة العلامة المائية للطلب:</span>
              <button
                onClick={() => setWatermarkOverride(!isWatermarked)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  isWatermarked
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {isWatermarked ? 'العلامة المائية مفعّلة' : 'النسخة الأصلية المعتمدة'}
              </button>
            </div>
          </div>

          {/* Pricing & Order CTA */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">سعر الفيديو يبدأ من:</span>
              <span className="text-xl font-extrabold text-white font-mono tabular-nums">
                {formatPrice(creator.startingPriceUsd)}
              </span>
            </div>

            <button
              onClick={() => {
                closeReelModal();
                openOrderWizard(creator);
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-xs font-bold text-slate-950 shadow-xl shadow-orange-500/20 hover:brightness-110 active:scale-95 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>طلب فيديو من {creator.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
