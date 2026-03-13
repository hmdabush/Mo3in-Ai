import { create } from 'zustand';

// Tool definitions
export type ToolId =
  | 'creator-studio'
  | 'storyboard'
  | 'marketing'
  | 'photoshoot'
  | 'edit-pro'
  | 'plan'
  | 'campaign'
  | 'prompt'
  | 'voiceover'
  | 'video-studio';

export interface ToolDefinition {
  id: ToolId;
  name: string;
  nameAr: string;
  icon: string;
  description: string;
}

export const TOOLS: ToolDefinition[] = [
  { id: 'creator-studio', name: 'Creator Studio', nameAr: 'استوديو الإبداع', icon: 'Sparkles', description: 'Fuse product images with style references' },
  { id: 'storyboard', name: 'Storyboard', nameAr: 'اللوحة السينمائية', icon: 'Film', description: 'Generate sequential storyboard scenes' },
  { id: 'marketing', name: 'Marketing', nameAr: 'المحرك الاستراتيجي', icon: 'BarChart3', description: 'Brand analysis and GTM strategy' },
  { id: 'photoshoot', name: 'Photoshoot', nameAr: 'جلسة التصوير', icon: 'Camera', description: 'Generate camera angles and shots' },
  { id: 'edit-pro', name: 'Edit PRO', nameAr: 'التحرير المتقدم', icon: 'Palette', description: 'Post-processing and graphic design' },
  { id: 'plan', name: 'Plan', nameAr: 'مخطط الحملات', icon: 'Target', description: 'Localized campaign generation' },
  { id: 'campaign', name: 'Campaign', nameAr: 'حملات السوشيال', icon: 'Megaphone', description: 'Social media funnel generation' },
  { id: 'prompt', name: 'Prompt', nameAr: 'هندسة الأوامر', icon: 'Wand2', description: 'Reverse-engineer image prompts' },
  { id: 'voiceover', name: 'Voice Over', nameAr: 'التعليق الصوتي', icon: 'Mic', description: 'Text-to-speech for ad scripts' },
  { id: 'video-studio', name: 'Video Studio', nameAr: 'استوديو الفيديو', icon: 'Video', description: 'Frame-to-Frame cinematic video generation' },
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
  generatedPosts: Array<{ text: string; visualIdea: string }>;
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
}

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  activeTool: 'creator-studio',
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
}));
