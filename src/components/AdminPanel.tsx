import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlatformPricing } from '../types';
import {
  ShieldAlert,
  DollarSign,
  Scale,
  UserCheck,
  Cpu,
  Save,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    pricing,
    updatePricing,
    formatPrice,
    disputes,
    resolveDispute,
    applicants,
    approveApplicant,
    rejectApplicant,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pricing' | 'disputes' | 'creators' | 'ai_monitor'>('pricing');

  // Pricing Form State
  const [formPricing, setFormPricing] = useState<PlatformPricing>(pricing);
  const [pricingSavedToast, setPricingSavedToast] = useState(false);

  // AI Monitor simulated prompt testing
  const [testPrompt, setTestPrompt] = useState('شاب رياضي يمسك بعبوة شيكر بروتين ويمدح سهولة الخلط وعدم التكتل');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiTestResult, setAiTestResult] = useState<string | null>(null);

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricing(formPricing);
    setPricingSavedToast(true);
    setTimeout(() => setPricingSavedToast(false), 2500);
  };

  const handleTestAiGeneration = () => {
    setIsAiGenerating(true);
    setAiTestResult(null);
    setTimeout(() => {
      setIsAiGenerating(false);
      setAiTestResult('تم التحقق من النموذج العصبي بنجاح! تم إنشاء سيناريو ومسار رندر 4K خلال 1.4 ثانية (Node-03 Ready).');
    }, 1500);
  };

  return (
    <div className="py-10 mx-auto max-w-7xl px-4 sm:px-6 text-right">
      {/* Top Banner */}
      <div className="mb-8 pb-6 border-b border-white/10">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-red-400 mb-1">
          <ShieldAlert className="h-4 w-4" />
          <span>مركز التحكم والعمليات المركزي · Creovo Operations Control</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          لوحة الإدارة المركزية وحوكمة المنصة
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          تحكم في أسعار المنصة، وفض النزاعات المالية، واعتماد صناع المحتوى الجدد، ومراقبة خوادم الذكاء الاصطناعي.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('pricing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'pricing'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          <DollarSign className="h-4 w-4" />
          <span>إدارة الأسعار الافتراضية والنسب</span>
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'disputes'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          <Scale className="h-4 w-4" />
          <span>نظام حل النزاعات والـ Escrow ({disputes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('creators')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'creators'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>مراجعة المبدعين الجدد ({applicants.filter((a) => a.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_monitor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'ai_monitor'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>مراقبة خوادم الذكاء الاصطناعي (AI Nodes)</span>
        </button>
      </div>

      {/* TAB 1: PRICING MANAGER */}
      {activeTab === 'pricing' && (
        <div className="max-w-3xl rounded-2xl bg-[#14172c] border border-white/10 p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white">تعديل الأسعار والعمولات الديناميكية</h3>
              <p className="text-xs text-slate-400 mt-1">
                تحديث هذه الأرقام ينعكس فوراً ولحظياً على حاسبة التكلفة السريعة ومعالج طلبات العملاء.
              </p>
            </div>
            {pricingSavedToast && (
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                <Check className="h-3.5 w-3.5" />
                <span>تم حفظ وتطبيق الأسعار بنجاح!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSavePricing} className="space-y-5 text-xs">
            {/* Base Prices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  السعر الافتراضي لفيديو الذكاء الاصطناعي ($):
                </label>
                <input
                  type="number"
                  value={formPricing.aiBaseUsd}
                  onChange={(e) => setFormPricing({ ...formPricing, aiBaseUsd: Number(e.target.value) })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  السعر الافتراضي لصانع المحتوى البشري ($):
                </label>
                <input
                  type="number"
                  value={formPricing.humanUgcBaseUsd}
                  onChange={(e) => setFormPricing({ ...formPricing, humanUgcBaseUsd: Number(e.target.value) })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Add-ons Matrix Prices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  إضافة مقاس أفقي 16:9 ($):
                </label>
                <input
                  type="number"
                  value={formPricing.ratio16_9Usd}
                  onChange={(e) => setFormPricing({ ...formPricing, ratio16_9Usd: Number(e.target.value) })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  إضافة مقاس مربع 1:1 ($):
                </label>
                <input
                  type="number"
                  value={formPricing.ratio1_1Usd}
                  onChange={(e) => setFormPricing({ ...formPricing, ratio1_1Usd: Number(e.target.value) })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  حقوق الاستخدام التجاري Ad Rights ($):
                </label>
                <input
                  type="number"
                  value={formPricing.commercialRightsUsd}
                  onChange={(e) => setFormPricing({ ...formPricing, commercialRightsUsd: Number(e.target.value) })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  تسليم سريع خلال 24 ساعة ($):
                </label>
                <input
                  type="number"
                  value={formPricing.express24hUsd}
                  onChange={(e) => setFormPricing({ ...formPricing, express24hUsd: Number(e.target.value) })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  الملفات الخام Raw Footage ($):
                </label>
                <input
                  type="number"
                  value={formPricing.rawFootageUsd}
                  onChange={(e) => setFormPricing({ ...formPricing, rawFootageUsd: Number(e.target.value) })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  سعر تحويل الدولار للجنيه المصري (EGP):
                </label>
                <input
                  type="number"
                  value={formPricing.egpExchangeRate}
                  onChange={(e) => setFormPricing({ ...formPricing, egpExchangeRate: Number(e.target.value) })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs shadow-md hover:brightness-110 active:scale-95 cursor-pointer mt-4"
            >
              <Save className="h-4 w-4" />
              <span>حفظ التعديلات وتحديث المنصة</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: DISPUTE MANAGEMENT */}
      {activeTab === 'disputes' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-[#14172c] border border-white/10 p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-2">
              نظام الوساطة والتحكيم في النزاعات المالية (Dispute Management)
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              في حال عدم التوصل لاتفاق بين العميل والمبدع، تتدخل المنصة بالاطلاع على الـ Brief والفيديو للفصل وإصدار القرار.
            </p>

            {disputes.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                لا توجد نزاعات مفتوحة حالياً. جميع المعاملات تسير بسلاسة.
              </p>
            ) : (
              <div className="space-y-4">
                {disputes.map((disp) => (
                  <div
                    key={disp.id}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{disp.orderNumber}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {disp.status === 'investigating' ? 'قيد التحقيق من الإدارة' : 'تم الفصل'}
                        </span>
                      </div>
                      <span className="text-slate-400">{disp.date}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-xl bg-black/40 border border-white/10">
                      <div>
                        <span className="text-slate-400">العميل المشتكي: </span>
                        <strong className="text-white">{disp.clientName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">صانع المحتوى المدعى عليه: </span>
                        <strong className="text-white">{disp.creatorName}</strong>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-400">موضوع الخلاف: </span>
                        <span className="text-red-300 font-semibold">{disp.reason}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-400">مستندات التحقيق: </span>
                        <span className="text-slate-300">{disp.evidence}</span>
                      </div>
                    </div>

                    {disp.status === 'investigating' && (
                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          onClick={() => resolveDispute(disp.id, 'refund')}
                          className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-500 text-white font-bold text-xs transition-colors"
                        >
                          رد المبلغ كاملاً للعميل (Refund)
                        </button>
                        <button
                          onClick={() => resolveDispute(disp.id, 'release')}
                          className="px-4 py-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                        >
                          تحويل المبلغ لصانع المحتوى (Release)
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: REVIEW NEW CREATORS */}
      {activeTab === 'creators' && (
        <div className="rounded-2xl bg-[#14172c] border border-white/10 p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white mb-2">طلبات انضمام المبدعين الجدد للمنصة</h3>
          <p className="text-xs text-slate-400 mb-6">
            مراجعة جودة التصوير، المعدات، واللهجة قبل إتاحة المبدع في المعرض العام للعملاء.
          </p>

          <div className="space-y-4">
            {applicants.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{app.fullName}</h4>
                    <span className="text-slate-400">{app.email} · {app.country}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    app.status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : app.status === 'rejected'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {app.status === 'approved' ? 'معتمد وموثق' : app.status === 'rejected' ? 'مرفوض' : 'بانتظار المراجعة'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-black/40">
                  <div>
                    <span className="text-slate-400">التخصص: </span>
                    <strong className="text-white">{app.category}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">اللهجة: </span>
                    <strong className="text-white">{app.dialect}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">المعدات: </span>
                    <span className="text-slate-200">{app.equipment}</span>
                  </div>
                </div>

                {app.status === 'pending' && (
                  <div className="flex items-center justify-end gap-3 pt-1">
                    <button
                      onClick={() => rejectApplicant(app.id)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-bold text-xs"
                    >
                      رفض الطلب
                    </button>
                    <button
                      onClick={() => approveApplicant(app.id)}
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                    >
                      قبول وإضافة شارة "موثّق"
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AI GENERATOR MONITOR */}
      {activeTab === 'ai_monitor' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#14172c] border border-white/10">
              <span className="text-xs text-slate-400">سرعة الاستجابة</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">1.2 ثانية</div>
            </div>
            <div className="p-4 rounded-xl bg-[#14172c] border border-white/10">
              <span className="text-xs text-slate-400">نسبة النجاح التشغيلي</span>
              <div className="text-xl font-bold font-mono text-white mt-1">99.8%</div>
            </div>
            <div className="p-4 rounded-xl bg-[#14172c] border border-white/10">
              <span className="text-xs text-slate-400">الرصيد المتبقي للعمليات</span>
              <div className="text-xl font-bold font-mono text-indigo-400 mt-1">4,820 عملية</div>
            </div>
            <div className="p-4 rounded-xl bg-[#14172c] border border-white/10">
              <span className="text-xs text-slate-400">العقد السحابية النشطة</span>
              <div className="text-xl font-bold font-mono text-amber-400 mt-1">6 خوادم GPU</div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#14172c] border border-white/10 p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-2">
              اختبار مباشر لمولد الفيديوهات بالذكاء الاصطناعي (AI Prompt Tester)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              يمكنك تجربة إرسال Prompt واختبار زمن استجابة محرك Creovo Neural Pipeline.
            </p>

            <div className="space-y-3 text-xs">
              <textarea
                rows={3}
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white focus:border-indigo-500 focus:outline-none"
              />

              <button
                onClick={handleTestAiGeneration}
                disabled={isAiGenerating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs"
              >
                <Sparkles className={`h-4 w-4 ${isAiGenerating ? 'animate-spin' : ''}`} />
                <span>{isAiGenerating ? 'جاري فحص وتوليد الرندر...' : 'تشغيل الاختبار السريع'}</span>
              </button>

              {aiTestResult && (
                <div className="mt-3 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                  {aiTestResult}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
