/**
 * Client-safe Stripe plan definitions — Credit-based system
 * Used by SubscriptionContext and PricingModal on the frontend
 */

export type PlanId = 'free' | 'pro' | 'enterprise';

export interface CreditCost {
  text: number;
  image: number;
  video: number;
  voice: number;
  website: number;
  marketing: number;
}

export interface PlanDefinition {
  id: PlanId;
  name: string;
  nameEn: string;
  price: number;
  monthlyCredits: number;
  maxProjects: number;
  costs: CreditCost;
  topUp: { price: number; credits: number } | null;
  featuresAr: string[];
  color: string;
  popular: boolean;
}

export const PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: 'free',
    name: 'مجاني',
    nameEn: 'Free',
    price: 0,
    monthlyCredits: 5,
    maxProjects: 1,
    costs: {
      text: 1,
      image: 3,
      video: 0,   // 0 = ممنوع
      voice: 2,
      website: 0, // 0 = ممنوع
      marketing: 2,
    },
    topUp: null, // لا يمكن شراء كريدت إضافي
    featuresAr: [
      '5 كريدت شهرياً',
      'مشروع واحد',
      'توليد نص: 1 كريدت',
      'توليد صورة: 3 كريدت',
      'تعليق صوتي: 2 كريدت',
      'تقرير تسويقي: 2 كريدت',
    ],
    color: '#64748B',
    popular: false,
  },
  pro: {
    id: 'pro',
    name: 'احترافي',
    nameEn: 'Pro',
    price: 15,
    monthlyCredits: 500,
    maxProjects: 10,
    costs: {
      text: 1,
      image: 2,
      video: 10,
      voice: 1,
      website: 5,
      marketing: 2,
    },
    topUp: { price: 5, credits: 100 },
    featuresAr: [
      '500 كريدت شهرياً',
      '10 مشاريع',
      'توليد نص: 1 كريدت',
      'توليد صورة: 2 كريدت',
      'توليد فيديو: 10 كريدت',
      'تعليق صوتي: 1 كريدت',
      'بناء موقع: 5 كريدت',
      'تقرير تسويقي: 2 كريدت',
      'شراء كريدت إضافي: $5 = 100',
      'دعم بالأولوية',
    ],
    color: '#8B5CF6',
    popular: true,
  },
  enterprise: {
    id: 'enterprise',
    name: 'المؤسسات',
    nameEn: 'Enterprise',
    price: 30,
    monthlyCredits: 2000,
    maxProjects: -1, // غير محدود
    costs: {
      text: 1,
      image: 2,
      video: 8,
      voice: 1,
      website: 3,
      marketing: 1,
    },
    topUp: { price: 5, credits: 150 },
    featuresAr: [
      '2,000 كريدت شهرياً',
      'مشاريع غير محدودة',
      'توليد نص: 1 كريدت',
      'توليد صورة: 2 كريدت',
      'توليد فيديو: 8 كريدت',
      'تعليق صوتي: 1 كريدت',
      'بناء موقع: 3 كريدت',
      'تقرير تسويقي: 1 كريدت',
      'شراء كريدت إضافي: $5 = 150',
      'دعم مخصص 24/7',
      'API access',
    ],
    color: '#F59E0B',
    popular: false,
  },
};

/** Map tool action to credit cost type */
export const TOOL_CREDIT_MAP: Record<string, keyof CreditCost> = {
  'generate-content': 'text',
  'generate-image': 'image',
  'generate-video': 'video',
  'generate-voice': 'voice',
  'generate-website': 'website',
  'marketing-report': 'marketing',
  // Tool IDs
  'plan': 'text',
  'prompt': 'text',
  'marketing': 'marketing',
  'creator-studio': 'image',
  'photoshoot': 'image',
  'campaign': 'image',
  'storyboard': 'image',
  'video-studio': 'video',
  'voiceover': 'voice',
  'web-builder': 'website',
};
