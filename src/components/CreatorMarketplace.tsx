import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Creator } from '../types';
import {
  Search,
  Star,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  SlidersHorizontal,
  Heart,
  Video,
  Bot,
  UserCheck,
} from 'lucide-react';

export const CreatorMarketplace: React.FC = () => {
  const {
    creators,
    formatPrice,
    openOrderWizard,
    openReelModal,
    favorites,
    toggleFavorite,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all'); // all, human, ai
  const [selectedDialect, setSelectedDialect] = useState<string>('all');

  // Filter creators
  const filteredCreators = creators.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.badges.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || creator.category === selectedCategory;

    const matchesType =
      selectedType === 'all' || creator.type === selectedType;

    const matchesDialect =
      selectedDialect === 'all' || creator.dialect === selectedDialect;

    return matchesSearch && matchesCategory && matchesType && matchesDialect;
  });

  return (
    <section id="marketplace" className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-white/10 text-right">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 mb-2">
              <Sparkles className="h-4 w-4" />
              <span>مبدعون موثوقون جاهزون لتصوير منتجك</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              معرض صناع المحتوى (UGC & AI)
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              تصفح نماذج الفيديوهات الرأسية (9:16)، شاهد نتائج التصوير الحقيقية، واختر المبدع الأنسب لعلامتك التجارية.
            </p>
          </div>

          <div className="mt-4 md:mt-0 text-xs text-slate-400 font-medium">
            يظهر <span className="font-mono text-white font-bold">{filteredCreators.length}</span> من أصل <span className="font-mono text-white font-bold">{creators.length}</span> مبدع معتمد
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mb-8 space-y-4">
          {/* Search and Dialects Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث باسم المبدع، التخصص، أو المنتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 pr-10 pl-4 py-2.5 text-sm text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-right"
              />
            </div>

            {/* Production Type Segmented Control */}
            <div className="flex items-center gap-1 rounded-xl bg-white/5 p-1 border border-white/10 shrink-0">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedType === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setSelectedType('human')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedType === 'human'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="h-3 w-3" />
                <span>بشري (UGC)</span>
              </button>
              <button
                onClick={() => setSelectedType('ai')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedType === 'ai'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="h-3 w-3" />
                <span>ذكاء اصطناعي (AI)</span>
              </button>
            </div>

            {/* Dialect Selector */}
            <select
              value={selectedDialect}
              onChange={(e) => setSelectedDialect(e.target.value)}
              className="rounded-xl bg-[#121528] border border-white/10 px-4 py-2.5 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-none text-right shrink-0"
            >
              <option value="all">جميع اللهجات</option>
              <option value="egyptian">اللهجة المصرية</option>
              <option value="gulf">اللهجة الخليجية / السعودية</option>
              <option value="fusha">لغة عربية فصحى</option>
            </select>
          </div>

          {/* Categories Tab Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-right">
            {[
              { id: 'all', label: 'كافة التصنيفات' },
              { id: 'beauty', label: 'تجميل وعناية بالبشرة' },
              { id: 'tech', label: 'إلكترونيات وتقنية' },
              { id: 'fashion', label: 'ملابس وأزياء' },
              { id: 'fitness', label: 'لياقة وصحة ورياضة' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Creator Cards Grid (4 columns on lg) */}
        {filteredCreators.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10 p-8">
            <p className="text-base text-slate-300 mb-2 font-semibold">
              لم نعثر على صناع محتوى يطابقون خيارات البحث
            </p>
            <p className="text-xs text-slate-400 mb-4">
              جرب تغيير فلاتر البحث أو اللهجة المختارة
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedType('all');
                setSelectedDialect('all');
              }}
              className="text-xs text-indigo-400 hover:underline font-bold"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCreators.map((creator) => (
              <CreatorCard
                key={creator.id}
                creator={creator}
                formatPrice={formatPrice}
                isFavorite={favorites.includes(creator.id)}
                onToggleFavorite={() => toggleFavorite(creator.id)}
                onOpenReel={() => openReelModal(creator)}
                onOrder={() => openOrderWizard(creator)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

interface CreatorCardProps {
  creator: Creator;
  formatPrice: (p: number) => string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenReel: () => void;
  onOrder: () => void;
}

const CreatorCard: React.FC<CreatorCardProps> = ({
  creator,
  formatPrice,
  isFavorite,
  onToggleFavorite,
  onOpenReel,
  onOrder,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col rounded-2xl bg-[#14172c] border border-white/10 overflow-hidden shadow-lg transition-all duration-300 hover:border-indigo-500/50 hover:shadow-indigo-500/10 text-right"
    >
      {/* 9:16 Vertical Reel Thumbnail Container (Hover-to-Play Simulator) */}
      <div
        onClick={onOpenReel}
        className="relative aspect-[9/16] w-full overflow-hidden bg-slate-950 cursor-pointer"
      >
        <img
          src={creator.reelImage}
          alt={creator.name}
          className={`h-full w-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />

        {/* Gradient Scrim for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" />

        {/* Top Badges & Favorite Heart */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white transition-all hover:scale-110"
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
              }`}
            />
          </button>

          <div className="flex flex-col gap-1 items-end">
            <span className="rounded-full bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
              {creator.badges[0]}
            </span>
            <span className="text-[10px] text-white/80 bg-black/60 px-2 py-0.5 rounded">
              {creator.dialectLabel}
            </span>
          </div>
        </div>

        {/* Hover-to-Play Indicator */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/50 transform scale-100 group-hover:scale-110 transition-transform">
            <Play className="h-5 w-5 fill-current mr-0.5" />
          </div>
        </div>

        {/* Simulated Reel Scrubbing / Playing Bar */}
        {isHovered && (
          <div className="absolute bottom-16 left-3 right-3 h-1 bg-white/30 rounded-full overflow-hidden z-10">
            <div className="h-full bg-orange-400 animate-[pulse_1.5s_infinite] w-3/4 rounded-full" />
          </div>
        )}

        {/* Reel Bottom Meta Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-right pointer-events-none">
          <div className="flex items-center gap-2 mb-1">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="h-6 w-6 rounded-full border border-white/50 object-cover"
            />
            <span className="text-xs font-bold text-white drop-shadow">
              {creator.name}
            </span>
            <span className="text-[10px] text-slate-300">
              {creator.handle}
            </span>
          </div>
          <p className="text-[11px] text-white/90 line-clamp-1 drop-shadow">
            {creator.sampleVideoTitle}
          </p>
        </div>
      </div>

      {/* Card Body Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              <span className="font-mono tabular-nums">{creator.rating}</span>
              <span className="text-[11px] text-slate-400 font-normal">
                ({creator.completedVideos} فيديو)
              </span>
            </div>
            <span className="text-slate-400 text-[11px]">
              {creator.categoryLabel}
            </span>
          </div>

          {/* Short Bio */}
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
            {creator.bio}
          </p>

          {/* Equipment Kicker */}
          <div className="text-[10px] text-slate-400 flex items-center gap-1 mb-3">
            <span className="text-indigo-400 font-semibold">المعدات:</span>
            <span className="truncate">{creator.equipment.camera}</span>
          </div>
        </div>

        {/* Footer Price & Action */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400">يبدأ من</div>
            <div className="text-sm font-extrabold text-white font-mono tabular-nums">
              {formatPrice(creator.startingPriceUsd)}
            </div>
          </div>

          <button
            onClick={onOrder}
            className="rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs px-3.5 py-2 shadow-md transition-all active:scale-95"
          >
            طلب فيديو
          </button>
        </div>
      </div>
    </div>
  );
};
