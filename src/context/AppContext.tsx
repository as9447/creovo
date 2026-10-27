import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Creator,
  Order,
  OrderStatus,
  PlatformPricing,
  Dispute,
  CreatorApplication,
} from '../types';
import {
  INITIAL_CREATORS,
  INITIAL_ORDERS,
  INITIAL_PRICING,
  INITIAL_DISPUTES,
  INITIAL_APPLICANTS,
} from '../data/mockData';

export type UserRole = 'client' | 'creator' | 'admin';
export type AppTab =
  | 'landing'
  | 'marketplace'
  | 'calculator'
  | 'escrow'
  | 'video_generator'
  | '3d_studio'
  | 'client_dashboard'
  | 'creator_dashboard'
  | 'admin_panel';

interface PayoutRecord {
  id: string;
  amountUsd: number;
  amountEgp: number;
  method: 'instapay' | 'vodafone_cash' | 'bank';
  methodLabel: string;
  accountDetails: string;
  date: string;
  status: 'completed' | 'processing';
}

interface AppContextType {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currency: 'USD' | 'EGP';
  setCurrency: (currency: 'USD' | 'EGP') => void;
  pricing: PlatformPricing;
  updatePricing: (newPricing: PlatformPricing) => void;
  creators: Creator[];
  orders: Order[];
  favorites: string[];
  toggleFavorite: (creatorId: string) => void;
  disputes: Dispute[];
  applicants: CreatorApplication[];
  // Order builder wizard state
  isOrderWizardOpen: boolean;
  selectedCreatorForOrder: Creator | null;
  openOrderWizard: (creator?: Creator | null) => void;
  closeOrderWizard: () => void;
  createOrder: (orderData: Partial<Order>) => Order;
  // Escrow & order workflow actions
  updateOrderStatus: (orderId: string, status: OrderStatus, step: number) => void;
  requestRevision: (orderId: string, notes: string) => void;
  approveAndReleaseEscrow: (orderId: string) => void;
  uploadCreatorDraft: (orderId: string, draftUrl: string) => void;
  // Creator wallet & availability
  creatorWallet: {
    balanceHeldUsd: number;
    balanceAvailableUsd: number;
    totalEarnedUsd: number;
    payoutHistory: PayoutRecord[];
  };
  requestPayout: (
    amountUsd: number,
    method: 'instapay' | 'vodafone_cash' | 'bank',
    accountDetails: string
  ) => boolean;
  creatorAvailability: boolean;
  toggleCreatorAvailability: () => void;
  // Admin actions
  resolveDispute: (disputeId: string, resolution: 'refund' | 'release') => void;
  approveApplicant: (appId: string) => void;
  rejectApplicant: (appId: string) => void;
  // Video Reel Modal
  reelModal: {
    isOpen: boolean;
    creator: Creator | null;
    videoUrl: string;
    hasWatermark: boolean;
    orderId?: string;
  };
  openReelModal: (
    creator: Creator,
    videoUrl?: string,
    hasWatermark?: boolean,
    orderId?: string
  ) => void;
  closeReelModal: () => void;
  formatPrice: (amountUsd: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AppTab>('landing');
  const [userRole, setUserRole] = useState<UserRole>('client');
  const [currency, setCurrency] = useState<'USD' | 'EGP'>('USD');
  const [pricing, setPricing] = useState<PlatformPricing>(INITIAL_PRICING);
  const [creators, setCreators] = useState<Creator[]>(INITIAL_CREATORS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [favorites, setFavorites] = useState<string[]>(['c1', 'c2']);
  const [disputes, setDisputes] = useState<Dispute[]>(INITIAL_DISPUTES);
  const [applicants, setApplicants] = useState<CreatorApplication[]>(INITIAL_APPLICANTS);
  const [creatorAvailability, setCreatorAvailability] = useState<boolean>(true);

  // Wizard state
  const [isOrderWizardOpen, setIsOrderWizardOpen] = useState(false);
  const [selectedCreatorForOrder, setSelectedCreatorForOrder] = useState<Creator | null>(null);

  // Reel modal state
  const [reelModal, setReelModal] = useState<{
    isOpen: boolean;
    creator: Creator | null;
    videoUrl: string;
    hasWatermark: boolean;
    orderId?: string;
  }>({
    isOpen: false,
    creator: null,
    videoUrl: '',
    hasWatermark: false,
  });

  // Creator Wallet state
  const [creatorWallet, setCreatorWallet] = useState<{
    balanceHeldUsd: number;
    balanceAvailableUsd: number;
    totalEarnedUsd: number;
    payoutHistory: PayoutRecord[];
  }>({
    balanceHeldUsd: 125, // from order CRV-8931 in progress
    balanceAvailableUsd: 380, // ready to withdraw
    totalEarnedUsd: 1850,
    payoutHistory: [
      {
        id: 'pay-01',
        amountUsd: 250,
        amountEgp: 5000,
        method: 'vodafone_cash',
        methodLabel: 'فودافون كاش (010xxxx9821)',
        accountDetails: '01019823491',
        date: '2026-10-20',
        status: 'completed',
      },
      {
        id: 'pay-02',
        amountUsd: 400,
        amountEgp: 8000,
        method: 'instapay',
        methodLabel: 'إنستاباي (IPA: ahmed@instapay)',
        accountDetails: 'ahmed@instapay',
        date: '2026-10-12',
        status: 'completed',
      },
    ],
  });

  // Helper price formatter
  const formatPrice = (amountUsd: number) => {
    if (currency === 'EGP') {
      const egpVal = Math.round(amountUsd * pricing.egpExchangeRate);
      return `${egpVal.toLocaleString()} ج.م`;
    }
    return `$${amountUsd}`;
  };

  const openOrderWizard = (creator?: Creator | null) => {
    setSelectedCreatorForOrder(creator || null);
    setIsOrderWizardOpen(true);
  };

  const closeOrderWizard = () => {
    setIsOrderWizardOpen(false);
    setSelectedCreatorForOrder(null);
  };

  const openReelModal = (
    creator: Creator,
    videoUrl?: string,
    hasWatermark?: boolean,
    orderId?: string
  ) => {
    setReelModal({
      isOpen: true,
      creator,
      videoUrl: videoUrl || creator.reelImage,
      hasWatermark: !!hasWatermark,
      orderId,
    });
  };

  const closeReelModal = () => {
    setReelModal((prev) => ({ ...prev, isOpen: false }));
  };

  const toggleFavorite = (creatorId: string) => {
    setFavorites((prev) =>
      prev.includes(creatorId)
        ? prev.filter((id) => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const updatePricing = (newPricing: PlatformPricing) => {
    setPricing(newPricing);
  };

  const toggleCreatorAvailability = () => {
    setCreatorAvailability((prev) => !prev);
  };

  // Create an order
  const createOrder = (orderData: Partial<Order>): Order => {
    const newId = `ord-${Date.now().toString().slice(-4)}`;
    const orderNumber = `CRV-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: newId,
      orderNumber,
      createdAt: 'الآن',
      clientName: orderData.clientName || 'عميل كريفوفو',
      clientEmail: orderData.clientEmail || 'client@example.com',
      creatorId: orderData.creatorId || 'c1',
      creatorName: orderData.creatorName || 'سارة الشريف',
      creatorAvatar:
        orderData.creatorAvatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      productionType: orderData.productionType || 'human_ugc',
      status: 'escrow_funded',
      productName: orderData.productName || 'منتج جديد',
      productUrl: orderData.productUrl || '',
      productCategory: orderData.productCategory || 'تجميل وعناية',
      keyPoints: orderData.keyPoints || [],
      forbiddenPoints: orderData.forbiddenPoints || [],
      toneOfVoice: orderData.toneOfVoice || 'حماسية ومباشرة',
      addOns: orderData.addOns || {
        physicalShipping: false,
        aspectRatios: ['9:16'],
        commercialRights: true,
        express24h: false,
        rawFootage: false,
      },
      pricing: orderData.pricing || {
        baseUsd: 50,
        ratiosCostUsd: 0,
        commercialRightsUsd: 15,
        express24hUsd: 0,
        rawFootageUsd: 0,
        totalUsd: 65,
        totalEgp: 1300,
      },
      watermarkedVideoUrl:
        orderData.watermarkedVideoUrl ||
        '/src/assets/images/ugc_reel_skincare_1793114432299.jpg',
      videoThumbnail:
        orderData.videoThumbnail ||
        '/src/assets/images/ugc_reel_skincare_1793114432299.jpg',
      revisionsUsed: 0,
      maxRevisions: 1,
      escrowStatus: 'held',
      currentStep: 2, // Escrow Funded!
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, step: number) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status,
              currentStep: step,
            }
          : ord
      )
    );
  };

  // Client requests revision
  const requestRevision = (orderId: string, notes: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'revision_requested',
              revisionNotes: notes,
              revisionsUsed: ord.revisionsUsed + 1,
              currentStep: 5,
            }
          : ord
      )
    );
  };

  // Client approves video draft: releases escrow, removes watermark, pays creator!
  const approveAndReleaseEscrow = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          // Add to creator available balance
          setCreatorWallet((cw) => ({
            ...cw,
            balanceHeldUsd: Math.max(0, cw.balanceHeldUsd - ord.pricing.totalUsd),
            balanceAvailableUsd: cw.balanceAvailableUsd + ord.pricing.totalUsd,
            totalEarnedUsd: cw.totalEarnedUsd + ord.pricing.totalUsd,
          }));

          return {
            ...ord,
            status: 'completed',
            escrowStatus: 'released',
            cleanVideoUrl: ord.watermarkedVideoUrl,
            currentStep: 6,
          };
        }
        return ord;
      })
    );
  };

  // Creator uploads new draft
  const uploadCreatorDraft = (orderId: string, draftUrl: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'in_review',
              watermarkedVideoUrl: draftUrl,
              currentStep: 4,
            }
          : ord
      )
    );
  };

  // Creator requests payout
  const requestPayout = (
    amountUsd: number,
    method: 'instapay' | 'vodafone_cash' | 'bank',
    accountDetails: string
  ): boolean => {
    if (amountUsd > creatorWallet.balanceAvailableUsd || amountUsd <= 0) {
      return false;
    }

    const methodLabels: Record<string, string> = {
      instapay: `إنستاباي (${accountDetails})`,
      vodafone_cash: `فودافون كاش (${accountDetails})`,
      bank: `تحويل بنكي IBAN (${accountDetails})`,
    };

    const newRecord: PayoutRecord = {
      id: `pay-${Date.now().toString().slice(-4)}`,
      amountUsd,
      amountEgp: Math.round(amountUsd * pricing.egpExchangeRate),
      method,
      methodLabel: methodLabels[method] || accountDetails,
      accountDetails,
      date: new Date().toISOString().split('T')[0],
      status: 'processing',
    };

    setCreatorWallet((prev) => ({
      ...prev,
      balanceAvailableUsd: prev.balanceAvailableUsd - amountUsd,
      payoutHistory: [newRecord, ...prev.payoutHistory],
    }));

    return true;
  };

  // Admin Dispute resolution
  const resolveDispute = (disputeId: string, resolution: 'refund' | 'release') => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: resolution === 'refund' ? 'resolved_refund' : 'resolved_release',
            }
          : d
      )
    );

    const dispute = disputes.find((d) => d.id === disputeId);
    if (dispute) {
      const targetOrder = orders.find((o) => o.id === dispute.orderId);
      if (targetOrder) {
        if (resolution === 'refund') {
          updateOrderStatus(targetOrder.id, 'disputed', 1);
        } else {
          approveAndReleaseEscrow(targetOrder.id);
        }
      }
    }
  };

  // Admin Applicant approvals
  const approveApplicant = (appId: string) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'approved' } : a))
    );
  };

  const rejectApplicant = (appId: string) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'rejected' } : a))
    );
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userRole,
        setUserRole,
        currency,
        setCurrency,
        pricing,
        updatePricing,
        creators,
        orders,
        favorites,
        toggleFavorite,
        disputes,
        applicants,
        isOrderWizardOpen,
        selectedCreatorForOrder,
        openOrderWizard,
        closeOrderWizard,
        createOrder,
        updateOrderStatus,
        requestRevision,
        approveAndReleaseEscrow,
        uploadCreatorDraft,
        creatorWallet,
        requestPayout,
        creatorAvailability,
        toggleCreatorAvailability,
        resolveDispute,
        approveApplicant,
        rejectApplicant,
        reelModal,
        openReelModal,
        closeReelModal,
        formatPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
