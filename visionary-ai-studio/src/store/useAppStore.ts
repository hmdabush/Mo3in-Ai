import { create } from 'zustand';

// Tool definitions
export type ToolId =
  | 'dashboard'
  | 'creator-studio'
  | 'storyboard'
  | 'marketing'
  | 'photoshoot'
  | 'edit-pro'
  | 'plan'
  | 'campaign'
  | 'prompt'
  | 'voiceover'
  | 'video-studio'
  | 'web-builder'
  | 'social-publisher'
  | 'analytics'
  | 'templates'
  | 'brand-kit'
  | 'ugc';

export type ToolCategory = 'visual' | 'marketing' | 'tools';

export interface ToolDefinition {
  id: ToolId;
  name: string;
  nameAr: string;
  icon: string;
  description: string;
  category: ToolCategory;
}

export const TOOL_CATEGORIES: { id: ToolCategory; name: string; nameAr: string }[] = [
  { id: 'visual', name: 'Visual Creation', nameAr: 'الإبداع البصري' },
  { id: 'marketing', name: 'Marketing & Content', nameAr: 'التسويق والمحتوى' },
  { id: 'tools', name: 'Tools & Utilities', nameAr: 'الأدوات' },
];

export const TOOLS: ToolDefinition[] = [
  // Visual Creation
  { id: 'creator-studio', name: 'Creator Studio', nameAr: 'استوديو الإبداع', icon: 'Sparkles', description: 'Fuse product images with style references', category: 'visual' },
  { id: 'photoshoot', name: 'Photoshoot', nameAr: 'جلسة التصوير', icon: 'Camera', description: 'Generate camera angles and shots', category: 'visual' },
  { id: 'storyboard', name: 'Storyboard', nameAr: 'اللوحة السينمائية', icon: 'Film', description: 'Generate sequential storyboard scenes', category: 'visual' },
  { id: 'edit-pro', name: 'Edit PRO', nameAr: 'التحرير المتقدم', icon: 'Palette', description: 'Post-processing and graphic design', category: 'visual' },
  // Marketing & Content
  { id: 'marketing', name: 'Marketing', nameAr: 'المحرك الاستراتيجي', icon: 'BarChart3', description: 'Brand analysis and GTM strategy', category: 'marketing' },
  { id: 'plan', name: 'Plan', nameAr: 'مخطط الحملات', icon: 'Target', description: 'Localized campaign generation', category: 'marketing' },
  { id: 'campaign', name: 'Campaign', nameAr: 'حملات السوشيال', icon: 'Megaphone', description: 'Social media funnel generation', category: 'marketing' },
  { id: 'social-publisher', name: 'Publisher', nameAr: 'النشر المباشر', icon: 'Send', description: 'Publish directly to social media platforms', category: 'marketing' },
  // Tools & Utilities
  { id: 'prompt', name: 'Prompt', nameAr: 'هندسة الأوامر', icon: 'Wand2', description: 'Reverse-engineer image prompts', category: 'tools' },
  { id: 'voiceover', name: 'Voice Over', nameAr: 'التعليق الصوتي', icon: 'Mic', description: 'Text-to-speech for ad scripts', category: 'tools' },
  { id: 'video-studio', name: 'Video Studio', nameAr: 'استوديو الفيديو', icon: 'Video', description: 'Frame-to-Frame cinematic video generation', category: 'tools' },
  { id: 'web-builder', name: 'Web Builder', nameAr: 'مُعين المواقع', icon: 'Globe', description: 'AI-powered website design & generation', category: 'tools' },
  { id: 'analytics', name: 'Analytics', nameAr: 'التحليلات', icon: 'TrendingUp', description: 'Performance analytics and insights', category: 'marketing' },
  { id: 'templates', name: 'Templates', nameAr: 'مكتبة القوالب', icon: 'LayoutGrid', description: 'Ready-made design templates', category: 'visual' },
  { id: 'brand-kit', name: 'Brand Kit', nameAr: 'هوية العلامة', icon: 'Brush', description: 'Brand colors, fonts and guidelines', category: 'visual' },
  { id: 'ugc', name: 'UGC Creator', nameAr: 'صانع المحتوى الإعلاني', icon: 'Users', description: 'AI-generated UGC testimonial videos', category: 'marketing' },
];

// Project types
export interface UploadedImage {
  id: string;
  file: File | null;
  url: string;
  name: string;
}

// Creator Studio specific state
export interface CreatorStudioState {
  mainProduct: UploadedImage | null;
  styleReference: UploadedImage | null;
  lighting: string;
  angle: string;
  visionPrompt: string;
  generatedImages: string[];
  isGenerating: boolean;
}

// Storyboard specific state
export interface StoryboardState {
  aspectRatio: '16:9' | '9:16';
  referenceSubject: UploadedImage | null;
  storyVision: string;
  generatedScenes: string[];
  isGenerating: boolean;
}

// Marketing specific state
export type MarketingSection = 
  | 'strategy'
  | 'audit'
  | 'copy'
  | 'emails'
  | 'social'
  | 'ads'
  | 'funnel'
  | 'competitors'
  | 'landing'
  | 'launch'
  | 'proposal'
  | 'report'
  | 'seo'
  | 'brand';

export interface MarketingAuditResult {
  overallScore: number;
  categories: Array<{ name: string; score: number; weight: string; findings: string[] }>;
  topIssues: string[];
}

export interface MarketingCopyResult {
  headlines: Array<{ before: string; after: string }>;
  ctas: Array<{ before: string; after: string }>;
  bodyRewrite: string;
}

export interface MarketingEmailResult {
  sequenceType: string;
  emails: Array<{ subject: string; preview: string; dayNumber: number; purpose: string }>;
}

export interface MarketingSocialResult {
  posts: Array<{ day: number; pillar: string; platform: string; hook: string; time: string }>;
}

export interface MarketingAdsResult {
  platforms: Array<{ name: string; headline: string; description: string; cta: string; budget: string }>;
}

export interface MarketingFunnelResult {
  stages: Array<{ name: string; conversionRate: string; dropOff: string; recommendation: string }>;
}

export interface MarketingCompetitorResult {
  competitors: Array<{ name: string; positioning: string; pricing: string; strengths: string[]; weaknesses: string[] }>;
}

export interface MarketingLandingResult {
  score: number;
  checks: Array<{ area: string; status: 'pass' | 'fail' | 'warning'; note: string }>;
}

export interface MarketingLaunchResult {
  weeks: Array<{ week: number; phase: string; tasks: string[] }>;
}

export interface MarketingProposalResult {
  sections: Array<{ title: string; content: string }>;
  pricing: Array<{ tier: string; price: string; features: string[] }>;
}

export interface MarketingSeoResult {
  score: number;
  onPage: Array<{ check: string; status: 'pass' | 'fail' | 'warning'; detail: string }>;
  technicalIssues: string[];
}

export interface MarketingBrandResult {
  voiceDimensions: Array<{ dimension: string; score: number; description: string }>;
  toneMap: Array<{ context: string; tone: string }>;
  personality: string[];
}

export type SectionResult =
  | MarketingAuditResult
  | MarketingCopyResult
  | MarketingEmailResult
  | MarketingSocialResult
  | MarketingAdsResult
  | MarketingFunnelResult
  | MarketingCompetitorResult
  | MarketingLandingResult
  | MarketingLaunchResult
  | MarketingProposalResult
  | MarketingSeoResult
  | MarketingBrandResult;

export interface MarketingState {
  mode: 'new' | 'existing';
  brandName: string;
  brandLink: string;
  industry: string;
  projectBrief: string;
  language: 'ar' | 'en';
  activeSection: MarketingSection;
  generatedCards: Record<string, string> | null;
  isGenerating: boolean;
  sectionResults: Partial<Record<MarketingSection, SectionResult>>;
  generatingSection: MarketingSection | null;
}

// Photoshoot specific state
export interface PhotoshootState {
  productImage: UploadedImage | null;
  selectedShots: string[];
  stylePrompt: string;
  generatedImages: string[];
  isGenerating: boolean;
}

// Plan specific state
export interface PlanState {
  productReference: UploadedImage | null;
  campaignGoal: string;
  targetMarket: string;
  language: string;
  style: string;
  generatedPosts: Array<{ text: string; visualIdea: string; hashtags?: string[]; platform?: string; bestTime?: string }>;
  isGenerating: boolean;
}

// Campaign specific state
export interface CampaignState {
  productRef: UploadedImage | null;
  designTheme: string;
  moodPreset: string;
  mode: 'auto' | 'custom';
  generatedPosts: string[];
  isGenerating: boolean;
}

// Prompt specific state
export interface PromptState {
  referenceImage: UploadedImage | null;
  instructions: string;
  generatedPrompt: string;
  promptHistory: Array<{ prompt: string; timestamp: string }>;
  isGenerating: boolean;
}

// VoiceOver specific state
export interface VoiceOverState {
  script: string;
  styleInstructions: string;
  selectedVoice: string;
  generatedAudioUrl: string;
  audioHistory: Array<{ url: string; voice: string; timestamp: string }>;
  isGenerating: boolean;
}

// VideoStudio specific state
export interface VideoStudioState {
  firstFrame: UploadedImage | null;
  lastFrame: UploadedImage | null;
  motionPrompt: string;
  cameraMove: string;
  aspectRatio: string;
  quality: string;
  duration: string;
  generatedVideoUrl: string;
  videoVariations: string[];
  isGenerating: boolean;
}

// WebBuilder specific state
export interface WebBuilderState {
  siteType: string;
  siteName: string;
  siteDescription: string;
  colorPalette: string;
  designStyle: string;
  selectedPages: string[];
  generatedHtml: string;
  isGenerating: boolean;
}

// SocialPublisher specific state
export interface SocialAccount {
  platform: 'instagram' | 'facebook' | 'tiktok' | 'twitter';
  username: string;
  connected: boolean;
  avatar?: string;
}

export interface ScheduledPost {
  id: string;
  content: string;
  mediaUrl?: string;
  platforms: string[];
  scheduledAt: string;
  status: 'scheduled' | 'published' | 'failed';
}

export interface SocialPublisherState {
  accounts: SocialAccount[];
  postContent: string;
  postMedia: UploadedImage | null;
  selectedPlatforms: string[];
  scheduleMode: 'now' | 'scheduled';
  scheduledDate: string;
  scheduledTime: string;
  hashtags: string;
  scheduledPosts: ScheduledPost[];
  isPublishing: boolean;
}

// UGC Creator specific state
export interface UGCState {
  productImage: UploadedImage | null;
  characterImage: string;
  generatedScript: string;
  voiceUrl: string;
  videoUrl: string;
  isGeneratingCharacter: boolean;
  isGeneratingScript: boolean;
  isGeneratingVoice: boolean;
  isGeneratingVideo: boolean;
}

// Project
export interface Project {
  id: string;
  name: string;
  creatorStudio: CreatorStudioState;
  storyboard: StoryboardState;
  marketing: MarketingState;
  photoshoot: PhotoshootState;
  plan: PlanState;
  campaign: CampaignState;
  prompt: PromptState;
  voiceover: VoiceOverState;
  videoStudio: VideoStudioState;
  webBuilder: WebBuilderState;
  socialPublisher: SocialPublisherState;
  ugc: UGCState;
}

// Default states
const defaultCreatorStudio: CreatorStudioState = {
  mainProduct: null,
  styleReference: null,
  lighting: 'natural',
  angle: 'front',
  visionPrompt: '',
  generatedImages: [],
  isGenerating: false,
};

const defaultStoryboard: StoryboardState = {
  aspectRatio: '16:9',
  referenceSubject: null,
  storyVision: '',
  generatedScenes: [],
  isGenerating: false,
};

const defaultMarketing: MarketingState = {
  mode: 'new',
  brandName: '',
  brandLink: '',
  industry: '',
  projectBrief: '',
  language: 'ar',
  activeSection: 'strategy',
  generatedCards: null,
  isGenerating: false,
  sectionResults: {},
  generatingSection: null,
};

const defaultPhotoshoot: PhotoshootState = {
  productImage: null,
  selectedShots: [],
  stylePrompt: '',
  generatedImages: [],
  isGenerating: false,
};

const defaultPlan: PlanState = {
  productReference: null,
  campaignGoal: '',
  targetMarket: 'egypt',
  language: 'egyptian',
  style: 'slang',
  generatedPosts: [],
  isGenerating: false,
};

const defaultCampaign: CampaignState = {
  productRef: null,
  designTheme: '',
  moodPreset: 'original',
  mode: 'auto',
  generatedPosts: [],
  isGenerating: false,
};

const defaultPrompt: PromptState = {
  referenceImage: null,
  instructions: '',
  generatedPrompt: '',
  promptHistory: [],
  isGenerating: false,
};

const defaultVoiceOver: VoiceOverState = {
  script: '',
  styleInstructions: '',
  selectedVoice: 'Kore',
  generatedAudioUrl: '',
  audioHistory: [],
  isGenerating: false,
};

const defaultVideoStudio: VideoStudioState = {
  firstFrame: null,
  lastFrame: null,
  motionPrompt: '',
  cameraMove: 'dolly-in',
  aspectRatio: '16:9',
  quality: '1080p',
  duration: '5s',
  generatedVideoUrl: '',
  videoVariations: [],
  isGenerating: false,
};

const defaultWebBuilder: WebBuilderState = {
  siteType: 'landing',
  siteName: '',
  siteDescription: '',
  colorPalette: 'modern-dark',
  designStyle: 'modern',
  selectedPages: ['hero', 'about', 'services', 'contact', 'footer'],
  generatedHtml: '',
  isGenerating: false,
};

const defaultSocialPublisher: SocialPublisherState = {
  accounts: [
    { platform: 'instagram', username: '', connected: false },
    { platform: 'facebook', username: '', connected: false },
    { platform: 'tiktok', username: '', connected: false },
    { platform: 'twitter', username: '', connected: false },
  ],
  postContent: '',
  postMedia: null,
  selectedPlatforms: [],
  scheduleMode: 'now',
  scheduledDate: '',
  scheduledTime: '',
  hashtags: '',
  scheduledPosts: [],
  isPublishing: false,
};

const defaultUGC: UGCState = {
  productImage: null,
  characterImage: '',
  generatedScript: '',
  voiceUrl: '',
  videoUrl: '',
  isGeneratingCharacter: false,
  isGeneratingScript: false,
  isGeneratingVoice: false,
  isGeneratingVideo: false,
};

function createDefaultProject(id: string, name: string): Project {
  return {
    id,
    name,
    creatorStudio: { ...defaultCreatorStudio },
    storyboard: { ...defaultStoryboard },
    marketing: { ...defaultMarketing },
    photoshoot: { ...defaultPhotoshoot },
    plan: { ...defaultPlan },
    campaign: { ...defaultCampaign },
    prompt: { ...defaultPrompt },
    voiceover: { ...defaultVoiceOver },
    videoStudio: { ...defaultVideoStudio },
    webBuilder: { ...defaultWebBuilder },
    socialPublisher: { ...defaultSocialPublisher },
    ugc: { ...defaultUGC },
  };
}

// App Store
interface AppState {
  // Navigation
  activeTool: ToolId;
  setActiveTool: (tool: ToolId) => void;

  // Projects
  projects: Project[];
  activeProjectId: string;
  setActiveProject: (id: string) => void;
  addProject: () => void;
  removeProject: (id: string) => void;
  renameProject: (id: string, name: string) => void;

  // Get current project
  getActiveProject: () => Project;

  // Creator Studio actions
  updateCreatorStudio: (updates: Partial<CreatorStudioState>) => void;

  // Storyboard actions
  updateStoryboard: (updates: Partial<StoryboardState>) => void;

  // Marketing actions
  updateMarketing: (updates: Partial<MarketingState>) => void;

  // Photoshoot actions
  updatePhotoshoot: (updates: Partial<PhotoshootState>) => void;

  // Plan actions
  updatePlan: (updates: Partial<PlanState>) => void;

  // Campaign actions
  updateCampaign: (updates: Partial<CampaignState>) => void;

  // Prompt actions
  updatePrompt: (updates: Partial<PromptState>) => void;

  // VoiceOver actions
  updateVoiceOver: (updates: Partial<VoiceOverState>) => void;

  // VideoStudio actions
  updateVideoStudio: (updates: Partial<VideoStudioState>) => void;

  // WebBuilder actions
  updateWebBuilder: (updates: Partial<WebBuilderState>) => void;

  // SocialPublisher actions
  updateSocialPublisher: (updates: Partial<SocialPublisherState>) => void;

  // UGC actions
  updateUGC: (updates: Partial<UGCState>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  activeTool: 'dashboard',
  setActiveTool: (tool) => set({ activeTool: tool }),

  // Projects
  projects: [createDefaultProject('project-1', 'Project 1')],
  activeProjectId: 'project-1',

  setActiveProject: (id) => set({ activeProjectId: id }),

  addProject: () => {
    const { projects } = get();
    const newId = `project-${Date.now()}`;
    const newName = `Project ${projects.length + 1}`;
    set({
      projects: [...projects, createDefaultProject(newId, newName)],
      activeProjectId: newId,
    });
  },

  removeProject: (id) => {
    const { projects, activeProjectId } = get();
    if (projects.length <= 1) return;
    const filtered = projects.filter((p) => p.id !== id);
    set({
      projects: filtered,
      activeProjectId: activeProjectId === id ? filtered[0].id : activeProjectId,
    });
  },

  renameProject: (id, name) => {
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, name } : p)),
    }));
  },

  getActiveProject: () => {
    const { projects, activeProjectId } = get();
    return projects.find((p) => p.id === activeProjectId) || projects[0];
  },

  // Update helpers
  updateCreatorStudio: (updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === state.activeProjectId
          ? { ...p, creatorStudio: { ...p.creatorStudio, ...updates } }
          : p
      ),
    }));
  },

  updateStoryboard: (updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === state.activeProjectId
          ? { ...p, storyboard: { ...p.storyboard, ...updates } }
          : p
      ),
    }));
  },

  updateMarketing: (updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === state.activeProjectId
          ? { ...p, marketing: { ...p.marketing, ...updates } }
          : p
      ),
    }));
  },

  updatePhotoshoot: (updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === state.activeProjectId
          ? { ...p, photoshoot: { ...p.photoshoot, ...updates } }
          : p
      ),
    }));
  },

  updatePlan: (updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === state.activeProjectId
          ? { ...p, plan: { ...p.plan, ...updates } }
          : p
      ),
    }));
  },

  updateCampaign: (updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === state.activeProjectId
          ? { ...p, campaign: { ...p.campaign, ...updates } }
          : p
      ),
    }));
  },

  updatePrompt: (updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === state.activeProjectId
          ? { ...p, prompt: { ...p.prompt, ...updates } }
          : p
      ),
    }));
  },

  updateVoiceOver: (updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === state.activeProjectId
          ? { ...p, voiceover: { ...p.voiceover, ...updates } }
          : p
      ),
    }));
  },

  updateVideoStudio: (updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === state.activeProjectId
          ? { ...p, videoStudio: { ...p.videoStudio, ...updates } }
          : p
      ),
    }));
  },

  updateWebBuilder: (updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === state.activeProjectId
          ? { ...p, webBuilder: { ...p.webBuilder, ...updates } }
          : p
      ),
    }));
  },

  updateSocialPublisher: (updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === state.activeProjectId
          ? { ...p, socialPublisher: { ...p.socialPublisher, ...updates } }
          : p
      ),
    }));
  },

  updateUGC: (updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === state.activeProjectId
          ? { ...p, ugc: { ...p.ugc, ...updates } }
          : p
      ),
    }));
  },
}));
