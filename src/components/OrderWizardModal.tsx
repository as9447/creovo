import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductionType, VideoRatio, OrderAddOns, OrderPricing } from '../types';
import {
  X,
  Bot,
  UserCheck,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Plus,
  Trash2,
  Wand2,
  CreditCard,
  Smartphone,
} from 'lucide-react';

export const OrderWizardModal: React.FC = () => {
  const {
    isOrderWizardOpen,
    closeOrderWizard,
    selectedCreatorForOrder,
    pricing,
    formatPrice,
    currency,
    createOrder,
    setActiveTab,
    setUserRole,
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [productionType, setProductionType] = useState<ProductionType>(
    selectedCreatorForOrder?.type === 'ai' ? 'ai' : 'human_ugc'
  );

  const [productName, setProductName] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [productCategory, setProductCategory] = useState('تجميل وعناية');
  const [keyPoints, setKeyPoints] = useState<string[]>([
    'تسليط الضوء على حل المشكلة في أول 3 ثوانٍ (Hook قوي)',
    'إظهار طريقة استخدام المنتج مباشرة أمام الكاميرا',
  ]);
  const [newKeyPoint, setNewKeyPoint] = useState('');

  const [forbiddenPoints, setForbiddenPoints] = useState<string[]>([
    'تجنب ذكر أسعار صريحة بالعملات الأجنبية',
  ]);
  const [newForbiddenPoint, setNewForbiddenPoint] = useState('');

  const [toneOfVoice, setToneOfVoice] = useState('حماسية ومباشرة');
  const [clientName, setClientName] = useState('متجر الأناقة الرقمي');
  const [clientEmail, setClientEmail] = useState('admin@elegancestore.com');

  // Add-ons State
  const [addOns, setAddOns] = useState<OrderAddOns>({
    physicalShipping: productionType === 'human_ugc',
    aspectRatios: ['9:16'],
    commercialRights: true,
    express24h: false,
    rawFootage: false,
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'instapay' | 'vodafone'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  if (!isOrderWizardOpen) return null;

  // Pricing calculations
  const baseUsd =
    selectedCreatorForOrder
      ? selectedCreatorForOrder.startingPriceUsd
      : productionType === 'ai'
      ? pricing.aiBaseUsd
      : pricing.humanUgcBaseUsd;

  let ratiosCostUsd = 0;
  if (addOns.aspectRatios.includes('16:9')) ratiosCostUsd += pricing.ratio16_9Usd;
  if (addOns.aspectRatios.includes('1:1')) ratiosCostUsd += pricing.ratio1_1Usd;

  const commercialRightsUsd = addOns.commercialRights ? pricing.commercialRightsUsd : 0;
  const express24hUsd = addOns.express24h ? pricing.express24hUsd : 0;
  const rawFootageUsd = addOns.rawFootage ? pricing.rawFootageUsd : 0;

  const totalUsd =
    baseUsd + ratiosCostUsd + commercialRightsUsd + express24hUsd + rawFootageUsd;
  const totalEgp = Math.round(totalUsd * pricing.egpExchangeRate);

  const finalPricing: OrderPricing = {
    baseUsd,
    ratiosCostUsd,
    commercialRightsUsd,
    express24hUsd,
    rawFootageUsd,
    totalUsd,
    totalEgp,
  };

  const toggleRatio = (ratio: VideoRatio) => {
    if (ratio === '9:16') return; // 9:16 is default mandatory
    if (addOns.aspectRatios.includes(ratio)) {
      setAddOns({
        ...addOns,
        aspectRatios: addOns.aspectRatios.filter((r) => r !== ratio),
      });
    } else {
      setAddOns({
        ...addOns,
        aspectRatios: [...addOns.aspectRatios, ratio],
      });
    }
  };

  const handleAddKeyPoint = () => {
    if (newKeyPoint.trim()) {
      setKeyPoints([...keyPoints, newKeyPoint.trim()]);
      setNewKeyPoint('');
    }
  };

  const handleRemoveKeyPoint = (index: number) => {
    setKeyPoints(keyPoints.filter((_, i) => i !== index));
  };

  const handleAddForbiddenPoint = () => {
    if (newForbiddenPoint.trim()) {
      setForbiddenPoints([...forbiddenPoints, newForbiddenPoint.trim()]);
      setNewForbiddenPoint('');
    }
  };

  const handleRemoveForbiddenPoint = (index: number) => {
    setForbiddenPoints(forbiddenPoints.filter((_, i) => i !== index));
  };

  // AI Script Assistant feature
  const handleGenerateScriptWithAi = () => {
    setIsGeneratingScript(true);
    setTimeout(() => {
      setKeyPoints([
        `افتتاحية Hook صاعقة: "توقفت عن إضاعة نقودي بعد أن جربت هذا المنتج!"`,
        `عرض مشكلة حقيقية يعاني منها العميل ثم استعراض حل ${productName || 'المنتج'} بأسلوب واقعي.`,
        `دعوة واضحة لاتخاذ إجراء مع كود خصم خاص للمتابعين في الختام.`,
      ]);
      setToneOfVoice('مرحة وسلسة تشبه حديث الأصدقاء (TikTok Native)');
      setIsGeneratingScript(false);
    }, 1200);
  };

  // Handle final checkout
  const handleFinalOrderSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      createOrder({
        clientName,
        clientEmail,
        creatorId: selectedCreatorForOrder ? selectedCreatorForOrder.id : 'c1',
        creatorName: selectedCreatorForOrder ? selectedCreatorForOrder.name : 'سارة الشريف',
        creatorAvatar: selectedCreatorForOrder
          ? selectedCreatorForOrder.avatar
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        productionType,
        productName: productName || 'منتج مميز',
        productUrl,
        productCategory,
        keyPoints,
        forbiddenPoints,
        toneOfVoice,
        addOns,
        pricing: finalPricing,
        watermarkedVideoUrl:
          selectedCreatorForOrder?.reelImage ||
          '/src/assets/images/ugc_reel_skincare_1793114432299.jpg',
        videoThumbnail:
          selectedCreatorForOrder?.reelImage ||
          '/src/assets/images/ugc_reel_skincare_1793114432299.jpg',
      });

      setIsSubmitting(false);
      closeOrderWizard();
      setUserRole('client');
      setActiveTab('client_dashboard');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#121528] border border-white/15 shadow-2xl text-right overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161a33]">
          <button
            onClick={closeOrderWizard}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
              خطوة {currentStep} من 4
            </span>
            <h3 className="text-base font-bold text-white">معالج طلب الفيديو الإعلاني</h3>
          </div>
        </div>

        {/* Step Progress Line */}
        <div className="grid grid-cols-4 bg-white/5 border-b border-white/10 text-center text-xs">
          {[
            { step: 1, title: 'نوع الإنتاج' },
            { step: 2, title: 'مواصفات البريف' },
            { step: 3, title: 'الإضافات والمقاسات' },
            { step: 4, title: 'الدفع والضمان (Escrow)' },
          ].map((s) => (
            <div
              key={s.step}
              className={`py-2.5 px-2 border-b-2 transition-all font-semibold ${
                currentStep === s.step
                  ? 'border-orange-500 text-white bg-orange-500/10'
                  : currentStep > s.step
                  ? 'border-indigo-500 text-indigo-300'
                  : 'border-transparent text-slate-500'
              }`}
            >
              <span className="hidden sm:inline">
                {s.step}. {s.title}
              </span>
              <span className="sm:hidden">{s.step}</span>
            </div>
          ))}
        </div>

        {/* Modal Body: Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: PRODUCTION TYPE */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-white mb-1">
                  اختر أسلوب الإنتاج المناسب لحملتك
                </h4>
                <p className="text-xs text-slate-300">
                  يمكنك الاختيار بين تصوير حقيقي بصانع محتوى أو فيديو فوري بالذكاء الاصطناعي.
                </p>
              </div>

              {selectedCreatorForOrder && (
                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
                  <div className="text-xs text-indigo-200">
                    أنت تطلب مباشرة من المبدع المختار:
                    <strong className="text-white mr-1">{selectedCreatorForOrder.name}</strong>
                  </div>
                  <img
                    src={selectedCreatorForOrder.avatar}
                    alt=""
                    className="h-8 w-8 rounded-full border border-indigo-400 object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Human UGC Card */}
                <div
                  onClick={() => setProductionType('human_ugc')}
                  className={`p-5 rounded-2xl border text-right cursor-pointer transition-all ${
                    productionType === 'human_ugc'
                      ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/40 shadow-xl'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-orange-400 px-2 py-0.5 rounded bg-orange-500/20">
                      يبدأ من {formatPrice(pricing.humanUgcBaseUsd)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">صانع محتوى بشري (UGC)</span>
                      <UserCheck className="h-5 w-5 text-orange-400" />
                    </div>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300 mb-4">
                    <li className="flex items-center justify-end gap-1.5">
                      <span>تسليم خلال 2 - 4 أيام عمل</span>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    </li>
                    <li className="flex items-center justify-end gap-1.5">
                      <span>شخص حقيقي يفتح المنتج ويجربه بيده</span>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    </li>
                    <li className="flex items-center justify-end gap-1.5">
                      <span>إمكانية شحن منتجك لعنوان المبدع</span>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    </li>
                    <li className="flex items-center justify-end gap-1.5 font-semibold text-orange-200">
                      <span>مثالي لبناء ثقة عالية وحملات الإعلانات الكبرى</span>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    </li>
                  </ul>
                </div>

                {/* AI Generated Card */}
                <div
                  onClick={() => setProductionType('ai')}
                  className={`p-5 rounded-2xl border text-right cursor-pointer transition-all ${
                    productionType === 'ai'
                      ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/40 shadow-xl'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/20">
                      يبدأ من {formatPrice(pricing.aiBaseUsd)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">ذكاء اصطناعي (AI Avatar)</span>
                      <Bot className="h-5 w-5 text-indigo-400" />
                    </div>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300 mb-4">
                    <li className="flex items-center justify-end gap-1.5">
                      <span>تسليم فائق السرعة (15 - 30 دقيقة)</span>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    </li>
                    <li className="flex items-center justify-end gap-1.5">
                      <span>آفاتار رقمي يتحدث بنص محدد وVoiceover نقي</span>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    </li>
                    <li className="flex items-center justify-end gap-1.5">
                      <span>لا يتطلب شحن (فقط صور أو روابط منتجك)</span>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    </li>
                    <li className="flex items-center justify-end gap-1.5 font-semibold text-indigo-200">
                      <span>مثالي لاختبارات A/B والميزانيات الاقتصادية</span>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BRIEF SPECIFICATIONS */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleGenerateScriptWithAi}
                  disabled={isGeneratingScript}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600/30 border border-indigo-500/50 px-3 py-1.5 text-xs font-bold text-indigo-200 hover:bg-indigo-600/50 transition-all cursor-pointer"
                >
                  <Wand2 className={`h-3.5 w-3.5 ${isGeneratingScript ? 'animate-spin' : ''}`} />
                  <span>
                    {isGeneratingScript ? 'جاري توليد سيناريو ذكي...' : 'اقتراح سيناريو بالذكاء الاصطناعي'}
                  </span>
                </button>
                <div>
                  <h4 className="text-base font-bold text-white">تعبئة نموذج طلب الفيديو (Brief)</h4>
                  <p className="text-xs text-slate-400">حدد مواصفات الفيديو والرسائل الإعلانية بدقة</p>
                </div>
              </div>

              {/* Product Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">اسم المنتج:</label>
                  <input
                    type="text"
                    placeholder="مثال: سيروم ريتينول للنضارة"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">تصنيف المنتج:</label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full rounded-xl bg-[#14172c] border border-white/10 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="تجميل وعناية">تجميل وعناية بالبشرة</option>
                    <option value="تقنية وإلكترونيات">تقنية وإلكترونيات</option>
                    <option value="ملابس وأزياء">ملابس وأزياء</option>
                    <option value="لياقة وصحة">لياقة وصحة ومكملات</option>
                    <option value="خدمات وتطبيقات">خدمات وتطبيقات</option>
                  </select>
                </div>
              </div>

              {/* Product Link */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  رابط المنتج أو المتجر (اختياري):
                </label>
                <input
                  type="url"
                  placeholder="https://yourstore.com/product"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none text-left font-mono"
                  dir="ltr"
                />
              </div>

              {/* Key Points (Do's) */}
              <div>
                <label className="block text-xs font-bold text-white mb-1.5">
                  النقاط الواجب ذكرها (Key Points & Hooks):
                </label>
                <div className="space-y-2 mb-2">
                  {keyPoints.map((pt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyPoint(idx)}
                        className="text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <span className="flex-1 text-right pr-2">{pt}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddKeyPoint}
                    className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>إضافة</span>
                  </button>
                  <input
                    type="text"
                    placeholder="أضف نقطة محددة تريد من صانع المحتوى قولها..."
                    value={newKeyPoint}
                    onChange={(e) => setNewKeyPoint(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyPoint())}
                    className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Forbidden Points (Don'ts) */}
              <div>
                <label className="block text-xs font-bold text-white mb-1.5">
                  أشياء ممنوع ذكرها أو فعلها (Don'ts):
                </label>
                <div className="space-y-2 mb-2">
                  {forbiddenPoints.map((pt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-red-950/20 border border-red-500/20 text-xs text-red-200"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveForbiddenPoint(idx)}
                        className="text-slate-400 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <span className="flex-1 text-right pr-2">{pt}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddForbiddenPoint}
                    className="px-3 py-2 rounded-xl bg-red-600/80 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>إضافة</span>
                  </button>
                  <input
                    type="text"
                    placeholder="مثال: ممنوع المقارنة بماركات أخرى، ممنوع الرش المفرط..."
                    value={newForbiddenPoint}
                    onChange={(e) => setNewForbiddenPoint(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddForbiddenPoint())}
                    className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tone of Voice */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">نبرة الصوت (Tone of Voice):</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['حماسية ومباشرة', 'مرحة وعفوية', 'احترافية وتقنية', 'هادئة ومقنعة'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setToneOfVoice(t)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        toneOfVoice === t
                          ? 'border-indigo-500 bg-indigo-500/20 text-white'
                          : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ADD-ONS & RATIOS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white mb-1">
                  إضافات وتخصيصات الفيديو (Add-ons Matrix)
                </h4>
                <p className="text-xs text-slate-400">
                  حدد المقاسات وحقوق النشر وسرعة التسليم لحملتك
                </p>
              </div>

              {/* Physical Product Shipping Notice */}
              {productionType === 'human_ugc' && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="text-xs text-slate-300 text-right">
                    <div className="font-bold text-white mb-0.5">شحن منتج حقيقي إلى صانع المحتوى:</div>
                    <div>
                      مجاناً (+ $0) عبر المنصة · يتكفل العميل بمصاريف شركة الشحن، وستستلم عنوان المبدع فور تأكيد الطلب.
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    +$0 مجاني
                  </span>
                </div>
              )}

              {/* Extra Ratios */}
              <div>
                <label className="block text-xs font-bold text-white mb-2">
                  المقاسات المرفقة:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-center">
                    <div className="text-xs font-bold text-white">راسي 9:16</div>
                    <div className="text-[10px] text-slate-300 mt-0.5">TikTok & Reels</div>
                    <div className="mt-1 text-[11px] font-bold text-emerald-400">مشمول افتراضياً</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleRatio('16:9')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      addOns.aspectRatios.includes('16:9')
                        ? 'bg-indigo-600/30 border-indigo-500 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">أفقي 16:9</div>
                    <div className="text-[10px] opacity-75 mt-0.5">YouTube / موقع</div>
                    <div className="mt-1 text-[11px] font-mono font-bold text-indigo-300">
                      +{formatPrice(pricing.ratio16_9Usd)}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleRatio('1:1')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      addOns.aspectRatios.includes('1:1')
                        ? 'bg-indigo-600/30 border-indigo-500 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">مربع 1:1</div>
                    <div className="text-[10px] opacity-75 mt-0.5">فيسبوك / فيد</div>
                    <div className="mt-1 text-[11px] font-mono font-bold text-indigo-300">
                      +{formatPrice(pricing.ratio1_1Usd)}
                    </div>
                  </button>
                </div>
              </div>

              {/* Checkbox Options */}
              <div className="space-y-3">
                {/* Ad Rights */}
                <div
                  onClick={() =>
                    setAddOns({ ...addOns, commercialRights: !addOns.commercialRights })
                  }
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    addOns.commercialRights
                      ? 'border-indigo-500 bg-indigo-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-5 w-5 rounded border flex items-center justify-center text-xs ${
                      addOns.commercialRights ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-500'
                    }`}>
                      {addOns.commercialRights && '✓'}
                    </span>
                    <div className="text-right">
                      <div className="text-xs font-bold text-white">
                        حقوق الاستخدام التجاري الكامل وحقوق الإعلانات (Ad Rights)
                      </div>
                      <div className="text-[11px] text-slate-400">
                        ترخيص استخدام بلا حدود في كافة المنصات والحملات الإعلانية الممولة
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-300 tabular-nums shrink-0">
                    +{formatPrice(pricing.commercialRightsUsd)}
                  </span>
                </div>

                {/* Express Delivery */}
                <div
                  onClick={() =>
                    setAddOns({ ...addOns, express24h: !addOns.express24h })
                  }
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    addOns.express24h
                      ? 'border-amber-500 bg-amber-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-5 w-5 rounded border flex items-center justify-center text-xs ${
                      addOns.express24h ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold' : 'border-slate-500'
                    }`}>
                      {addOns.express24h && '✓'}
                    </span>
                    <div className="text-right">
                      <div className="text-xs font-bold text-white">
                        تسليم سريع جداً (Express Delivery خلال 24 ساعة)
                      </div>
                      <div className="text-[11px] text-slate-400">
                        استلام المسودة المائية الأولى خلال 24 ساعة كحد أقصى
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300 tabular-nums shrink-0">
                    +{formatPrice(pricing.express24hUsd)}
                  </span>
                </div>

                {/* Raw Footage */}
                <div
                  onClick={() =>
                    setAddOns({ ...addOns, rawFootage: !addOns.rawFootage })
                  }
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    addOns.rawFootage
                      ? 'border-indigo-500 bg-indigo-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-5 w-5 rounded border flex items-center justify-center text-xs ${
                      addOns.rawFootage ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-500'
                    }`}>
                      {addOns.rawFootage && '✓'}
                    </span>
                    <div className="text-right">
                      <div className="text-xs font-bold text-white">
                        ملفات التعديل الخام (Raw Footage)
                      </div>
                      <div className="text-[11px] text-slate-400">
                        جميع اللقطات والمشاهد المسجلة كاملة بدون قص أو تعديل
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-300 tabular-nums shrink-0">
                    +{formatPrice(pricing.rawFootageUsd)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ESCROW CHECKOUT & PAYMENT */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white mb-1">
                  المراجعة النهائية ونظام الضمان المالي (Escrow Protection)
                </h4>
                <p className="text-xs text-slate-400">
                  أموالك لن تخرج من حساب المنصة حتى توافق على الفيديو بنفسك
                </p>
              </div>

              {/* Escrow Banner */}
              <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 flex items-start gap-3">
                <ShieldCheck className="h-6 w-6 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-indigo-200">
                  <strong className="text-white block mb-1">
                    حماية كاملة للطرفين بنظام الضمان المالي:
                  </strong>
                  عند إتمام الدفع، يتم تجميد المبلغ في حساب وسيط آمن. يصور المبدع الفيديو ويرفعه بعلامة مائية للمعاينة. إذا أعجبك واعتمدته، يتم فك تجميد المبلغ فوراً للمبدع وإرسال الفيديو الأصلي لك بدقة 4K.
                </div>
              </div>

              {/* Order Breakdown */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-mono tabular-nums text-white">{formatPrice(baseUsd)}</span>
                  <span>الإنتاج الأساسي ({productionType === 'ai' ? 'ذكاء اصطناعي' : 'صانع محتوى بشري'})</span>
                </div>

                {ratiosCostUsd > 0 && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-mono tabular-nums text-white">{formatPrice(ratiosCostUsd)}</span>
                    <span>المقاسات الإضافية</span>
                  </div>
                )}

                {commercialRightsUsd > 0 && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-mono tabular-nums text-white">{formatPrice(commercialRightsUsd)}</span>
                    <span>حقوق الاستخدام التجاري الكامل</span>
                  </div>
                )}

                {express24hUsd > 0 && (
                  <div className="flex items-center justify-between text-amber-300">
                    <span className="font-mono tabular-nums">{formatPrice(express24hUsd)}</span>
                    <span>تسليم فائق السرعة خلال 24 ساعة</span>
                  </div>
                )}

                {rawFootageUsd > 0 && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-mono tabular-nums text-white">{formatPrice(rawFootageUsd)}</span>
                    <span>الملفات والمشاهد الخام</span>
                  </div>
                )}

                <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
                  <div className="text-left font-mono">
                    <span className="text-2xl font-black text-white tabular-nums">
                      {formatPrice(totalUsd)}
                    </span>
                    {currency === 'USD' && (
                      <div className="text-[11px] text-slate-400">
                        (~ {totalEgp.toLocaleString()} ج.م)
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-bold text-white">المبلغ المطلوب تجميده في الضمان:</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  اختر طريقة سداد مبلغ الضمان:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'border-indigo-500 bg-indigo-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400'
                    }`}
                  >
                    <CreditCard className="h-5 w-5 mx-auto mb-1 text-indigo-400" />
                    <span className="text-xs font-bold">بطاقة بنكية (Visa/Mastercard)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('instapay')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'instapay'
                        ? 'border-indigo-500 bg-indigo-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400'
                    }`}
                  >
                    <Smartphone className="h-5 w-5 mx-auto mb-1 text-amber-400" />
                    <span className="text-xs font-bold">InstaPay (إنستاباي)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vodafone')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'vodafone'
                        ? 'border-indigo-500 bg-indigo-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400'
                    }`}
                  >
                    <Smartphone className="h-5 w-5 mx-auto mb-1 text-red-400" />
                    <span className="text-xs font-bold">Vodafone Cash (محفظة)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#161a33] flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
                <span>السابق</span>
              </button>
            )}
          </div>

          <div>
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md active:scale-95"
              >
                <span>متابعة الخطوة التالية</span>
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalOrderSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-slate-950 text-xs font-extrabold transition-all shadow-xl shadow-orange-500/25 active:scale-95 cursor-pointer"
              >
                <Lock className="h-4 w-4" />
                <span>
                  {isSubmitting ? 'جاري تجميد المبلغ وإنشاء الطلب...' : 'تأكيد الدفع وحجز الضمان (Escrow)'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
