import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { InstantCostCalculator } from './components/InstantCostCalculator';
import { CreatorMarketplace } from './components/CreatorMarketplace';
import { HowItWorksEscrow } from './components/HowItWorksEscrow';
import { ClientDashboard } from './components/ClientDashboard';
import { CreatorDashboard } from './components/CreatorDashboard';
import { AdminPanel } from './components/AdminPanel';
import { OrderWizardModal } from './components/OrderWizardModal';
import { VideoReelModal } from './components/VideoReelModal';
import { VideoGeneratorStudio } from './components/VideoGeneratorStudio';
import { ThreeProductStudio } from './components/ThreeProductStudio';
import { GeminiChatbot } from './components/GeminiChatbot';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [passedPrompt, setPassedPrompt] = useState<string>('');
  const [passedProductName, setPassedProductName] = useState<string>('');

  const handleGenerateFrom3D = (prompt: string, productName: string) => {
    setPassedPrompt(prompt);
    setPassedProductName(productName);
    setActiveTab('video_generator');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c16] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar with logo and role/currency controls */}
      <Navbar />

      {/* Main Content Viewport */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <>
            <HeroSection />

            {/* 3D Virtual Studio Section */}
            <section className="py-12 mx-auto max-w-7xl px-4 sm:px-6">
              <div className="text-right mb-6">
                <span className="text-xs font-bold text-indigo-400">
                  معاينة ثلاثية الأبعاد تفاعلية
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1">
                  استوديو المنتجات الافتراضي 3D (Virtual Product Studio)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  دوّر المنتج، وغيّر الخامات والإضاءة، واضغط على زر "توليد فيديو إعلاني حقيقي" لتحويله إلى إعلان TikTok/Reels واقعي فوراً.
                </p>
              </div>
              <ThreeProductStudio onGenerateVideoFrom3D={handleGenerateFrom3D} />
            </section>

            {/* Real AI Video Generator Studio */}
            <VideoGeneratorStudio
              initialPrompt={passedPrompt}
              initialProductName={passedProductName}
            />

            <InstantCostCalculator />
            <CreatorMarketplace />
            <HowItWorksEscrow />
          </>
        )}

        {activeTab === 'video_generator' && (
          <VideoGeneratorStudio
            initialPrompt={passedPrompt}
            initialProductName={passedProductName}
          />
        )}

        {activeTab === '3d_studio' && (
          <div className="py-10 mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-right mb-6">
              <span className="text-xs font-bold text-indigo-400">Three.js 3D Virtual Studio</span>
              <h2 className="text-3xl font-extrabold text-white mt-1">
                استوديو التصوير الافتراضي وإعداد الإضاءة للمنتجات
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                اختر منتجك، اختبر زوايا التصوير والخامات، ثم اضغط على زر توليد الفيديو الإعلاني الحقيقي.
              </p>
            </div>
            <ThreeProductStudio onGenerateVideoFrom3D={handleGenerateFrom3D} />
          </div>
        )}

        {activeTab === 'marketplace' && <CreatorMarketplace />}

        {activeTab === 'calculator' && <InstantCostCalculator />}

        {activeTab === 'escrow' && <HowItWorksEscrow />}

        {activeTab === 'client_dashboard' && <ClientDashboard />}

        {activeTab === 'creator_dashboard' && <CreatorDashboard />}

        {activeTab === 'admin_panel' && <AdminPanel />}
      </main>

      {/* Interactive Modals */}
      <OrderWizardModal />
      <VideoReelModal />

      {/* Floating Multi-Turn Gemini AI Creative Director Chatbot */}
      <GeminiChatbot />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
