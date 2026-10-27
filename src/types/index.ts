export type ProductionType = 'ai' | 'human_ugc';

export type VideoRatio = '9:16' | '16:9' | '1:1';

export type OrderStatus =
  | 'escrow_funded'
  | 'awaiting_shipping'
  | 'in_production'
  | 'in_review'
  | 'revision_requested'
  | 'completed'
  | 'disputed';

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  reelImage: string;
  videoDurationSec: number;
  category: 'beauty' | 'tech' | 'fashion' | 'fitness' | 'services';
  categoryLabel: string;
  dialect: 'egyptian' | 'gulf' | 'fusha' | 'english';
  dialectLabel: string;
  type: 'human' | 'ai';
  rating: number;
  reviewsCount: number;
  completedVideos: number;
  startingPriceUsd: number;
  startingPriceEgp: number;
  deliveryDays: number;
  bio: string;
  badges: string[];
  equipment: {
    camera: string;
    lighting: string;
    mic: string;
    software: string;
  };
  isAvailable: boolean;
  responseTime: string;
  featuredQuote: string;
  sampleVideoTitle: string;
}

export interface OrderPricing {
  baseUsd: number;
  ratiosCostUsd: number;
  commercialRightsUsd: number;
  express24hUsd: number;
  rawFootageUsd: number;
  totalUsd: number;
  totalEgp: number;
}

export interface OrderAddOns {
  physicalShipping: boolean;
  aspectRatios: VideoRatio[];
  commercialRights: boolean;
  express24h: boolean;
  rawFootage: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  clientName: string;
  clientEmail: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  productionType: ProductionType;
  status: OrderStatus;
  productName: string;
  productUrl?: string;
  productCategory: string;
  keyPoints: string[];
  forbiddenPoints: string[];
  toneOfVoice: string;
  addOns: OrderAddOns;
  pricing: OrderPricing;
  watermarkedVideoUrl: string;
  cleanVideoUrl?: string;
  videoThumbnail: string;
  revisionNotes?: string;
  revisionsUsed: number;
  maxRevisions: number;
  escrowStatus: 'held' | 'released' | 'refunded';
  currentStep: number; // 1 to 6 corresponding to Escrow workflow
}

export interface PlatformPricing {
  aiBaseUsd: number;
  humanUgcBaseUsd: number;
  ratio16_9Usd: number;
  ratio1_1Usd: number;
  commercialRightsUsd: number;
  express24hUsd: number;
  rawFootageUsd: number;
  egpExchangeRate: number; // e.g. 50
}

export interface Dispute {
  id: string;
  orderId: string;
  orderNumber: string;
  clientName: string;
  creatorName: string;
  amountUsd: number;
  reason: string;
  date: string;
  status: 'open' | 'investigating' | 'resolved_refund' | 'resolved_release';
  evidence: string;
}

export interface CreatorApplication {
  id: string;
  fullName: string;
  email: string;
  country: string;
  dialect: string;
  category: string;
  portfolioUrl: string;
  equipment: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}
