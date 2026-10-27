import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Video,
  Sparkles,
  Download,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Plus,
  Tv,
  Smartphone,
  Cpu,
} from 'lucide-react';

interface VideoGeneratorStudioProps {
  initialPrompt?: string;
  initialProductName?: string;
}

export const VideoGeneratorStudio: React.FC<VideoGeneratorStudioProps> = ({
  initialPrompt,
  initialProductName,
}) => {
  const { createOrder, setActiveTab, setUserRole } = useApp();

  const [prompt, setPrompt] = useState(
    initialPrompt ||
      'فيديو إعلاني رأسي 9:16 احترافي لمنتج سيروم للبشرة، فتاة شابة تبتسم وتضع قطرات من السيروم بإضاءة صباحية طبيعية، وتظهر نتائج النضارة الفورية بأسلوب TikTok UGC عالي التحويل.'
  );
  const [productName, setProductName] = useState(initialProductName || 'سيروم النضارة الطبيعي');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [duration, setDuration] = useState<'5s' | '10s'>('5s');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generationStage, setGenerationStage] = useState<string>('');

  const promptPresets = [
    {
      title: 'سيروم عناية بالبشرة (تجميل)',
      product: 'سيروم فيتامين C العضوي',
      prompt:
        'Vertical 9:16 authentic TikTok UGC video ad. A smiling friendly woman in a bright bathroom tests an organic skincare serum, showing the amber glass dropper, applying drops to cheek, radiant glowing skin transformation, commercial 4k.',
    },
    {
      title: 'سماعات بلوتوث (تقنية)',
      product: 'سماعات AuraBudz اللاسلكية',
      prompt:
        'Vertical 9:16 tech unboxing video. Young content creator opens glowing LED earbuds case on wooden desk, puts on earbud, taps to activate noise cancelling with excited expression, authentic UGC tech review style.',
    },
    {
      title: 'عطر فاخر شرقي',
      product: 'عطر مسك الليل الملكي',
      prompt:
        'Cinematic 9:16 luxury fragrance commercial. Sleek crystal perfume bottle on black marble travertine, fine mist spray in slow motion with warm golden rim lighting, elegant lifestyle aesthetic.',
    },
    {
      title: 'شيكر رياضي ذكي (جيم)',
      product: 'زجاجة Hydrate Pro المعزولة',
      prompt:
        'Vertical 9:16 fitness creator testimonial. Athletic trainer in gym takes a cold drink from sleek matte black shaker bottle, checking digital temperature display on cap, high energy fitness ad.',
    },
  ];

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setGeneratedVideoUrl(null);
    setGenerationStage('جاري الاتصال بنموذج gemini-omni-1.1-flash عبر Interactions API...');

    const stageTimer1 = setTimeout(() => {
      setGenerationStage('جاري معالجة السيناريو والمؤثرات البصرية وتنسيق إطارات الفيديو (Rendering Frames)...');
    }, 4000);

    const stageTimer2 = setTimeout(() => {
      setGenerationStage('جاري تركيب الإضاءة والصوت وتصدير ترميز MP4 بدقة ' + resolution + '...');
    }, 12000);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          duration,
          resolution,
        }),
      });

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'فشل في توليد الفيديو من الخادم.');
      }

      if (data.videoUrl) {
        setGeneratedVideoUrl(data.videoUrl);
        setGenerationStage('تم توليد الفيديو الإعلاني بنجاح!');
      } else {
        throw new Error('لم يرجع الخادم رابط فيديو صالح.');
      }
    } catch (err: any) {
      console.error('Video generation error:', err);
      setErrorMessage(
        err.message || 'حدث خطأ أثناء محاولة التوليد. تأكد من إعداد مفتاح GEMINI_API_KEY بصلاحيات Omni Flash.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToOrders = () => {
    if (!generatedVideoUrl) return;

    createOrder({
      productName,
      productCategory: 'ذكاء اصطناعي فوري',
      productionType: 'ai',
      creatorName: 'مولد Creovo AI (gemini-omni-1.1-flash)',
      watermarkedVideoUrl: generatedVideoUrl,
      videoThumbnail: generatedVideoUrl,
      cleanVideoUrl: generatedVideoUrl,
      keyPoints: [prompt.slice(0, 80) + '...'],
      toneOfVoice: 'ذكاء اصطناعي واقعي فائق الدقة',
      pricing: {
        baseUsd: 10,
        ratiosCostUsd: 0,
        commercialRightsUsd: 15,
        express24hUsd: 0,
        rawFootageUsd: 0,
        totalUsd: 25,
        totalEgp: 500,
      },
    });

    setUserRole('client');
    setActiveTab('client_dashboard');
  };

  return (
    <section id="ai-generator" className="py-12 mx-auto max-w-7xl px-4 sm:px-6 text-right">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 mb-1">
            <Cpu className="h-4 w-4" />
            <span>محرك الفيديو العصبي الحقيقي · Powered by gemini-omni-1.1-flash</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            استوديو توليد الفيديوهات الحقيقية بالذكاء الاصطناعي
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            اكتب وصف إعلان منتجك، وحدد المقاس (9:16 لـ TikTok أو 16:9 لليوتيوب)، وسيقوم نموذج Omni Flash بتوليد فيديو إعلاني حقيقي بالكامل.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Inputs & Controls) - 7 cols */}
        <div className="lg:col-span-7 rounded-3xl bg-[#14172c] border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">اسم المنتج:</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="مثال: عطر لافندر الفاخر أو سماعات عازلة للضوضاء"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Prompt Presets */}
          <div>
            <span className="block text-xs font-bold text-slate-400 mb-2">
              نماذج وأفكار جاهزة سريعة:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {promptPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setProductName(preset.product);
                    setPrompt(preset.prompt);
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 text-right text-[11px] text-slate-300 transition-all cursor-pointer"
                >
                  <div className="font-bold text-white mb-0.5">{preset.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{preset.product}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Textarea */}
          <div>
            <label className="block text-xs font-bold text-white mb-1.5">
              وصف المشهد والإعلان بالتفصيل (Video Prompt):
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="صف حركة الكاميرا، الشخصية، طريقة عرض المنتج، الإضاءة، ونوع الإعلان..."
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              نصيحة: كلما وصفت المشهد وتجربة المنتج بوضوح، زادت جودة الفيديو النهائي ومعدل مبيعاته.
            </p>
          </div>

          {/* Generation Parameters: Aspect Ratio, Duration, Resolution */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
            {/* Aspect Ratio */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">مقاس الفيديو:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    aspectRatio === '9:16'
                      ? 'border-orange-500 bg-orange-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-slate-400'
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>راسي 9:16</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    aspectRatio === '16:9'
                      ? 'border-indigo-500 bg-indigo-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-slate-400'
                  }`}
                >
                  <Tv className="h-3.5 w-3.5" />
                  <span>أفقي 16:9</span>
                </button>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">مدة المقطع:</label>
              <div className="grid grid-cols-2 gap-2">
                {['5s', '10s'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d as any)}
                    className={`py-2 rounded-xl text-xs font-bold font-mono border text-center transition-all ${
                      duration === d
                        ? 'border-indigo-500 bg-indigo-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">الدقة وجودة الرندر:</label>
              <div className="grid grid-cols-2 gap-2">
                {['720p', '1080p'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setResolution(r as any)}
                    className={`py-2 rounded-xl text-xs font-bold font-mono border text-center transition-all ${
                      resolution === r
                        ? 'border-indigo-500 bg-indigo-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              onClick={handleGenerateVideo}
              disabled={isGenerating || !prompt.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3.5 text-slate-950 font-black text-sm shadow-xl shadow-orange-500/25 hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer transition-all"
            >
              <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>
                {isGenerating
                  ? 'جاري إنتاج وتوليد الفيديو العصبي بالـ AI...'
                  : 'توليد فيديو إعلاني حقيقي الآن (Generate Video)'}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column (Video Output Display & Player) - 5 cols */}
        <div className="lg:col-span-5 rounded-3xl bg-[#14172c] border border-white/10 p-6 sm:p-7 shadow-xl flex flex-col justify-between min-h-[500px]">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                مخرج الفيديو النهائي
              </span>
              <h3 className="text-base font-bold text-white">معاينة الفيديو الناتج</h3>
            </div>

            {/* In-progress Generation State */}
            {isGenerating && (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-orange-500 animate-spin" />
                  <Video className="h-6 w-6 text-orange-400 absolute inset-0 m-auto" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white">جاري توليد الفيديو الإعلاني الحقيقي...</div>
                  <div className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                    {generationStage}
                  </div>
                </div>
                <div className="h-1.5 w-48 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-orange-500 animate-[pulse_1s_infinite] w-full" />
                </div>
              </div>
            )}

            {/* Error State */}
            {errorMessage && !isGenerating && (
              <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-right space-y-2 mb-4">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                  <AlertCircle className="h-4 w-4" />
                  <span>تنبيه أثناء توليد الفيديو:</span>
                </div>
                <p className="text-xs text-red-200 leading-relaxed">{errorMessage}</p>
              </div>
            )}

            {/* Generated Real Video Player */}
            {generatedVideoUrl && !isGenerating && (
              <div className="space-y-4">
                <div
                  className={`relative mx-auto rounded-2xl overflow-hidden bg-black border border-white/20 shadow-2xl ${
                    aspectRatio === '9:16' ? 'aspect-[9/16] max-w-[280px]' : 'aspect-video w-full'
                  }`}
                >
                  <video
                    src={generatedVideoUrl}
                    controls
                    autoPlay
                    loop
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-300">تم اكتمال التوليد وجاهز للاستخدام!</span>
                  <span className="font-mono text-slate-400">{aspectRatio} · {duration}</span>
                </div>
              </div>
            )}

            {/* Empty Standby State */}
            {!generatedVideoUrl && !isGenerating && !errorMessage && (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                  <Video className="h-8 w-8" />
                </div>
                <h4 className="text-sm font-bold text-white">لم يتم توليد فيديو بعد</h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  اكتب وصف إعلانك واضغط زر "توليد فيديو إعلاني حقيقي الآن" لمشاهدة النتيجة المباشرة هنا.
                </p>
              </div>
            )}
          </div>

          {/* Action Footer for Generated Video */}
          {generatedVideoUrl && (
            <div className="pt-4 border-t border-white/10 space-y-2">
              <a
                href={generatedVideoUrl}
                download={`${productName}-ad.mp4`}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-3 shadow-md transition-all active:scale-95"
              >
                <Download className="h-4 w-4" />
                <span>تحميل الفيديو بجودة عالية (MP4)</span>
              </a>

              <button
                onClick={handleAddToOrders}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs py-2.5 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>إضافة الفيديو إلى طلباتي ومكتبة الوسائط</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
