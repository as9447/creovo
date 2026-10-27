import React from 'react';
import { useApp, AppTab, UserRole } from '../context/AppContext';
import {
  Sparkles,
  ShoppingBag,
  Calculator,
  ShieldCheck,
  User,
  Video,
  ShieldAlert,
  Coins,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    userRole,
    setUserRole,
    currency,
    setCurrency,
    openOrderWizard,
  } = useApp();

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    if (role === 'client') {
      setActiveTab('client_dashboard');
    } else if (role === 'creator') {
      setActiveTab('creator_dashboard');
    } else if (role === 'admin') {
      setActiveTab('admin_panel');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/8 bg-[#0b0c16]/90 backdrop-blur-md">
      {/* Role & Currency Switcher Utility Strip */}
      <div className="border-b border-white/5 bg-[#0f1122]/60 px-4 py-1.5 text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">تصفح النظام بدور:</span>
            <div className="inline-flex rounded-md bg-white/5 p-0.5 border border-white/10">
              <button
                onClick={() => handleRoleChange('client')}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1 transition-colors whitespace-nowrap font-medium ${
                  userRole === 'client' && activeTab === 'client_dashboard'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <User className="h-3 w-3" />
                <span>لوحة العميل</span>
              </button>
              <button
                onClick={() => handleRoleChange('creator')}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1 transition-colors whitespace-nowrap font-medium ${
                  userRole === 'creator' && activeTab === 'creator_dashboard'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Video className="h-3 w-3" />
                <span>لوحة صانع المحتوى</span>
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1 transition-colors whitespace-nowrap font-medium ${
                  userRole === 'admin' && activeTab === 'admin_panel'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <ShieldAlert className="h-3 w-3" />
                <span>الإدارة المركزية</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-slate-400">
              <Coins className="h-3 w-3 text-amber-400" />
              <span>العملة:</span>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  currency === 'USD'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                USD ($)
              </button>
              <span className="text-white/20">|</span>
              <button
                onClick={() => setCurrency('EGP')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  currency === 'EGP'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EGP (ج.م)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: Brand - 4 Navigation Links - 1 Primary Action */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3 sm:px-6">
        {/* Zone 1: Single Brand Lockup with Uploaded Logo */}
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 text-right group cursor-pointer focus-visible:outline-none"
        >
          <img
            src="/assets/aistudio/image_e190e1fa.png"
            alt="Creovo Logo"
            className="h-9 w-9 object-contain rounded-lg transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col text-right">
            <span className="text-xl font-extrabold tracking-tight text-white font-sans flex items-center gap-1">
              Creovo
              <span className="text-orange-500 text-lg">·</span>
              <span className="text-xs font-semibold text-indigo-400 font-sans">كريوفو</span>
            </span>
          </div>
        </button>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('landing')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeTab === 'landing' ? 'text-white font-semibold' : 'text-slate-400'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => setActiveTab('video_generator')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-white ${
              activeTab === 'video_generator' ? 'text-orange-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-orange-400" />
            <span>توليد فيديو بالـ AI</span>
          </button>
          <button
            onClick={() => setActiveTab('3d_studio')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeTab === '3d_studio' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            استوديو 3D
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeTab === 'marketplace' ? 'text-white font-semibold' : 'text-slate-400'
            }`}
          >
            معرض المبدعين
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeTab === 'calculator' ? 'text-white font-semibold' : 'text-slate-400'
            }`}
          >
            حاسبة التكلفة
          </button>
          <button
            onClick={() => setActiveTab('escrow')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              activeTab === 'escrow' ? 'text-white font-semibold' : 'text-slate-400'
            }`}
          >
            نظام الضمان
          </button>
        </nav>

        {/* Zone 3: 1 Primary CTA Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => openOrderWizard()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-orange-500/20 transition-all hover:brightness-110 active:scale-95 whitespace-nowrap shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            <span>اطلب فيديو إعلاني</span>
          </button>
        </div>
      </div>
    </header>
  );
};
