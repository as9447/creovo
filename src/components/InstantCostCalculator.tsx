import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductionType, VideoRatio } from '../types';
import {
  Calculator,
  Bot,
  UserCheck,
  Zap,
  Check,
  ShieldCheck,
  Layers,
  FileVideo,
  FileCode,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const InstantCostCalculator: React.FC = () => {
  const { pricing, formatPrice, currency, openOrderWizard } = useApp();

  const [productionType, setProductionType] = useState<ProductionType>('human_ugc');
  const [videoCount, setVideoCount] = useState<number>(1);
  const [extraRatios, setExtraRatios] = useState<VideoRatio[]>([]);
  const [commercialRights, setCommercialRights] = useState<boolean>(true);
  const [express24h, setExpress24h] = useState<boolean>(false);
  const [rawFootage, setRawFootage] = useState<boolean>(false);

  // Dynamic Calculation
  const basePerVideo =
    productionType === 'ai' ? pricing.aiBaseUsd : pricing.humanUgcBaseUsd;

  let extraRatiosCost = 0;
  if (extraRatios.includes('16:9')) extraRatiosCost += pricing.ratio16_9Usd;
  if (extraRatios.includes('1:1')) extraRatiosCost += pricing.ratio1_1Usd;

  let addOnsPerVideo = extraRatiosCost;
  if (commercialRights) addOnsPerVideo += pricing.commercialRightsUsd;
  if (express24h) addOnsPerVideo += pricing.express24hUsd;
  if (rawFootage) addOnsPerVideo += pricing.rawFootageUsd;

  const subtotal = (basePerVideo + addOnsPerVideo) * videoCount;

  // Bundle discount: 3 videos = 5% off, 5 videos = 10% off, 10 videos = 15% off
  let discountPercent = 0;
  if (videoCount === 3) discountPercent = 5;
  else if (videoCount === 5) discountPercent = 10;
  else if (videoCount >= 10) discountPercent = 15;

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const totalUsd = subtotal - discountAmount;
  const totalEgp = Math.round(totalUsd * pricing.egpExchangeRate);

  const toggleRatio = (ratio: VideoRatio) => {
    if (extraRatios.includes(ratio)) {
      setExtraRatios(extraRatios.filter((r) => r !== ratio));
    } else {
      setExtraRatios([...extraRatios, ratio]);
    }
  };

  const handleProceedToWizard = () => {
    openOrderWizard();
  };

  return (
    <section id="cost-calculator" className="py-16 bg-[#0f1122]/80 border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-3">
            <Calculator className="h-4 w-4" />
            <span>تسعير شفاف وديناميكي بدون مفاجآت</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            حاسبة التكلفة السريعة
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
            حدد نوع الفيديو، العدد، والإضافات المطلوبة لتعرف التكلفة المبدئية بدقة فوراً.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Options Column (8 cols) */}
          <div className="lg:col-span-7 bg-[#14172c]/90 rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl text-right">
            {/* 1. Production Type */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-white mb-3">
                1. نوع الإنتاج الأساسي:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Human UGC */}
                <button
                  type="button"
                  onClick={() => setProductionType('human_ugc')}
                  className={`p-4 rounded-xl border text-right transition-all cursor-pointer ${
                    productionType === 'human_ugc'
                      ? 'border-orange-500 bg-orange-500/10 shadow-md ring-1 ring-orange-500/50'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-orange-400" />
                      <span className="font-bold text-white text-base">صانع محتوى بشري (UGC)</span>
                    </div>
                    {productionType === 'human_ugc' && (
                      <span className="h-5 w-5 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    شخص حقيقي يفتح المنتج ويجربه بيده. أعلى درجات المصداقية وثقة العملاء.
                  </p>
                  <div className="mt-3 text-xs font-semibold text-orange-300">
                    يبدأ من {formatPrice(pricing.humanUgcBaseUsd)} · تسليم 2 - 4 أيام
                  </div>
                </button>

                {/* AI Generated */}
                <button
                  type="button"
                  onClick={() => setProductionType('ai')}
                  className={`p-4 rounded-xl border text-right transition-all cursor-pointer ${
                    productionType === 'ai'
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-md ring-1 ring-indigo-500/50'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-indigo-400" />
                      <span className="font-bold text-white text-base">ذكاء اصطناعي (AI Avatar)</span>
                    </div>
                    {productionType === 'ai' && (
                      <span className="h-5 w-5 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    آفاتار رقمي فائق الواقعية يتحدث بالنص المكتوب. سريع واقتصادي لاختبارات الـ A/B.
                  </p>
                  <div className="mt-3 text-xs font-semibold text-indigo-300">
                    يبدأ من {formatPrice(pricing.aiBaseUsd)} · تسليم 15 - 30 دقيقة
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Number of Videos */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-emerald-400 font-medium">
                  {discountPercent > 0 ? `خصم باقة ${discountPercent}% مفعل!` : 'وفر عند طلب أكثر من فيديو'}
                </span>
                <label className="text-sm font-bold text-white">
                  2. عدد الفيديوهات المطلوبة:
                </label>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[1, 3, 5, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setVideoCount(num)}
                    className={`py-3 rounded-xl border font-bold text-sm transition-all cursor-pointer ${
                      videoCount === num
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>{num} فيديو</div>
                    <div className="text-[10px] font-normal opacity-75 mt-0.5">
                      {num === 1 ? 'تجربة فردية' : num === 3 ? 'خصم 5%' : num === 5 ? 'خصم 10%' : 'خصم 15%'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Extra Aspect Ratios */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-white mb-2">
                3. المقاسات الإضافية:
              </label>
              <p className="text-xs text-slate-400 mb-3">
                المقاس الرأسي 9:16 (TikTok/Reels) مشمول مجاناً كمعيار افتراضي. يمكنك إضافة مقاسات أخرى:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => toggleRatio('16:9')}
                  className={`flex items-center justify-between p-3 rounded-xl border text-right transition-all cursor-pointer ${
                    extraRatios.includes('16:9')
                      ? 'border-indigo-500 bg-indigo-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-4 w-4 rounded border flex items-center justify-center text-[10px] ${
                      extraRatios.includes('16:9') ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-500'
                    }`}>
                      {extraRatios.includes('16:9') && '✓'}
                    </span>
                    <span className="text-xs font-semibold">أفقي 16:9 (يوتيوب / موقع)</span>
                  </div>
                  <span className="text-xs font-mono text-indigo-300 tabular-nums">
                    +{formatPrice(pricing.ratio16_9Usd)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleRatio('1:1')}
                  className={`flex items-center justify-between p-3 rounded-xl border text-right transition-all cursor-pointer ${
                    extraRatios.includes('1:1')
                      ? 'border-indigo-500 bg-indigo-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-4 w-4 rounded border flex items-center justify-center text-[10px] ${
                      extraRatios.includes('1:1') ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-500'
                    }`}>
                      {extraRatios.includes('1:1') && '✓'}
                    </span>
                    <span className="text-xs font-semibold">مربع 1:1 (فيسبوك / فيد)</span>
                  </div>
                  <span className="text-xs font-mono text-indigo-300 tabular-nums">
                    +{formatPrice(pricing.ratio1_1Usd)}
                  </span>
                </button>
              </div>
            </div>

            {/* 4. Add-ons Matrix */}
            <div>
              <label className="block text-sm font-bold text-white mb-3">
                4. إضافات الحماية والسرعة:
              </label>
              <div className="space-y-3">
                {/* Commercial Rights */}
                <div
                  onClick={() => setCommercialRights(!commercialRights)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    commercialRights
                      ? 'border-indigo-500/60 bg-indigo-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-5 w-5 rounded border flex items-center justify-center text-xs ${
                      commercialRights ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-500'
                    }`}>
                      {commercialRights && '✓'}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        حقوق الاستخدام التجاري والإعلاني الكاملة (Ad Rights)
                      </div>
                      <div className="text-xs text-slate-400">
                        استخدام دائم ومطلق في الحملات الممولة على ميتا، تيك توك وسناب شات
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-300 tabular-nums shrink-0">
                    +{formatPrice(pricing.commercialRightsUsd)}
                  </span>
                </div>

                {/* Express 24h */}
                <div
                  onClick={() => setExpress24h(!express24h)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    express24h
                      ? 'border-amber-500/60 bg-amber-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-5 w-5 rounded border flex items-center justify-center text-xs ${
                      express24h ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold' : 'border-slate-500'
                    }`}>
                      {express24h && '✓'}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        تسليم سريع جداً (Express Delivery خلال 24 ساعة)
                      </div>
                      <div className="text-xs text-slate-400">
                        أولوية تصوير قصوى وإرسال المسودة في أقل من يوم
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300 tabular-nums shrink-0">
                    +{formatPrice(pricing.express24hUsd)}
                  </span>
                </div>

                {/* Raw Footage */}
                <div
                  onClick={() => setRawFootage(!rawFootage)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    rawFootage
                      ? 'border-indigo-500/60 bg-indigo-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-5 w-5 rounded border flex items-center justify-center text-xs ${
                      rawFootage ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-500'
                    }`}>
                      {rawFootage && '✓'}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        ملفات التعديل والمشاهد الخام (Raw Footage)
                      </div>
                      <div className="text-xs text-slate-400">
                        استلام جميع اللقطات بدون مونتاج لإعادة إنتاج زوايا أخرى بنفسك
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-300 tabular-nums shrink-0">
                    +{formatPrice(pricing.rawFootageUsd)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time Price Summary Card (5 cols) */}
          <div className="lg:col-span-5 sticky top-28 bg-gradient-to-b from-[#191c36] to-[#121528] rounded-2xl p-6 sm:p-7 border border-indigo-500/30 shadow-2xl text-right">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                تسعير فوري معتمد
              </span>
              <h3 className="text-lg font-bold text-white">ملخص التكلفة المبدئية</h3>
            </div>

            {/* Line items breakdown */}
            <div className="py-4 space-y-3 text-xs border-b border-white/10">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-mono tabular-nums text-white">
                  {formatPrice(basePerVideo * videoCount)}
                </span>
                <span>
                  {productionType === 'human_ugc' ? 'صانع محتوى بشري' : 'ذكاء اصطناعي'} × {videoCount}
                </span>
              </div>

              {extraRatiosCost > 0 && (
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-mono tabular-nums text-white">
                    {formatPrice(extraRatiosCost * videoCount)}
                  </span>
                  <span>مقاسات إضافية ({extraRatios.join(', ')})</span>
                </div>
              )}

              {commercialRights && (
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-mono tabular-nums text-white">
                    {formatPrice(pricing.commercialRightsUsd * videoCount)}
                  </span>
                  <span>حقوق الاستخدام التجاري الكاملة</span>
                </div>
              )}

              {express24h && (
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-mono tabular-nums text-amber-400">
                    {formatPrice(pricing.express24hUsd * videoCount)}
                  </span>
                  <span>تسليم سريع خلال 24 ساعة</span>
                </div>
              )}

              {rawFootage && (
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-mono tabular-nums text-white">
                    {formatPrice(pricing.rawFootageUsd * videoCount)}
                  </span>
                  <span>الملفات والمشاهد الخام</span>
                </div>
              )}

              {discountPercent > 0 && (
                <div className="flex items-center justify-between text-emerald-400 font-semibold">
                  <span className="font-mono tabular-nums">
                    -{formatPrice(discountAmount)}
                  </span>
                  <span>خصم باقة الفيديوهات ({discountPercent}%)</span>
                </div>
              )}
            </div>

            {/* Total Display */}
            <div className="pt-4 pb-6">
              <div className="flex items-baseline justify-between mb-1">
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                    {formatPrice(totalUsd)}
                  </div>
                  {currency === 'USD' && (
                    <div className="text-xs text-slate-400 font-mono tabular-nums mt-0.5">
                      ما يعادل تقريباً {totalEgp.toLocaleString()} ج.م
                    </div>
                  )}
                </div>
                <span className="text-sm font-semibold text-slate-400">الإجمالي النهائي:</span>
              </div>
            </div>

            {/* Escrow Guarantee Pill */}
            <div className="mb-6 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-indigo-200/90 leading-relaxed">
                <strong className="text-white">نظام الضمان المالي Escrow:</strong> لا يتم تحويل المبلغ للمبدع إلا بعد مراجعتك للمسودة المائية وموافقتك النهائية.
              </p>
            </div>

            {/* Proceed CTA */}
            <button
              onClick={handleProceedToWizard}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3.5 text-base font-bold text-slate-950 shadow-xl shadow-orange-500/25 transition-all hover:brightness-110 active:scale-95"
            >
              <span>اطلب الآن بهذه المواصفات</span>
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
