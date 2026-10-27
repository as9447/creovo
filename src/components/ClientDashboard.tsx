import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import {
  Package,
  Film,
  Heart,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
  Download,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';

export const ClientDashboard: React.FC = () => {
  const {
    orders,
    formatPrice,
    requestRevision,
    approveAndReleaseEscrow,
    openReelModal,
    favorites,
    creators,
    openOrderWizard,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'library' | 'favorites'>('orders');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [revisionModalOrder, setRevisionModalOrder] = useState<Order | null>(null);
  const [revisionNotes, setRevisionNotes] = useState('');

  // Status mapping
  const statusLabels: Record<OrderStatus, { label: string; color: string; border: string }> = {
    escrow_funded: {
      label: 'محجوز في الضمان (Escrow Funded)',
      color: 'text-indigo-400 bg-indigo-500/10',
      border: 'border-indigo-500/30',
    },
    awaiting_shipping: {
      label: 'بانتظار شحن المنتج',
      color: 'text-amber-400 bg-amber-500/10',
      border: 'border-amber-500/30',
    },
    in_production: {
      label: 'جاري التصوير والإنتاج',
      color: 'text-blue-400 bg-blue-500/10',
      border: 'border-blue-500/30',
    },
    in_review: {
      label: 'قيد مراجعة المسودة المائية',
      color: 'text-purple-400 bg-purple-500/10',
      border: 'border-purple-500/30',
    },
    revision_requested: {
      label: 'جاري تنفيذ التعديلات',
      color: 'text-orange-400 bg-orange-500/10',
      border: 'border-orange-500/30',
    },
    completed: {
      label: 'مكتمل ومعتمد (متاح للتحميل)',
      color: 'text-emerald-400 bg-emerald-500/10',
      border: 'border-emerald-500/30',
    },
    disputed: {
      label: 'قيد مراجعة النزاع من الإدارة',
      color: 'text-red-400 bg-red-500/10',
      border: 'border-red-500/30',
    },
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedStatusFilter === 'all') return true;
    return o.status === selectedStatusFilter;
  });

  const completedOrders = orders.filter((o) => o.status === 'completed');
  const favoriteCreators = creators.filter((c) => favorites.includes(c.id));

  const handleOpenRevision = (order: Order) => {
    setRevisionModalOrder(order);
    setRevisionNotes('');
  };

  const handleSubmitRevision = () => {
    if (revisionModalOrder && revisionNotes.trim()) {
      requestRevision(revisionModalOrder.id, revisionNotes.trim());
      setRevisionModalOrder(null);
    }
  };

  return (
    <div className="py-10 mx-auto max-w-7xl px-4 sm:px-6 text-right">
      {/* Top Banner / Welcome */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>لوحة تحكم العميل · حماية المشتري مفعلة 100%</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            متابعة طلباتك ومكتبة الفيديوهات
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            راقب تقدم التصوير، عاين المسودة المائية، واعتمد الفيديو لفك تجميد الضمان وتحميل الجودة العالية.
          </p>
        </div>

        <button
          onClick={() => openOrderWizard()}
          className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-95 shrink-0"
        >
          + طلب فيديو جديد
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'orders'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>طلباتي النشطة ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('library')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'library'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          <Film className="h-4 w-4" />
          <span>مكتبة الفيديوهات المعتمدة ({completedOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'favorites'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          <Heart className="h-4 w-4 text-red-400" />
          <span>المبدعون المفضلون ({favoriteCreators.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: ORDERS TRACKING */}
      {activeSubTab === 'orders' && (
        <div className="space-y-6">
          {/* Status Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs text-slate-400 shrink-0 ml-1">تصفية حسب الحالة:</span>
            {[
              { id: 'all', label: 'الكل' },
              { id: 'in_review', label: 'قيد مراجعة المسودة' },
              { id: 'in_production', label: 'جاري التصوير' },
              { id: 'completed', label: 'مكتمل' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedStatusFilter === f.id
                    ? 'bg-white/20 text-white border border-white/20'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Orders Cards List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 p-6">
              <p className="text-sm text-slate-300">لا توجد طلبات تطابق هذه التصفية حالياً.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusMeta = statusLabels[order.status] || statusLabels.in_production;
                const isReadyForReview = order.status === 'in_review';
                const isCompleted = order.status === 'completed';

                return (
                  <div
                    key={order.id}
                    className="rounded-2xl bg-[#14172c] border border-white/10 p-5 sm:p-6 shadow-xl transition-all"
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono text-sm font-bold text-white">
                            {order.orderNumber}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusMeta.border} ${statusMeta.color}`}
                          >
                            {statusMeta.label}
                          </span>
                          <span className="text-xs text-slate-400">
                            أنشئ {order.createdAt}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white">
                          {order.productName}
                        </h3>
                      </div>

                      {/* Financial Escrow Notice */}
                      <div className="flex items-center gap-3">
                        <div className="text-left font-mono">
                          <div className="text-xs text-slate-400">المبلغ في الضمان:</div>
                          <div className="text-sm font-extrabold text-amber-300 tabular-nums">
                            {formatPrice(order.pricing.totalUsd)}
                          </div>
                        </div>

                        {order.escrowStatus === 'held' ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                            <ShieldCheck className="h-4 w-4" />
                            <span>مبلغ الضمان مجمد بأمان</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>تم صرف الضمان بعد موافقتك</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Middle: Brief summary & Creator info */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-4 items-center">
                      {/* Video Thumbnail Preview with Watermark Indicator */}
                      <div className="md:col-span-3">
                        <div
                          onClick={() => {
                            const creator = creators.find((c) => c.id === order.creatorId) || creators[0];
                            openReelModal(creator, order.watermarkedVideoUrl, !isCompleted, order.id);
                          }}
                          className="relative aspect-[9/16] max-h-48 rounded-xl overflow-hidden bg-black/60 border border-white/20 cursor-pointer group shadow-md mx-auto sm:mx-0"
                        >
                          <img
                            src={order.videoThumbnail}
                            alt=""
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                          {!isCompleted && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2 text-center pointer-events-none">
                              <span className="text-[10px] font-mono font-bold text-amber-300 bg-black/70 px-2 py-1 rounded border border-amber-500/30">
                                مسودة مائية (Draft)
                              </span>
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-bold text-white bg-black/70 py-1 rounded">
                            اضغط للمعاينة
                          </div>
                        </div>
                      </div>

                      {/* Brief Details */}
                      <div className="md:col-span-6 space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">صانع المحتوى المعين:</span>
                          <div className="flex items-center gap-1.5 font-bold text-white">
                            <img
                              src={order.creatorAvatar}
                              alt=""
                              className="h-5 w-5 rounded-full object-cover"
                            />
                            <span>{order.creatorName}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-slate-400">النقاط الواجب ذكرها:</span>
                          <ul className="list-disc list-inside text-slate-200 mt-1 space-y-0.5">
                            {order.keyPoints.slice(0, 2).map((k, i) => (
                              <li key={i}>{k}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center gap-4 text-slate-400 pt-1">
                          <span>نبرة الصوت: <strong className="text-white">{order.toneOfVoice}</strong></span>
                          <span>المقاسات: <strong className="text-white">{order.addOns.aspectRatios.join(', ')}</strong></span>
                        </div>
                      </div>

                      {/* Action Decision Area */}
                      <div className="md:col-span-3 flex flex-col gap-2.5">
                        {isReadyForReview ? (
                          <>
                            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs">
                              المسودة المائية جاهزة لمراجعتك الآن!
                            </div>

                            <button
                              onClick={() => approveAndReleaseEscrow(order.id)}
                              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span>موافقة وإلغاء العلامة المائية</span>
                            </button>

                            <button
                              onClick={() => handleOpenRevision(order)}
                              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs py-2 transition-all"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              <span>طلب تعديل مجاني (1 متبقي)</span>
                            </button>
                          </>
                        ) : isCompleted ? (
                          <div className="space-y-2">
                            <button
                              onClick={() => {
                                const creator = creators.find((c) => c.id === order.creatorId) || creators[0];
                                openReelModal(creator, order.cleanVideoUrl || order.watermarkedVideoUrl, false, order.id);
                              }}
                              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 shadow-md transition-all"
                            >
                              <Eye className="h-4 w-4" />
                              <span>مشاهدة النسخة الأصلية 4K</span>
                            </button>

                            <a
                              href={order.cleanVideoUrl || order.watermarkedVideoUrl}
                              download
                              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs py-2 transition-all"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>تحميل الفيديو كامل الجودة</span>
                            </a>
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1">
                            <div className="font-bold text-white flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-indigo-400" />
                              <span>جاري إعداد المسودة</span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              سيتم إشعارك فور قيام المبدع برفع الفيديو المائي للمعاينة.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: MEDIA LIBRARY */}
      {activeSubTab === 'library' && (
        <div>
          {completedOrders.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10 p-8">
              <Film className="h-10 w-10 text-slate-500 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white mb-1">
                مكتبة الفيديوهات فارغة حالياً
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                بمجرد اعتمادك لأي مسودة فيديو، ستظهر هنا بروابط تحميل فورية وملفات خام.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="rounded-2xl bg-[#14172c] border border-white/10 overflow-hidden shadow-xl"
                >
                  <div className="relative aspect-video bg-black">
                    <img
                      src={ord.videoThumbnail}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                      معتمد 4K
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {ord.orderNumber}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        {ord.productName}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/10">
                      <span>صانع المحتوى: {ord.creatorName}</span>
                      <span className="font-mono text-indigo-300">
                        {ord.addOns.aspectRatios.join(', ')}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <a
                        href={ord.cleanVideoUrl || ord.watermarkedVideoUrl}
                        download
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>تحميل MP4</span>
                      </a>

                      <button
                        onClick={() => {
                          const creator = creators.find((c) => c.id === ord.creatorId) || creators[0];
                          openReelModal(creator, ord.cleanVideoUrl || ord.watermarkedVideoUrl, false, ord.id);
                        }}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
                      >
                        معاينة
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: FAVORITES */}
      {activeSubTab === 'favorites' && (
        <div>
          {favoriteCreators.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10 p-8">
              <Heart className="h-10 w-10 text-slate-500 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white mb-1">
                لم تقم بحفظ أي مبدع في المفضلة بعد
              </h4>
              <p className="text-xs text-slate-400">
                اضغط على أيقونة القلب في معرض المبدعين لحفظ من تفضلهم هنا لطلب الفيديوهات منهم بضغطة زر.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteCreators.map((creator) => (
                <div
                  key={creator.id}
                  className="rounded-2xl bg-[#14172c] border border-white/10 p-5 shadow-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={creator.avatar}
                      alt=""
                      className="h-12 w-12 rounded-xl object-cover border border-white/20"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{creator.name}</h4>
                      <p className="text-xs text-slate-400">{creator.categoryLabel}</p>
                      <div className="text-xs font-mono font-bold text-orange-400 mt-1">
                        يبدأ من {formatPrice(creator.startingPriceUsd)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openOrderWizard(creator)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
                  >
                    طلب جديد
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Revision Request Modal */}
      {revisionModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#14172c] border border-white/15 p-6 shadow-2xl text-right">
            <h3 className="text-base font-bold text-white mb-2">
              طلب تعديل مجاني (Revision) لطلب: {revisionModalOrder.orderNumber}
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              وفقاً لشروط المنصة، يحق لك طلب تعديل مجاني واحد وفقاً للـ Brief المتفق عليه مسبقاً.
            </p>

            <textarea
              rows={4}
              placeholder="اكتب ملاحظات التعديل بالتفصيل (مثال: نبرة الصوت في أول 3 ثوانٍ، أو إبراز طريقة فتح العبوة بشكل أوضح)..."
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none mb-4"
            />

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setRevisionModalOrder(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSubmitRevision}
                disabled={!revisionNotes.trim()}
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-slate-950 font-bold text-xs"
              >
                إرسال ملاحظات التعديل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
