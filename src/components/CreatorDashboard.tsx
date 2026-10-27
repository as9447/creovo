import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Upload,
  Camera,
  Sliders,
  DollarSign,
  Smartphone,
  Building,
  Check,
  AlertCircle,
  Eye,
  FileText,
} from 'lucide-react';

export const CreatorDashboard: React.FC = () => {
  const {
    orders,
    formatPrice,
    currency,
    creatorWallet,
    requestPayout,
    creatorAvailability,
    toggleCreatorAvailability,
    uploadCreatorDraft,
    openReelModal,
    creators,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'wallet' | 'studio'>('orders');
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(creatorWallet.balanceAvailableUsd);
  const [payoutMethod, setPayoutMethod] = useState<'instapay' | 'vodafone_cash' | 'bank'>('instapay');
  const [accountDetails, setAccountDetails] = useState('01019823491');
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState('');

  // Draft upload simulation state
  const [uploadModalOrder, setUploadModalOrder] = useState<string | null>(null);
  const [selectedDraftPreset, setSelectedDraftPreset] = useState<string>(
    '/src/assets/images/ugc_reel_tech_gadget_1793114432646.jpg'
  );

  // Equipment state
  const [equipmentState, setEquipmentState] = useState({
    camera: 'iPhone 15 Pro Max (4K 60fps ProRes)',
    lighting: 'Aputure Amaran 100d + Lantern Softbox',
    mic: 'Rode Wireless GO II Dual',
    software: 'DaVinci Resolve & CapCut Pro',
  });
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  // Relevant creator orders (assigned to human creators)
  const incomingOrders = orders.filter((o) => o.productionType === 'human_ugc');

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = requestPayout(payoutAmount, payoutMethod, accountDetails);
    if (success) {
      setPayoutSuccessMsg('تم تقديم طلب السحب بنجاح! سيتم التحويل خلال 15 دقيقة.');
      setTimeout(() => {
        setIsPayoutModalOpen(false);
        setPayoutSuccessMsg('');
      }, 2000);
    }
  };

  const handleUploadDraftSubmit = () => {
    if (uploadModalOrder) {
      uploadCreatorDraft(uploadModalOrder, selectedDraftPreset);
      setUploadModalOrder(null);
    }
  };

  const handleSaveEquipment = () => {
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 2500);
  };

  return (
    <div className="py-10 mx-auto max-w-7xl px-4 sm:px-6 text-right">
      {/* Top Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 mb-1">
            <span>لوحة تحكم صانع المحتوى · Creator Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            إدارة طلبات التصوير والمحفظة المالية
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            استلم طلبات الـ Brief، ارفع مسودة الفيديو المائي، واسحب مستحقاتك فور اعتماد العميل.
          </p>
        </div>

        {/* Availability Switch */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
          <span className="text-xs text-slate-300">
            حالة الاستقبال: {creatorAvailability ? (
              <strong className="text-emerald-400">متاح لطلبات جديدة</strong>
            ) : (
              <strong className="text-amber-400">مشغول مؤقتاً</strong>
            )}
          </span>
          <button
            onClick={toggleCreatorAvailability}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
              creatorAvailability ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                creatorAvailability ? '-translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* KPI Wallet Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* Available Balance */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-900/40 to-[#14172c] border border-indigo-500/30 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-300">الرصيد المتاح للسحب الفوري</span>
            <Wallet className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums mb-3">
            {formatPrice(creatorWallet.balanceAvailableUsd)}
          </div>
          <button
            onClick={() => {
              setPayoutAmount(creatorWallet.balanceAvailableUsd);
              setIsPayoutModalOpen(true);
            }}
            disabled={creatorWallet.balanceAvailableUsd <= 0}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>طلب سحب أرباح (InstaPay / فودافون كاش)</span>
          </button>
        </div>

        {/* Escrow Pending Balance */}
        <div className="rounded-2xl bg-[#14172c] border border-white/10 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-300">رصيد معلق في الضمان (Escrow)</span>
            <Clock className="h-5 w-5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums mb-1">
            {formatPrice(creatorWallet.balanceHeldUsd)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            يُصرف تلقائياً لمحفظتك بمجرد موافقة العميل على مسودة الفيديو.
          </p>
        </div>

        {/* Total Earned */}
        <div className="rounded-2xl bg-[#14172c] border border-white/10 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-300">إجمالي الأرباح المحققة</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums mb-1">
            {formatPrice(creatorWallet.totalEarnedUsd)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            عبر 18 طلباً تم تسليمها واعتمادها بنجاح منذ انضمامك.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          <span>صندوق الطلبات والإنتاج ({incomingOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'wallet'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          <span>سجل المحفظة والسحوبات</span>
        </button>

        <button
          onClick={() => setActiveTab('studio')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'studio'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          <span>إدارة الاستوديو والمعدات</span>
        </button>
      </div>

      {/* TAB 1: ORDERS & PRODUCTION */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {incomingOrders.map((ord) => {
            const isNeedUpload = ord.status === 'in_production' || ord.status === 'revision_requested';

            return (
              <div
                key={ord.id}
                className="rounded-2xl bg-[#14172c] border border-white/10 p-5 sm:p-6 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-bold text-white">{ord.orderNumber}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                        العميل: {ord.clientName}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{ord.productName}</h3>
                  </div>

                  <div className="text-left font-mono">
                    <span className="text-xs text-slate-400">مستحقاتك المحجوزة بالضمان: </span>
                    <strong className="text-base font-bold text-emerald-400 tabular-nums">
                      {formatPrice(ord.pricing.totalUsd)}
                    </strong>
                  </div>
                </div>

                {/* Brief Body */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-4 items-center">
                  <div className="md:col-span-8 space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold">النقاط الواجب ذكرها في التصوير (Key Points):</span>
                      <ul className="list-disc list-inside text-slate-200 mt-1 space-y-0.5">
                        {ord.keyPoints.map((k, idx) => (
                          <li key={idx}>{k}</li>
                        ))}
                      </ul>
                    </div>

                    {ord.forbiddenPoints.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/20 text-red-300">
                        <strong>الممنوعات (Don'ts): </strong>
                        {ord.forbiddenPoints.join(' · ')}
                      </div>
                    )}

                    {ord.revisionNotes && (
                      <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300">
                        <strong>ملاحظات العميل للتعديل: </strong>
                        {ord.revisionNotes}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-slate-400 pt-1">
                      <span>نبرة الصوت: <strong className="text-white">{ord.toneOfVoice}</strong></span>
                      <span>المقاسات: <strong className="text-white">{ord.addOns.aspectRatios.join(', ')}</strong></span>
                      {ord.addOns.express24h && (
                        <span className="text-amber-400 font-bold">⚡ تسليم سريع 24 ساعة</span>
                      )}
                    </div>
                  </div>

                  {/* Creator Action Area */}
                  <div className="md:col-span-4 flex flex-col gap-2.5">
                    {isNeedUpload ? (
                      <button
                        onClick={() => setUploadModalOrder(ord.id)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-bold text-xs py-3 shadow-lg shadow-orange-500/20 transition-all active:scale-95 cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                        <span>رفع مسودة الفيديو المائي للمراجعة</span>
                      </button>
                    ) : ord.status === 'in_review' ? (
                      <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-center">
                        <div className="text-xs font-bold text-purple-200">
                          بانتظار مراجعة العميل للمسودة المائية
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          يتم إشعارك فور الموافقة أو طلب أي تعديل
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center">
                        <div className="text-xs font-bold text-emerald-300">
                          تمت الموافقة وصرف المستحقات لمحفظتك!
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        const creator = creators[0];
                        openReelModal(creator, ord.watermarkedVideoUrl, ord.status !== 'completed', ord.id);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs py-2 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>معاينة المسودة الحالية</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: WALLET & PAYOUT LEDGER */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-[#14172c] border border-white/10 p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4">
              سجل التحويلات والسحوبات السابقة
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="pb-3 font-semibold">رقم العملية</th>
                    <th className="pb-3 font-semibold">المبلغ ($)</th>
                    <th className="pb-3 font-semibold">المبلغ المعادل (ج.م)</th>
                    <th className="pb-3 font-semibold">طريقة التحويل</th>
                    <th className="pb-3 font-semibold">التاريخ</th>
                    <th className="pb-3 font-semibold">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {creatorWallet.payoutHistory.map((p) => (
                    <tr key={p.id} className="text-slate-200">
                      <td className="py-3 font-bold text-white">{p.id}</td>
                      <td className="py-3 font-bold text-emerald-400 tabular-nums">
                        +${p.amountUsd}
                      </td>
                      <td className="py-3 tabular-nums text-slate-300">
                        {p.amountEgp.toLocaleString()} ج.م
                      </td>
                      <td className="py-3 font-sans">{p.methodLabel}</td>
                      <td className="py-3 text-slate-400">{p.date}</td>
                      <td className="py-3 font-sans">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {p.status === 'completed' ? 'تم التحويل بنجاح' : 'جاري المعالجة'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STUDIO & EQUIPMENT SETTINGS */}
      {activeTab === 'studio' && (
        <div className="rounded-2xl bg-[#14172c] border border-white/10 p-6 sm:p-8 shadow-xl max-w-3xl">
          <h3 className="text-base font-bold text-white mb-2">إدارة الاستوديو ومعدات التصوير</h3>
          <p className="text-xs text-slate-400 mb-6">
            بيانات معداتك تظهر للعملاء في بطاقتك وتزيد من فرص اختيارك لتصوير المنتجات ذات القيمة العالية.
          </p>

          {savedSettingsSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>تم حفظ بيانات الاستوديو والمعدات بنجاح!</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">نوع الكاميرا / الهاتف:</label>
              <input
                type="text"
                value={equipmentState.camera}
                onChange={(e) => setEquipmentState({ ...equipmentState, camera: e.target.value })}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">معدات الإضاءة:</label>
              <input
                type="text"
                value={equipmentState.lighting}
                onChange={(e) => setEquipmentState({ ...equipmentState, lighting: e.target.value })}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">المايكروفون وجودة الصوت:</label>
              <input
                type="text"
                value={equipmentState.mic}
                onChange={(e) => setEquipmentState({ ...equipmentState, mic: e.target.value })}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">برامج المونتاج المستخدمة:</label>
              <input
                type="text"
                value={equipmentState.software}
                onChange={(e) => setEquipmentState({ ...equipmentState, software: e.target.value })}
                className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleSaveEquipment}
              className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              حفظ التحديثات
            </button>
          </div>
        </div>
      )}

      {/* Upload Watermarked Draft Modal */}
      {uploadModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#14172c] border border-white/15 p-6 shadow-2xl text-right">
            <h3 className="text-base font-bold text-white mb-2">
              رفع مسودة الفيديو المائي (Watermarked Draft)
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              تقوم المنصة بإضافة علامة مائية تلقائية على نسختك لمنع تحميلها أو استخدامها من قبل العميل قبل تحرير الضمان المالي.
            </p>

            <div className="space-y-3 mb-6">
              <label className="block text-xs font-bold text-slate-300">
                اختر الفيديو الجاهز من نماذج التصوير أو ارفع ملف جديد:
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDraftPreset('/src/assets/images/ugc_reel_tech_gadget_1793114432646.jpg')}
                  className={`p-2.5 rounded-xl border text-right text-xs ${
                    selectedDraftPreset === '/src/assets/images/ugc_reel_tech_gadget_1793114432646.jpg'
                      ? 'border-indigo-500 bg-indigo-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-slate-400'
                  }`}
                >
                  نموذج تقني / إلكترونيات (4K)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDraftPreset('/src/assets/images/ugc_reel_skincare_1793114432299.jpg')}
                  className={`p-2.5 rounded-xl border text-right text-xs ${
                    selectedDraftPreset === '/src/assets/images/ugc_reel_skincare_1793114432299.jpg'
                      ? 'border-indigo-500 bg-indigo-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-slate-400'
                  }`}
                >
                  نموذج عناية وتجميل (4K)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setUploadModalOrder(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleUploadDraftSubmit}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs shadow-md"
              >
                تأكيد الرفع وإشعار العميل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payout Request Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-[#14172c] border border-white/15 p-6 shadow-2xl text-right">
            <h3 className="text-base font-bold text-white mb-2">
              سحب الأرباح الفوري للمبدع
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              الرصيد المتاح للسحب: <strong className="text-emerald-400 font-mono">${creatorWallet.balanceAvailableUsd}</strong>
            </p>

            {payoutSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
                {payoutSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handlePayoutSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">المبلغ المطلوب سحبه ($):</label>
                  <input
                    type="number"
                    min="10"
                    max={creatorWallet.balanceAvailableUsd}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(Number(e.target.value))}
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-2.5 text-white font-mono focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">طريقة استلام الأرباح:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'instapay', label: 'InstaPay' },
                      { id: 'vodafone_cash', label: 'Vodafone Cash' },
                      { id: 'bank', label: 'تحويل بنكي' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPayoutMethod(m.id as any)}
                        className={`py-2 px-2 rounded-xl border text-center font-bold text-xs ${
                          payoutMethod === m.id
                            ? 'border-indigo-500 bg-indigo-500/20 text-white'
                            : 'border-white/10 bg-white/5 text-slate-400'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">
                    {payoutMethod === 'instapay'
                      ? 'عنوان الدفع اللحظي (IPA) أو الهاتف:'
                      : payoutMethod === 'vodafone_cash'
                      ? 'رقم محفظة فودافون كاش (010xxxxxxxx):'
                      : 'رقم الحساب الدولي (IBAN):'}
                  </label>
                  <input
                    type="text"
                    value={accountDetails}
                    onChange={(e) => setAccountDetails(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-2.5 text-white font-mono text-left focus:border-indigo-500 focus:outline-none"
                    required
                    dir="ltr"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPayoutModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
                  >
                    تأكيد طلب التحويل
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
