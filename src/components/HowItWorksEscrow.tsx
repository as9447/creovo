import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Lock,
  Camera,
  Eye,
  CheckCircle,
  FileCheck,
  User,
  Video,
  ArrowDown,
  Sparkles,
} from 'lucide-react';

export const HowItWorksEscrow: React.FC = () => {
  const { openOrderWizard } = useApp();
  const [activeAudience, setActiveAudience] = useState<'client' | 'creator'>('client');
  const [showWatermarkDemo, setShowWatermarkDemo] = useState(true);

  const clientSteps = [
    {
      num: '01',
      title: 'حدد تفاصيل البريف والمواصفات',
      desc: 'اكتب اسم منتجك، النقاط الواجب ذكرها، والممنوعات، ونبرة الصوت المطلوبة في نموذج ذكي خلال 3 دقائق.',
    },
    {
      num: '02',
      title: 'ادفع بأمان عبر حساب الضمان (Escrow)',
      desc: 'يتم تجميد قيمة الطلب في حساب المنصة ولا يستلم المبدع أي مبالغ حتى يعتمد العميل الفيديو بالكامل.',
    },
    {
      num: '03',
      title: 'راجع المسودة المائية واستلم الفيديو بدقة 4K',
      desc: 'شاهد مسودة الفيديو بعلامة مائية. اطلب تعديلاً إن أردت، وبمجرد موافقتك تزال العلامة المائية وتحصل على الفيديو فوراً.',
    },
  ];

  const creatorSteps = [
    {
      num: '01',
      title: 'استلم طلبات التصوير المؤكدة مالياً',
      desc: 'تصفح البريف ونقاط الحديث. كل طلب يأتيك أمواله محجوزة مسبقاً في حساب الضمان (Escrow Guaranteed).',
    },
    {
      num: '02',
      title: 'صوّر ونفّذ الفيديو باحترافية',
      desc: 'استلم المنتج، صوّر المشاهد بالهاتف أو الكاميرا وفقاً لتعليمات البريف وجهز النسخة المبدئية.',
    },
    {
      num: '03',
      title: 'ارفع المسودة واسحب أرباحك فوراً',
      desc: 'ارفع الفيديو المائي. بمجرد اعتماد العميل، تتحول الأموال لمحفظتك مع إمكانية السحب عبر إنستاباي أو فودافون كاش.',
    },
  ];

  const escrowStages = [
    {
      step: 1,
      title: 'تحديد التفاصيل والدفع',
      desc: 'العميل يملأ البريف ويدفع التكلفة',
      icon: FileCheck,
      color: 'text-indigo-400',
      border: 'border-indigo-500/30',
    },
    {
      step: 2,
      title: 'تجميد المبلغ في Escrow',
      desc: 'المنصة تحفظ المبلغ كطرف ثالث محايد',
      icon: Lock,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
    },
    {
      step: 3,
      title: 'استلام المنتج والتصوير',
      desc: 'المبدع يصور وفق البريف والنقاط المحددة',
      icon: Camera,
      color: 'text-blue-400',
      border: 'border-blue-500/30',
    },
    {
      step: 4,
      title: 'رفع المسودة المائية',
      desc: 'معاينة آمنة للعميل مع علامة مائية للمنصة',
      icon: Eye,
      color: 'text-purple-400',
      border: 'border-purple-500/30',
    },
    {
      step: 5,
      title: 'المراجعة أو طلب تعديل',
      desc: 'العميل يطلب تعديلاً مجانياً أو يوافق مباشرة',
      icon: Sparkles,
      color: 'text-orange-400',
      border: 'border-orange-500/30',
    },
    {
      step: 6,
      title: 'إزالة العلامة + تحويل الأرباح',
      desc: 'تحميل الفيديو بدقة 4K وتحويل الأرباح للمبدع',
      icon: CheckCircle,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
    },
  ];

  return (
    <section id="escrow" className="py-16 bg-[#0b0c16]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-3">
            <ShieldCheck className="h-4 w-4" />
            <span>نظام حماية الطرفين (100% Escrow Protection)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            كيف تعمل منصة Creovo؟
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
            صممنا بيئة عمل تضمن حقوق العميل بنسبة 100% من خلال تجميد المبالغ، وتضمن للمبدع مستحقاته فور إنجاز العمل بالجودة المتفق عليها.
          </p>

          {/* Audience Switcher */}
          <div className="mt-6 inline-flex rounded-xl bg-white/5 p-1 border border-white/10">
            <button
              onClick={() => setActiveAudience('client')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeAudience === 'client'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>3 خطوات للعميل (أصحاب المتاجر والشركات)</span>
            </button>
            <button
              onClick={() => setActiveAudience('creator')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeAudience === 'creator'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="h-3.5 w-3.5" />
              <span>3 خطوات لصانع المحتوى (Creators)</span>
            </button>
          </div>
        </div>

        {/* 3 Simple Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 text-right">
          {(activeAudience === 'client' ? clientSteps : creatorSteps).map((step) => (
            <div
              key={step.num}
              className="relative rounded-2xl bg-[#14172c] border border-white/10 p-6 shadow-lg transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-2xl font-black text-orange-400/90">
                  {step.num}
                </span>
                <div className="h-2 w-2 rounded-full bg-indigo-500" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Escrow Workflow Diagram & Watermark Live Preview Interactive Demo */}
        <div className="rounded-3xl bg-gradient-to-b from-[#14172c] to-[#0f1122] border border-indigo-500/20 p-8 sm:p-10 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-white/10 text-right">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 mb-1">
                <Lock className="h-3.5 w-3.5" />
                <span>دورة أمان الأموال خطوة بخطوة</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                رحلة الطلب ونظام حماية الطرفين (Escrow Workflow)
              </h3>
            </div>
            <p className="text-xs text-slate-300 max-w-md">
              المبلغ لا يصل لصانع المحتوى إلا بضغطة زر موافقة منك. وفي حال وجود أي خلاف، يتدخل فريق الدعم كطرف ثالث لحل النزاع فوراً.
            </p>
          </div>

          {/* 6-Step Visual Cycle Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 text-right mb-12">
            {escrowStages.map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className={`relative rounded-xl bg-white/5 border ${st.border} p-4 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        مرحلة {st.step}
                      </span>
                      <Icon className={`h-4 w-4 ${st.color}`} />
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1.5">{st.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{st.desc}</p>
                  </div>
                  {st.step < 6 && (
                    <div className="hidden lg:block absolute -left-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-600 font-bold">
                      ◀
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Live Watermark Concept Demo */}
          <div className="rounded-2xl bg-black/40 border border-white/10 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="text-right">
                <h4 className="text-sm font-bold text-white">
                  محاكاة تفاعلية: كيف تبدو المسودة المائية للعميل؟
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  شاهد كيف يتم حماية عمل المبدع بالعلامة المائية، وكيف تزال فور موافقة العميل على الفيديو.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setShowWatermarkDemo(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    showWatermarkDemo
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  مسودة مائية (مرحلة المراجعة)
                </button>
                <button
                  onClick={() => setShowWatermarkDemo(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    !showWatermarkDemo
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  نسخة نهائية (بعد الاعتماد)
                </button>
              </div>
            </div>

            {/* Video preview simulation container */}
            <div className="relative mx-auto max-w-sm aspect-[9/16] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-950">
              <img
                src="/src/assets/images/ugc_reel_skincare_1793114432299.jpg"
                alt="Watermark Simulation"
                className="h-full w-full object-cover"
              />

              {/* Watermark Overlay (If Enabled) */}
              {showWatermarkDemo ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden">
                  <div className="transform -rotate-45 space-y-8 opacity-45">
                    <div className="text-lg sm:text-xl font-black tracking-widest text-white/90 font-mono border-2 border-white/60 px-4 py-1.5 rounded-lg bg-black/40">
                      CREOVO · DRAFT WATERMARK
                    </div>
                    <div className="text-lg sm:text-xl font-black tracking-widest text-white/90 font-mono border-2 border-white/60 px-4 py-1.5 rounded-lg bg-black/40">
                      مسودة مراجعة غير مرخصة
                    </div>
                    <div className="text-lg sm:text-xl font-black tracking-widest text-white/90 font-mono border-2 border-white/60 px-4 py-1.5 rounded-lg bg-black/40">
                      CREOVO ESCROW PROTECTED
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-amber-500/90 text-slate-950 px-3 py-2 rounded-xl text-center text-xs font-bold shadow-lg">
                    ⚠️ هذه نسخة مائية للمراجعة — اضغط "الموافقة" لإزالتها وتحميل النسخة الصافية
                  </div>
                </div>
              ) : (
                <div className="absolute bottom-4 left-4 right-4 bg-emerald-500/95 text-slate-950 px-3 py-2 rounded-xl text-center text-xs font-bold shadow-lg flex items-center justify-center gap-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span>تم اعتماد الفيديو! العلامة المائية أزيلت وجاهز للتحميل بدقة 4K</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
