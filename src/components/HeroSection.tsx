import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Volume2,
  VolumeX,
  Video,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { openOrderWizard, setActiveTab, openReelModal, creators } = useApp();
  const [activeComparison, setActiveComparison] = useState<'after' | 'before'>('after');
  const [isPlaying, setIsPlaying] = useState(true);

  const featuredCreator = creators[0]; // Sarah

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
      {/* Subtle Ambient Lighting */}
      <div className="absolute top-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 -z-10 h-80 w-80 rounded-full bg-orange-500/10 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (RTL Right): Value Proposition & CTAs */}
          <div className="lg:col-span-7 text-right">
            {/* Value Marker */}
            <div className="inline-flex items-center gap-2 mb-6 text-xs font-semibold text-orange-400">
              <span className="flex h-2 w-2 rounded-full bg-orange-400"></span>
              <span>منصة الإنتاج الأولى لإعلانات الـ UGC والذكاء الاصطناعي في الشرق الأوسط</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.2] mb-6 text-balance">
              احصل على فيديوهات إعلانية حقيقية لمنتجك خلال{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
                48 ساعة
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl">
              ضاعف مبيعات متجرك بفيديوهات إعلانية أصلية من صناع محتوى محترفين (UGC) أو بنماذج الذكاء الاصطناعي فائقة الواقعية. أموالك محفوظة في حساب الضمان (Escrow) ولا تُصرف للمبدع إلا بعد مراجعتك واعتماد الفيديو بنسبة 100%.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10">
              <button
                onClick={() => setActiveTab('video_generator')}
                className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3.5 text-base font-extrabold text-slate-950 shadow-xl shadow-orange-500/25 transition-all hover:brightness-110 active:scale-95 cursor-pointer"
              >
                <Sparkles className="h-5 w-5" />
                <span>توليد فيديو حقيقي بالـ AI (Omni Flash)</span>
              </button>

              <button
                onClick={() => setActiveTab('3d_studio')}
                className="flex items-center gap-2 rounded-xl bg-indigo-600/30 border border-indigo-500/50 px-5 py-3.5 text-base font-semibold text-indigo-200 transition-all hover:bg-indigo-600/50 cursor-pointer"
              >
                <Video className="h-4 w-4 text-indigo-400" />
                <span>استوديو 3D الافتراضي</span>
              </button>

              <button
                onClick={() => openOrderWizard()}
                className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-5 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10 cursor-pointer"
              >
                <span>طلب صانع بشري (UGC)</span>
              </button>
            </div>

            {/* Guarantee Key Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">ضمان مالي 100%</h4>
                  <p className="text-xs text-slate-400 mt-0.5">تجميد المبلغ حتى رضاك التام</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Zap className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">تسليم 24 - 48 ساعة</h4>
                  <p className="text-xs text-slate-400 mt-0.5">وفوري خلال دقائق للـ AI</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <RotateCcw className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">تعديل مجاني مضمون</h4>
                  <p className="text-xs text-slate-400 mt-0.5">تعديل الملاحظات بدقة البريف</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (RTL Left): 9:16 Video Showcase with Before / After Toggle */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Showcase Container */}
            <div className="relative w-full max-w-[340px] rounded-3xl p-3 bg-gradient-to-b from-white/10 to-white/5 border border-white/15 shadow-2xl backdrop-blur-xl">
              {/* Segmented Comparison Switcher */}
              <div className="flex items-center justify-between mb-3 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-semibold">
                <button
                  onClick={() => setActiveComparison('after')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-center transition-all ${
                    activeComparison === 'after'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  فيديو UGC محترف (Creovo)
                </button>
                <button
                  onClick={() => setActiveComparison('before')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-center transition-all ${
                    activeComparison === 'before'
                      ? 'bg-red-950/60 text-red-200 border border-red-800/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  إعلان تقليدي جاف
                </button>
              </div>

              {/* 9:16 Smartphone Mockup Frame */}
              <div
                onClick={() => openReelModal(featuredCreator)}
                className="group relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-slate-900 border border-white/10 cursor-pointer shadow-inner"
              >
                {activeComparison === 'after' ? (
                  <>
                    <img
                      src={featuredCreator.reelImage}
                      alt="UGC Video Ad Preview"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Performance Overlay Floating Kicker */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                        <span>معدل تحويل +280%</span>
                      </div>
                      <div className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[11px] text-white/90">
                        HD 4K
                      </div>
                    </div>

                    {/* Gradient Scrim for Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" />

                    {/* Reel UI Overlay Bottom */}
                    <div className="absolute bottom-4 left-4 right-4 text-right pointer-events-none">
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={featuredCreator.avatar}
                          alt={featuredCreator.name}
                          className="h-7 w-7 rounded-full border border-white/40 object-cover"
                        />
                        <span className="text-xs font-bold text-white drop-shadow">
                          {featuredCreator.name}
                        </span>
                        <span className="text-[11px] text-indigo-300">
                          {featuredCreator.categoryLabel}
                        </span>
                      </div>
                      <p className="text-xs text-white/90 font-medium line-clamp-2 drop-shadow">
                        "سيروم Aura للبشرة: النضارة من أول استخدام بدون دهون أو لمعان!"
                      </p>

                      {/* Video Progress Bar Simulation */}
                      <div className="mt-3 h-1 w-full rounded-full bg-white/20 overflow-hidden">
                        <div className="h-full w-3/5 bg-orange-400 rounded-full" />
                      </div>
                    </div>

                    {/* Hover Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-slate-950 shadow-xl shadow-orange-500/50 transform transition-transform group-hover:scale-110">
                        <Play className="h-6 w-6 fill-current mr-0.5" />
                      </div>
                    </div>
                  </>
                ) : (
                  /* "Before" Generic Boring Ad Comparison */
                  <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 to-slate-950">
                    <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
                      <span className="text-2xl font-bold font-mono">✕</span>
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">
                      صورة منتج ثابتة ومملة
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      تكلفة إعلانية مرتفعة، الجمهور يتجاهلها في أول نصف ثانية، ولا تبني أي ثقة مع العميل.
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold">
                      CTR أقل من 0.4%
                    </div>
                  </div>
                )}
              </div>

              {/* Action Hint */}
              <p className="text-center text-[11px] text-slate-400 mt-2 font-medium">
                اضغط على الفيديو للمعاينة المباشرة بصوت وجودة كاملة
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
