import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, openOrderWizard } = useApp();

  return (
    <footer className="border-t border-white/10 bg-[#080911] text-right text-xs text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 pb-8 border-b border-white/10">
          {/* Brand & Description (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/image_e190e1fa.png"
                alt="Creovo"
                className="h-8 w-8 object-contain rounded-lg"
              />
              <span className="text-xl font-extrabold text-white">Creovo</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              المنصة المتكاملة لإنتاج فيديوهات UGC الإعلانية الاحترافية والذكاء الاصطناعي مع نظام الضمان المالي Escrow لحماية الطرفين.
            </p>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold pt-1">
              <ShieldCheck className="h-4 w-4" />
              <span>أموالك مؤمنة 100% بنظام الضمان المالي</span>
            </div>
          </div>

          {/* Quick Navigation Links (3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold text-white mb-3">روابط الوصول السريع</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('landing')}
                  className="hover:text-white transition-colors"
                >
                  الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="hover:text-white transition-colors"
                >
                  معرض صناع المحتوى
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="hover:text-white transition-colors"
                >
                  حاسبة التكلفة السريعة
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('escrow')}
                  className="hover:text-white transition-colors"
                >
                  نظام حماية الضمان (Escrow)
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Dashboards (4 cols) */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-xs font-bold text-white mb-3">لوحات التحكم والتنقل</h4>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('client_dashboard')}
                className="block hover:text-white transition-colors"
              >
                لوحة تحكم العميل (متابعة الطلبات ومكتبة الفيديوهات)
              </button>
              <button
                onClick={() => setActiveTab('creator_dashboard')}
                className="block hover:text-white transition-colors"
              >
                لوحة تحكم صانع المحتوى (المحفظة واستقبال الطلبات)
              </button>
              <button
                onClick={() => setActiveTab('admin_panel')}
                className="block hover:text-white transition-colors"
              >
                لوحة الإدارة المركزية (الأسعار والنزاعات)
              </button>
            </div>

            <div className="pt-3">
              <button
                onClick={() => openOrderWizard()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/40 px-3 py-1.5 font-bold hover:bg-orange-500/30 transition-colors"
              >
                <Sparkles className="h-3 w-3" />
                <span>طلب فيديو إعلاني جديد</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} منصة Creovo لتقنيات الفيديو الإعلاني.
          </div>
          <div className="flex items-center gap-1">
            <span>صُنع لدعم التجارة الإلكترونية واقتصاد المبدعين</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
