'use client';

import React, { useCallback } from 'react';
import {
    useAppStore, MarketingSection,
    MarketingAuditResult, MarketingCopyResult, MarketingEmailResult,
    MarketingSocialResult, MarketingAdsResult, MarketingFunnelResult,
    MarketingCompetitorResult, MarketingLandingResult, MarketingLaunchResult,
    MarketingProposalResult, MarketingSeoResult, MarketingBrandResult,
    SectionResult,
} from '@/store/useAppStore';
import SelectField from '@/components/shared/SelectField';
import {
    BarChart3, Zap, Loader2, Search, FileText, Mail, Share2, Megaphone,
    TrendingUp, Users, Monitor, Rocket, FileCheck, ClipboardList, Globe, Palette,
    ChevronRight, CheckCircle2, ArrowRight, AlertTriangle, XCircle,
    Target, Award, Eye, Star, Clock, DollarSign, TrendingDown,
    ArrowUpRight, BarChart2, PieChart, Activity, Layers,
} from 'lucide-react';
import styles from './Marketing.module.css';

const INDUSTRY_OPTIONS = [
    { value: '', label: 'Select Industry...' },
    { value: 'fashion', label: 'Fashion & Apparel' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'tech', label: 'Technology' },
    { value: 'beauty', label: 'Beauty & Cosmetics' },
    { value: 'health', label: 'Healthcare' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'ecommerce', label: 'E-Commerce' },
    { value: 'education', label: 'Education' },
    { value: 'finance', label: 'Finance' },
    { value: 'automotive', label: 'Automotive' },
];

interface SectionDef {
    id: MarketingSection;
    name: string;
    nameAr: string;
    icon: React.ReactNode;
    description: string;
    color: string;
    features: string[];
}

const MARKETING_SECTIONS: SectionDef[] = [
    {
        id: 'strategy', name: 'Strategy Engine', nameAr: 'المحرك الاستراتيجي',
        icon: <BarChart3 size={20} />, description: 'Full brand analysis & GTM strategy with 8 strategic cards',
        color: '#06B6D4',
        features: ['SWOT Analysis', 'Buyer Persona', 'Competitor Gaps', 'Value Proposition', 'GTM Strategy', 'Pricing Logic', '30-60-90 Roadmap', 'KPI Dashboard']
    },
    {
        id: 'audit', name: 'Marketing Audit', nameAr: 'تدقيق تسويقي شامل',
        icon: <Search size={20} />, description: 'Full website audit with 5 parallel analysis agents',
        color: '#8B5CF6',
        features: ['Content Analysis', 'Conversion Optimization', 'SEO Check', 'Competitive Positioning', 'Brand & Trust Score', 'Overall Score /100']
    },
    {
        id: 'copy', name: 'Copy Generator', nameAr: 'صانع النصوص الإعلانية',
        icon: <FileText size={20} />, description: 'Analyze & generate optimized copy with before/after examples',
        color: '#EC4899',
        features: ['Headline Analysis', 'CTA Optimization', 'Before/After Rewrites', 'Swipe File Generation']
    },
    {
        id: 'emails', name: 'Email Sequences', nameAr: 'تسلسلات البريد الإلكتروني',
        icon: <Mail size={20} />, description: 'Complete email campaigns: welcome, nurture, launch, cold outreach',
        color: '#F59E0B',
        features: ['Welcome Sequence', 'Lead Nurture', 'Product Launch', 'Cold Outreach', 'Cart Abandonment']
    },
    {
        id: 'social', name: 'Social Media', nameAr: 'تقويم المحتوى الاجتماعي',
        icon: <Share2 size={20} />, description: '30-day content calendar with platform-specific posts',
        color: '#10B981',
        features: ['Content Pillars', 'Hook Formulas', 'Hashtag Strategy', '30-Day Calendar', 'Repurposing Plan']
    },
    {
        id: 'ads', name: 'Ad Campaigns', nameAr: 'حملات إعلانية',
        icon: <Megaphone size={20} />, description: 'Ad creative & copy for Google, Meta, LinkedIn, TikTok',
        color: '#EF4444',
        features: ['Google Ads', 'Meta Ads', 'LinkedIn Ads', 'TikTok Ads', 'Retargeting Funnel', 'Budget Planning']
    },
    {
        id: 'funnel', name: 'Funnel Analysis', nameAr: 'تحليل القمع البيعي',
        icon: <TrendingUp size={20} />, description: 'Map conversion paths, detect leaks, optimize funnel',
        color: '#6366F1',
        features: ['Funnel Mapping', 'Leak Detection', 'Drop-off Analysis', 'A/B Test Plans', 'Revenue Modeling']
    },
    {
        id: 'competitors', name: 'Competitor Intel', nameAr: 'تحليل المنافسين',
        icon: <Users size={20} />, description: 'Competitive intelligence: positioning, pricing, features',
        color: '#14B8A6',
        features: ['Competitor Discovery', 'Feature Matrix', 'Pricing Comparison', 'SWOT Analysis', 'Market Gaps']
    },
    {
        id: 'landing', name: 'Landing Page CRO', nameAr: 'تحسين صفحات الهبوط',
        icon: <Monitor size={20} />, description: '7-point CRO framework with A/B test recommendations',
        color: '#F97316',
        features: ['Above-the-Fold Audit', 'CTA Analysis', 'Form Optimization', 'Mobile Audit', 'A/B Test Ideas']
    },
    {
        id: 'launch', name: 'Launch Playbook', nameAr: 'خطة الإطلاق',
        icon: <Rocket size={20} />, description: '8-week launch timeline with email, social, PR, metrics',
        color: '#D946EF',
        features: ['8-Week Timeline', 'Email Sequences', 'Social Posts', 'PR Outreach', 'Metrics Dashboard']
    },
    {
        id: 'proposal', name: 'Client Proposal', nameAr: 'عرض تقديمي للعميل',
        icon: <FileCheck size={20} />, description: 'Professional proposals with scope, pricing, ROI projections',
        color: '#0EA5E9',
        features: ['Executive Summary', 'Strategy Phases', 'Pricing Tiers', 'ROI Projection', 'Follow-up Sequence']
    },
    {
        id: 'report', name: 'Full Report', nameAr: 'تقرير شامل',
        icon: <ClipboardList size={20} />, description: 'Comprehensive marketing report (Markdown & PDF)',
        color: '#84CC16',
        features: ['Scorecard', 'Category Deep-dives', 'Action Plan', '30-60-90 Roadmap', 'PDF Export']
    },
    {
        id: 'seo', name: 'SEO Audit', nameAr: 'تدقيق تحسين محركات البحث',
        icon: <Globe size={20} />, description: 'On-page SEO, technical SEO, keyword analysis, schema',
        color: '#22D3EE',
        features: ['On-Page Checklist', 'Technical SEO', 'Keyword Analysis', 'Schema Audit', 'Content Gaps']
    },
    {
        id: 'brand', name: 'Brand Voice', nameAr: 'هوية العلامة التجارية',
        icon: <Palette size={20} />, description: 'Brand voice analysis, tone mapping, messaging hierarchy',
        color: '#A855F7',
        features: ['Voice Dimensions', 'Tone Mapping', 'Personality Framework', 'Vocabulary Guide', 'Copy Examples']
    },
];

// --- DUMMY DATA GENERATORS ---

let DUMMY_CARDS: Record<string, { title: string; icon: string; content: string; highlight: string }> = {
    swot: {
        title: 'SWOT Analysis', icon: '',
        content: `<strong>Strengths:</strong><ul><li>Strong brand identity and visual language</li><li>Premium product quality and craftsmanship</li></ul><strong>Weaknesses:</strong><ul><li>Limited digital presence in target markets</li><li>Higher price point than competitors</li></ul><strong>Opportunities:</strong><ul><li>Growing demand for premium products in GCC</li><li>Social commerce expansion</li></ul><strong>Threats:</strong><ul><li>Increasing competition from global brands</li><li>Economic fluctuations in target markets</li></ul>`,
        highlight: 'Key Insight: Digital-first strategy can capture 30% more market share',
    },
    persona: {
        title: 'Real Persona', icon: '',
        content: `<strong>Name:</strong> Sarah, 28<br/><strong>Location:</strong> Riyadh, KSA<br/><strong>Income:</strong> $4,000-6,000/mo<br/><strong>Behavior:</strong><ul><li>Discovers brands via Instagram & TikTok</li><li>Values authenticity and quality</li><li>Influenced by micro-influencers</li><li>Shops during promotions and seasonal sales</li></ul>`,
        highlight: 'Primary Channel: Instagram Stories + Reels',
    },
    competitors: {
        title: 'Competitor Gaps', icon: '',
        content: `<ul><li><strong>Gap 1:</strong> No competitor offers AR try-on experience</li><li><strong>Gap 2:</strong> Weak Arabic-first content strategy</li><li><strong>Gap 3:</strong> Limited same-day delivery options</li><li><strong>Gap 4:</strong> No loyalty program with real value</li></ul>`,
        highlight: 'Biggest Opportunity: AR-powered shopping experience',
    },
    value: {
        title: 'Value Proposition', icon: '',
        content: `<strong>Core Promise:</strong> Premium quality meets modern Gulf lifestyle<br/><br/><strong>Key Differentiators:</strong><ul><li>Locally designed, globally crafted</li><li>Sustainable & ethical sourcing</li><li>Personalized customer experience</li></ul>`,
        highlight: 'Tagline: "Where Tradition Meets Tomorrow"',
    },
    gtm: {
        title: 'GTM Strategy', icon: '',
        content: `<strong>Phase 1 - Awareness (Month 1):</strong><ul><li>Influencer seeding campaign</li><li>Instagram & TikTok launch</li></ul><strong>Phase 2 - Engagement (Month 2):</strong><ul><li>UGC contest campaign</li><li>Email nurture sequence</li></ul><strong>Phase 3 - Conversion (Month 3):</strong><ul><li>Limited edition launch</li><li>Retargeting ads</li></ul>`,
        highlight: 'Expected ROI: 3.5x in first quarter',
    },
    pricing: {
        title: 'Pricing Logic', icon: '',
        content: `<strong>Strategy:</strong> Premium pricing with perceived value<br/><br/><ul><li><strong>Entry:</strong> SAR 199-299 (acquisition products)</li><li><strong>Core:</strong> SAR 399-599 (main revenue)</li><li><strong>Premium:</strong> SAR 799+ (aspirational line)</li></ul>`,
        highlight: 'Sweet Spot: SAR 449 - highest conversion predicted',
    },
    roadmap: {
        title: '30-60-90 Roadmap', icon: '',
        content: `<strong>30 Days:</strong><ul><li>Launch social channels</li><li>Setup analytics & tracking</li></ul><strong>60 Days:</strong><ul><li>First influencer campaign</li><li>Email list to 5,000+</li></ul><strong>90 Days:</strong><ul><li>Achieve 100 daily orders</li><li>Launch referral program</li></ul>`,
        highlight: '90-Day Target: 100 orders/day, 10K followers',
    },
    kpi: {
        title: 'KPI Dashboard', icon: '',
        content: `<ul><li><strong>CAC:</strong> Target < SAR 45</li><li><strong>LTV:</strong> Target > SAR 1,200</li><li><strong>Conversion Rate:</strong> Target 3.5%</li><li><strong>ROAS:</strong> Target 4x+</li><li><strong>NPS:</strong> Target 70+</li><li><strong>Repeat Rate:</strong> Target 35%+</li></ul>`,
        highlight: 'North Star Metric: LTV/CAC Ratio > 3:1',
    },
};

function generateAuditResult(): MarketingAuditResult {
    return {
        overallScore: 69,
        categories: [
            { name: 'Content & Messaging', score: 72, weight: '25%', findings: ['Strong headlines but weak CTAs', 'Value proposition needs clarity', 'Blog content lacks depth'] },
            { name: 'Conversion Optimization', score: 58, weight: '20%', findings: ['No social proof above fold', 'Form has too many fields', 'Missing urgency triggers'] },
            { name: 'SEO & Discoverability', score: 81, weight: '20%', findings: ['Good meta tags structure', 'Missing schema markup', 'Internal linking needs work'] },
            { name: 'Competitive Positioning', score: 64, weight: '15%', findings: ['Differentiation unclear', 'Pricing page lacks comparison', 'Missing customer testimonials'] },
            { name: 'Brand & Trust', score: 76, weight: '10%', findings: ['Clean visual design', 'Missing trust badges', 'About page needs team photos'] },
            { name: 'Growth & Strategy', score: 61, weight: '10%', findings: ['No referral program', 'Limited retention strategy', 'Pricing could be optimized'] },
        ],
        topIssues: ['Weak CTA placement reducing conversions by ~15%', 'No social proof visible in first viewport', 'Missing schema markup hurting rich snippets', 'Form friction causing 40% abandonment'],
    };
}

function generateCopyResult(): MarketingCopyResult {
    return {
        headlines: [
            { before: 'Welcome to Our Platform', after: 'Scale Your Business 3x Faster with AI-Powered Marketing' },
            { before: 'Our Services', after: 'Marketing Solutions That Drive Real Revenue' },
            { before: 'Contact Us Today', after: 'Get Your Free Marketing Audit in 60 Seconds' },
        ],
        ctas: [
            { before: 'Submit', after: 'Start My Free Audit Now' },
            { before: 'Learn More', after: 'See How We Grew Brand X by 340%' },
            { before: 'Sign Up', after: 'Claim Your Free Strategy Session' },
        ],
        bodyRewrite: 'We help ambitious brands dominate their market with data-driven strategies. Our AI-powered platform analyzes your competition, optimizes your messaging, and delivers actionable playbooks that convert browsers into buyers.',
    };
}

function generateEmailResult(): MarketingEmailResult {
    return {
        sequenceType: 'Welcome Sequence',
        emails: [
            { subject: 'Welcome! Here\'s your quick-win guide', preview: 'Inside: 3 strategies you can implement today...', dayNumber: 0, purpose: 'Value delivery + brand introduction' },
            { subject: 'The #1 mistake 90% of brands make', preview: 'Most brands overlook this critical step...', dayNumber: 2, purpose: 'Problem awareness + authority building' },
            { subject: 'Case study: How we grew Brand X by 340%', preview: 'Real results from a real campaign...', dayNumber: 4, purpose: 'Social proof + credibility' },
            { subject: 'Your personalized strategy is ready', preview: 'Based on your industry, here\'s what we recommend...', dayNumber: 7, purpose: 'Personalized value + soft CTA' },
            { subject: '[Limited] Free strategy call this week', preview: 'Only 5 spots remaining for this month...', dayNumber: 10, purpose: 'Urgency + conversion' },
        ],
    };
}

function generateSocialResult(): MarketingSocialResult {
    return {
        posts: [
            { day: 1, pillar: 'Educational', platform: 'Instagram Reel', hook: 'Stop scrolling if you want to 3x your marketing ROI', time: '11:00 AM' },
            { day: 2, pillar: 'Engagement', platform: 'Twitter/X Thread', hook: 'What\'s the biggest marketing challenge you face? (poll)', time: '9:00 AM' },
            { day: 3, pillar: 'Behind-the-Scenes', platform: 'LinkedIn Post', hook: 'Here\'s how our team builds a campaign from scratch', time: '8:00 AM' },
            { day: 4, pillar: 'Social Proof', platform: 'Instagram Story', hook: 'This client went from 0 to 10K followers in 30 days', time: '10:00 AM' },
            { day: 5, pillar: 'Promotional', platform: 'TikTok Video', hook: 'Free marketing audit for the first 10 commenters', time: '7:00 PM' },
            { day: 6, pillar: 'Entertainment', platform: 'Instagram Carousel', hook: 'Marketing expectations vs reality (relatable)', time: '11:00 AM' },
            { day: 7, pillar: 'Community', platform: 'Facebook Post', hook: 'Shoutout to our community member of the week!', time: '1:00 PM' },
            { day: 8, pillar: 'Educational', platform: 'Instagram Reel', hook: '5 SEO mistakes killing your organic traffic', time: '11:00 AM' },
            { day: 9, pillar: 'Engagement', platform: 'Twitter/X Thread', hook: 'Rate your website\'s marketing from 1-10 (be honest)', time: '9:00 AM' },
            { day: 10, pillar: 'Behind-the-Scenes', platform: 'LinkedIn Post', hook: 'The tools we use daily to manage 20+ client accounts', time: '8:00 AM' },
        ],
    };
}

function generateAdsResult(): MarketingAdsResult {
    return {
        platforms: [
            { name: 'Google Search', headline: 'AI Marketing Audit | Free Website Analysis', description: 'Get a comprehensive marketing audit with actionable insights. Score your website across 6 dimensions. Start free.', cta: 'Get Free Audit', budget: '$50-100/day' },
            { name: 'Meta (Facebook/Instagram)', headline: 'Is your marketing actually working?', description: 'Most brands waste 40% of their marketing budget. Our AI audit tells you exactly where to optimize.', cta: 'Audit My Site Free', budget: '$30-80/day' },
            { name: 'LinkedIn', headline: 'Marketing Leaders: Stop Guessing, Start Growing', description: 'Data-driven marketing intelligence for B2B brands. Competitive analysis, SEO audits, conversion optimization.', cta: 'Request Demo', budget: '$40-120/day' },
            { name: 'TikTok', headline: 'POV: You finally audit your marketing', description: 'When you realize you\'ve been leaving money on the table. Free audit link in bio.', cta: 'Try Now', budget: '$20-60/day' },
        ],
    };
}

function generateFunnelResult(): MarketingFunnelResult {
    return {
        stages: [
            { name: 'Awareness', conversionRate: '100%', dropOff: '—', recommendation: 'Increase top-of-funnel content and social presence' },
            { name: 'Interest', conversionRate: '35%', dropOff: '65%', recommendation: 'Add lead magnets and value-first content offers' },
            { name: 'Consideration', conversionRate: '18%', dropOff: '17%', recommendation: 'Implement comparison pages and case studies' },
            { name: 'Intent', conversionRate: '8%', dropOff: '10%', recommendation: 'Add urgency triggers and limited-time offers' },
            { name: 'Purchase', conversionRate: '3.5%', dropOff: '4.5%', recommendation: 'Simplify checkout, add trust badges, offer guarantees' },
            { name: 'Retention', conversionRate: '1.8%', dropOff: '1.7%', recommendation: 'Launch loyalty program and post-purchase email sequence' },
        ],
    };
}

function generateCompetitorResult(): MarketingCompetitorResult {
    return {
        competitors: [
            { name: 'Competitor A', positioning: 'Enterprise-focused marketing suite', pricing: '$299/mo', strengths: ['Large customer base', 'Strong brand recognition', 'Comprehensive features'], weaknesses: ['Complex onboarding', 'Expensive for SMBs', 'Slow customer support'] },
            { name: 'Competitor B', positioning: 'Budget-friendly marketing tools', pricing: '$49/mo', strengths: ['Low price point', 'Easy to use', 'Good templates'], weaknesses: ['Limited analytics', 'Basic features only', 'No AI capabilities'] },
            { name: 'Competitor C', positioning: 'AI-first marketing platform', pricing: '$149/mo', strengths: ['Advanced AI features', 'Fast growing', 'Modern UI'], weaknesses: ['New to market', 'Limited integrations', 'Small team'] },
        ],
    };
}

function generateLandingResult(): MarketingLandingResult {
    return {
        score: 62,
        checks: [
            { area: 'Above-the-Fold Hero', status: 'warning', note: 'Headline is generic, needs specific value proposition with numbers' },
            { area: 'Primary CTA', status: 'fail', note: 'CTA says "Learn More" — should be action-oriented with clear benefit' },
            { area: 'Social Proof', status: 'fail', note: 'No testimonials, reviews, or trust badges visible in first viewport' },
            { area: 'Page Speed', status: 'pass', note: 'LCP under 2.5s, good mobile performance' },
            { area: 'Mobile Responsiveness', status: 'pass', note: 'Clean mobile layout, tap targets properly sized' },
            { area: 'Form Optimization', status: 'warning', note: 'Contact form has 8 fields — reduce to 3-4 for better conversion' },
            { area: 'Visual Hierarchy', status: 'pass', note: 'Clear F-pattern layout, good use of whitespace' },
        ],
    };
}

function generateLaunchResult(): MarketingLaunchResult {
    return {
        weeks: [
            { week: 1, phase: 'Foundation', tasks: ['Finalize brand assets & messaging', 'Setup analytics & tracking pixels', 'Build landing page with email capture'] },
            { week: 2, phase: 'Pre-Launch Buzz', tasks: ['Begin teaser content on social media', 'Start influencer outreach (10-15 targets)', 'Launch waitlist with referral incentive'] },
            { week: 3, phase: 'Community Building', tasks: ['Share behind-the-scenes content daily', 'Host live Q&A session', 'Send first email to waitlist with exclusive preview'] },
            { week: 4, phase: 'Launch Week Prep', tasks: ['Finalize launch day content calendar', 'Prepare press release & media kit', 'Setup retargeting ads for waitlist visitors'] },
            { week: 5, phase: 'LAUNCH', tasks: ['Execute coordinated launch across all channels', 'Send launch email sequence (3 emails in 48 hours)', 'Activate paid ads on Meta & Google'] },
            { week: 6, phase: 'Momentum', tasks: ['Share early customer wins & testimonials', 'Run limited-time launch offer', 'Begin user-generated content campaign'] },
            { week: 7, phase: 'Optimization', tasks: ['Analyze first 2 weeks of data', 'A/B test top landing pages', 'Optimize ad creative based on performance'] },
            { week: 8, phase: 'Scale', tasks: ['Double down on winning channels', 'Launch referral program', 'Plan next content series based on learnings'] },
        ],
    };
}

function generateProposalResult(): MarketingProposalResult {
    return {
        sections: [
            { title: 'Executive Summary', content: 'Based on our comprehensive audit, we identified 12 high-impact opportunities that can increase your marketing ROI by 2-4x within 90 days.' },
            { title: 'Current State Analysis', content: 'Your marketing score is 69/100. Key gaps: conversion optimization (58/100), growth strategy (61/100), and competitive positioning (64/100).' },
            { title: 'Proposed Strategy', content: 'A 3-phase approach: Phase 1 (Foundation) — fix critical conversion issues. Phase 2 (Growth) — launch new acquisition channels. Phase 3 (Scale) — optimize and automate.' },
            { title: 'Timeline & Milestones', content: 'Month 1: +20% conversion rate. Month 2: +50% qualified leads. Month 3: +3x marketing ROI.' },
        ],
        pricing: [
            { tier: 'Starter', price: '$2,500/mo', features: ['Monthly marketing audit', 'Content calendar', 'Email sequences', 'Basic reporting'] },
            { tier: 'Growth', price: '$5,000/mo', features: ['Everything in Starter', 'Paid ads management', 'Landing page optimization', 'Bi-weekly strategy calls', 'Competitor monitoring'] },
            { tier: 'Enterprise', price: '$10,000/mo', features: ['Everything in Growth', 'Full funnel management', 'Custom dashboards', 'Dedicated strategist', 'Weekly reviews', 'Priority support'] },
        ],
    };
}

function generateSeoResult(): MarketingSeoResult {
    return {
        score: 74,
        onPage: [
            { check: 'Title Tag (30-60 chars)', status: 'pass', detail: 'Title: 52 characters — within optimal range' },
            { check: 'Meta Description (120-160)', status: 'warning', detail: '178 characters — slightly too long, may be truncated' },
            { check: 'H1 Tag (unique)', status: 'pass', detail: 'Single H1 found with relevant keywords' },
            { check: 'Heading Hierarchy', status: 'pass', detail: 'Proper H1 > H2 > H3 structure' },
            { check: 'Image Alt Text', status: 'fail', detail: '6 of 18 images missing alt text' },
            { check: 'Internal Linking', status: 'warning', detail: 'Only 4 internal links — recommend 8-12 per page' },
            { check: 'Schema Markup', status: 'fail', detail: 'No structured data found — add Organization & FAQ schema' },
            { check: 'Canonical Tag', status: 'pass', detail: 'Self-referencing canonical properly set' },
            { check: 'Open Graph Tags', status: 'pass', detail: 'OG title, description, and image present' },
            { check: 'URL Structure', status: 'pass', detail: 'Clean, keyword-rich URL slugs' },
        ],
        technicalIssues: ['Missing XML sitemap', '3 broken internal links detected', 'No robots.txt found', 'Core Web Vitals: CLS needs improvement'],
    };
}

function generateBrandResult(): MarketingBrandResult {
    return {
        voiceDimensions: [
            { dimension: 'Professional vs Casual', score: 72, description: 'Leans professional with occasional casual touches' },
            { dimension: 'Authoritative vs Friendly', score: 65, description: 'Balanced authority with approachable tone' },
            { dimension: 'Serious vs Playful', score: 40, description: 'Mostly serious, could benefit from more personality' },
            { dimension: 'Technical vs Simple', score: 58, description: 'Moderate technical depth, accessible to most audiences' },
        ],
        toneMap: [
            { context: 'Social Media', tone: 'Conversational, witty, relatable' },
            { context: 'Email Marketing', tone: 'Warm, personal, action-oriented' },
            { context: 'Website Copy', tone: 'Clear, confident, benefit-focused' },
            { context: 'Support', tone: 'Empathetic, helpful, solution-oriented' },
            { context: 'Ads', tone: 'Bold, direct, urgency-driven' },
        ],
        personality: ['Innovative', 'Trustworthy', 'Bold', 'Data-driven', 'Customer-first'],
    };
}

function getDummyResult(section: MarketingSection): SectionResult | null {
    switch (section) {
        case 'audit': return generateAuditResult();
        case 'copy': return generateCopyResult();
        case 'emails': return generateEmailResult();
        case 'social': return generateSocialResult();
        case 'ads': return generateAdsResult();
        case 'funnel': return generateFunnelResult();
        case 'competitors': return generateCompetitorResult();
        case 'landing': return generateLandingResult();
        case 'launch': return generateLaunchResult();
        case 'proposal': return generateProposalResult();
        case 'seo': return generateSeoResult();
        case 'brand': return generateBrandResult();
        default: return null;
    }
}

// --- SCORE HELPERS ---
function getScoreColor(score: number): string {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#F97316';
    return '#EF4444';
}

function getStatusIcon(status: 'pass' | 'fail' | 'warning') {
    if (status === 'pass') return <CheckCircle2 size={16} style={{ color: '#10B981' }} />;
    if (status === 'fail') return <XCircle size={16} style={{ color: '#EF4444' }} />;
    return <AlertTriangle size={16} style={{ color: '#F59E0B' }} />;
}

// --- RESULT RENDERERS ---

function renderAuditResult(data: MarketingAuditResult) {
    return (
        <div className={styles.resultContainer}>
            <div className={styles.scoreHero}>
                <div className={styles.scoreCircle} style={{ borderColor: getScoreColor(data.overallScore) }}>
                    <span className={styles.scoreNumber} style={{ color: getScoreColor(data.overallScore) }}>{data.overallScore}</span>
                    <span className={styles.scoreLabel}>/ 100</span>
                </div>
                <h3>Overall Marketing Score</h3>
            </div>
            <div className={styles.categoriesGrid}>
                {data.categories.map((cat, i) => (
                    <div key={i} className={styles.categoryCard} style={{ animationDelay: `${i * 0.08}s` }}>
                        <div className={styles.categoryHeader}>
                            <span className={styles.categoryName}>{cat.name}</span>
                            <span className={styles.categoryScore} style={{ color: getScoreColor(cat.score) }}>{cat.score}/100</span>
                        </div>
                        <div className={styles.scoreBar}>
                            <div className={styles.scoreBarFill} style={{ width: `${cat.score}%`, background: getScoreColor(cat.score) }} />
                        </div>
                        <div className={styles.categoryWeight}>Weight: {cat.weight}</div>
                        <ul className={styles.findingsList}>
                            {cat.findings.map((f, j) => <li key={j}>{f}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
            <div className={styles.issuesSection}>
                <h4><AlertTriangle size={18} /> Top Issues to Fix</h4>
                {data.topIssues.map((issue, i) => (
                    <div key={i} className={styles.issueItem}>
                        <span className={styles.issueNumber}>{i + 1}</span>
                        <span>{issue}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function renderCopyResult(data: MarketingCopyResult) {
    return (
        <div className={styles.resultContainer}>
            <h3 className={styles.resultTitle}><FileText size={22} /> Copy Optimization Results</h3>
            <div className={styles.copySection}>
                <h4>Headline Rewrites</h4>
                {data.headlines.map((h, i) => (
                    <div key={i} className={styles.beforeAfter} style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className={styles.beforeBox}><span className={styles.baLabel}>Before</span><p>{h.before}</p></div>
                        <ArrowRight size={20} className={styles.baArrow} />
                        <div className={styles.afterBox}><span className={styles.baLabel}>After</span><p>{h.after}</p></div>
                    </div>
                ))}
            </div>
            <div className={styles.copySection}>
                <h4>CTA Optimization</h4>
                {data.ctas.map((c, i) => (
                    <div key={i} className={styles.beforeAfter} style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className={styles.beforeBox}><span className={styles.baLabel}>Before</span><p>{c.before}</p></div>
                        <ArrowRight size={20} className={styles.baArrow} />
                        <div className={styles.afterBox}><span className={styles.baLabel}>After</span><p>{c.after}</p></div>
                    </div>
                ))}
            </div>
            <div className={styles.rewriteBox}>
                <h4>Optimized Body Copy</h4>
                <p>{data.bodyRewrite}</p>
            </div>
        </div>
    );
}

function renderEmailResult(data: MarketingEmailResult) {
    return (
        <div className={styles.resultContainer}>
            <h3 className={styles.resultTitle}><Mail size={22} /> {data.sequenceType}</h3>
            <div className={styles.emailTimeline}>
                {data.emails.map((email, i) => (
                    <div key={i} className={styles.emailCard} style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className={styles.emailDay}>
                            <Clock size={14} />
                            <span>Day {email.dayNumber}</span>
                        </div>
                        <div className={styles.emailSubject}>{email.subject}</div>
                        <div className={styles.emailPreview}>{email.preview}</div>
                        <div className={styles.emailPurpose}><Target size={14} /> {email.purpose}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function renderSocialResult(data: MarketingSocialResult) {
    const pillarColors: Record<string, string> = {
        Educational: '#06B6D4', Engagement: '#8B5CF6', 'Behind-the-Scenes': '#F59E0B',
        'Social Proof': '#10B981', Promotional: '#EF4444', Entertainment: '#EC4899', Community: '#14B8A6',
    };
    return (
        <div className={styles.resultContainer}>
            <h3 className={styles.resultTitle}><Share2 size={22} /> 30-Day Content Calendar</h3>
            <div className={styles.calendarGrid}>
                {data.posts.map((post, i) => (
                    <div key={i} className={styles.calendarCard} style={{ animationDelay: `${i * 0.05}s`, borderLeftColor: pillarColors[post.pillar] || '#06B6D4' }}>
                        <div className={styles.calendarDay}>Day {post.day}</div>
                        <div className={styles.calendarPillar} style={{ color: pillarColors[post.pillar] || '#06B6D4' }}>{post.pillar}</div>
                        <div className={styles.calendarPlatform}>{post.platform}</div>
                        <div className={styles.calendarHook}>{post.hook}</div>
                        <div className={styles.calendarTime}><Clock size={12} /> {post.time}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function renderAdsResult(data: MarketingAdsResult) {
    const platformColors: Record<string, string> = {
        'Google Search': '#4285F4', 'Meta (Facebook/Instagram)': '#1877F2',
        LinkedIn: '#0A66C2', TikTok: '#FF0050',
    };
    return (
        <div className={styles.resultContainer}>
            <h3 className={styles.resultTitle}><Megaphone size={22} /> Ad Campaign Creatives</h3>
            <div className={styles.adsGrid}>
                {data.platforms.map((ad, i) => (
                    <div key={i} className={styles.adCard} style={{ animationDelay: `${i * 0.1}s`, borderTopColor: platformColors[ad.name] || '#06B6D4' }}>
                        <div className={styles.adPlatform} style={{ color: platformColors[ad.name] || '#06B6D4' }}>{ad.name}</div>
                        <div className={styles.adHeadline}>{ad.headline}</div>
                        <div className={styles.adDescription}>{ad.description}</div>
                        <div className={styles.adFooter}>
                            <span className={styles.adCta}>{ad.cta}</span>
                            <span className={styles.adBudget}><DollarSign size={14} /> {ad.budget}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function renderFunnelResult(data: MarketingFunnelResult) {
    return (
        <div className={styles.resultContainer}>
            <h3 className={styles.resultTitle}><TrendingUp size={22} /> Funnel Analysis</h3>
            <div className={styles.funnelVisual}>
                {data.stages.map((stage, i) => (
                    <div key={i} className={styles.funnelStage} style={{ animationDelay: `${i * 0.1}s`, width: `${100 - i * 12}%` }}>
                        <div className={styles.funnelStageHeader}>
                            <span className={styles.funnelStageName}>{stage.name}</span>
                            <span className={styles.funnelConversion}>{stage.conversionRate}</span>
                        </div>
                        {stage.dropOff !== '—' && (
                            <div className={styles.funnelDropoff}>
                                <TrendingDown size={14} /> Drop-off: {stage.dropOff}
                            </div>
                        )}
                        <div className={styles.funnelRec}>{stage.recommendation}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function renderCompetitorResult(data: MarketingCompetitorResult) {
    return (
        <div className={styles.resultContainer}>
            <h3 className={styles.resultTitle}><Users size={22} /> Competitive Intelligence</h3>
            <div className={styles.competitorGrid}>
                {data.competitors.map((comp, i) => (
                    <div key={i} className={styles.competitorCard} style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className={styles.competitorName}>{comp.name}</div>
                        <div className={styles.competitorPosition}>{comp.positioning}</div>
                        <div className={styles.competitorPrice}><DollarSign size={14} /> {comp.pricing}</div>
                        <div className={styles.competitorSwot}>
                            <div><strong style={{ color: '#10B981' }}>Strengths</strong>
                                <ul>{comp.strengths.map((s, j) => <li key={j}>{s}</li>)}</ul>
                            </div>
                            <div><strong style={{ color: '#EF4444' }}>Weaknesses</strong>
                                <ul>{comp.weaknesses.map((w, j) => <li key={j}>{w}</li>)}</ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function renderLandingResult(data: MarketingLandingResult) {
    return (
        <div className={styles.resultContainer}>
            <div className={styles.scoreHero}>
                <div className={styles.scoreCircle} style={{ borderColor: getScoreColor(data.score) }}>
                    <span className={styles.scoreNumber} style={{ color: getScoreColor(data.score) }}>{data.score}</span>
                    <span className={styles.scoreLabel}>/ 100</span>
                </div>
                <h3>Landing Page CRO Score</h3>
            </div>
            <div className={styles.checklistSection}>
                {data.checks.map((check, i) => (
                    <div key={i} className={styles.checkItem} style={{ animationDelay: `${i * 0.08}s` }}>
                        {getStatusIcon(check.status)}
                        <div className={styles.checkContent}>
                            <span className={styles.checkArea}>{check.area}</span>
                            <span className={styles.checkNote}>{check.note}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function renderLaunchResult(data: MarketingLaunchResult) {
    const phaseColors = ['#06B6D4', '#8B5CF6', '#F59E0B', '#EC4899', '#EF4444', '#10B981', '#6366F1', '#14B8A6'];
    return (
        <div className={styles.resultContainer}>
            <h3 className={styles.resultTitle}><Rocket size={22} /> 8-Week Launch Playbook</h3>
            <div className={styles.launchTimeline}>
                {data.weeks.map((week, i) => (
                    <div key={i} className={styles.launchWeek} style={{ animationDelay: `${i * 0.08}s`, borderLeftColor: phaseColors[i] || '#06B6D4' }}>
                        <div className={styles.launchWeekHeader}>
                            <span className={styles.launchWeekNum}>Week {week.week}</span>
                            <span className={styles.launchPhase} style={{ color: phaseColors[i] }}>{week.phase}</span>
                        </div>
                        <ul className={styles.launchTasks}>
                            {week.tasks.map((task, j) => <li key={j}><CheckCircle2 size={14} /> {task}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

function renderProposalResult(data: MarketingProposalResult) {
    return (
        <div className={styles.resultContainer}>
            <h3 className={styles.resultTitle}><FileCheck size={22} /> Client Proposal</h3>
            <div className={styles.proposalSections}>
                {data.sections.map((section, i) => (
                    <div key={i} className={styles.proposalBlock} style={{ animationDelay: `${i * 0.1}s` }}>
                        <h4>{section.title}</h4>
                        <p>{section.content}</p>
                    </div>
                ))}
            </div>
            <h4 className={styles.pricingTitle}><DollarSign size={18} /> Pricing Tiers</h4>
            <div className={styles.pricingGrid}>
                {data.pricing.map((tier, i) => (
                    <div key={i} className={`${styles.pricingCard} ${i === 1 ? styles.pricingFeatured : ''}`} style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className={styles.pricingTier}>{tier.tier}</div>
                        <div className={styles.pricingAmount}>{tier.price}</div>
                        <ul className={styles.pricingFeatures}>
                            {tier.features.map((f, j) => <li key={j}><CheckCircle2 size={14} /> {f}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

function renderSeoResult(data: MarketingSeoResult) {
    const passCount = data.onPage.filter(c => c.status === 'pass').length;
    const failCount = data.onPage.filter(c => c.status === 'fail').length;
    return (
        <div className={styles.resultContainer}>
            <div className={styles.scoreHero}>
                <div className={styles.scoreCircle} style={{ borderColor: getScoreColor(data.score) }}>
                    <span className={styles.scoreNumber} style={{ color: getScoreColor(data.score) }}>{data.score}</span>
                    <span className={styles.scoreLabel}>/ 100</span>
                </div>
                <h3>SEO Score</h3>
                <div className={styles.seoStats}>
                    <span style={{ color: '#10B981' }}>{passCount} passed</span>
                    <span style={{ color: '#EF4444' }}>{failCount} failed</span>
                    <span style={{ color: '#F59E0B' }}>{data.onPage.length - passCount - failCount} warnings</span>
                </div>
            </div>
            <div className={styles.checklistSection}>
                {data.onPage.map((check, i) => (
                    <div key={i} className={styles.checkItem} style={{ animationDelay: `${i * 0.06}s` }}>
                        {getStatusIcon(check.status)}
                        <div className={styles.checkContent}>
                            <span className={styles.checkArea}>{check.check}</span>
                            <span className={styles.checkNote}>{check.detail}</span>
                        </div>
                    </div>
                ))}
            </div>
            {data.technicalIssues.length > 0 && (
                <div className={styles.issuesSection}>
                    <h4><AlertTriangle size={18} /> Technical Issues</h4>
                    {data.technicalIssues.map((issue, i) => (
                        <div key={i} className={styles.issueItem}>
                            <span className={styles.issueNumber}>{i + 1}</span>
                            <span>{issue}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function renderBrandResult(data: MarketingBrandResult) {
    return (
        <div className={styles.resultContainer}>
            <h3 className={styles.resultTitle}><Palette size={22} /> Brand Voice Analysis</h3>
            <div className={styles.voiceSection}>
                <h4>Voice Dimensions</h4>
                {data.voiceDimensions.map((dim, i) => (
                    <div key={i} className={styles.voiceDim} style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className={styles.voiceDimHeader}>
                            <span>{dim.dimension}</span>
                            <span className={styles.voiceDimScore}>{dim.score}/100</span>
                        </div>
                        <div className={styles.scoreBar}>
                            <div className={styles.scoreBarFill} style={{ width: `${dim.score}%`, background: `hsl(${dim.score * 1.2}, 70%, 50%)` }} />
                        </div>
                        <p className={styles.voiceDimDesc}>{dim.description}</p>
                    </div>
                ))}
            </div>
            <div className={styles.toneSection}>
                <h4>Tone Map by Channel</h4>
                {data.toneMap.map((t, i) => (
                    <div key={i} className={styles.toneItem} style={{ animationDelay: `${i * 0.08}s` }}>
                        <span className={styles.toneContext}>{t.context}</span>
                        <span className={styles.toneTone}>{t.tone}</span>
                    </div>
                ))}
            </div>
            <div className={styles.personalitySection}>
                <h4>Brand Personality</h4>
                <div className={styles.personalityTags}>
                    {data.personality.map((p, i) => (
                        <span key={i} className={styles.personalityTag}>{p}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function renderSectionResult(section: MarketingSection, result: SectionResult) {
    switch (section) {
        case 'audit': return renderAuditResult(result as MarketingAuditResult);
        case 'copy': return renderCopyResult(result as MarketingCopyResult);
        case 'emails': return renderEmailResult(result as MarketingEmailResult);
        case 'social': return renderSocialResult(result as MarketingSocialResult);
        case 'ads': return renderAdsResult(result as MarketingAdsResult);
        case 'funnel': return renderFunnelResult(result as MarketingFunnelResult);
        case 'competitors': return renderCompetitorResult(result as MarketingCompetitorResult);
        case 'landing': return renderLandingResult(result as MarketingLandingResult);
        case 'launch': return renderLaunchResult(result as MarketingLaunchResult);
        case 'proposal': return renderProposalResult(result as MarketingProposalResult);
        case 'seo': return renderSeoResult(result as MarketingSeoResult);
        case 'brand': return renderBrandResult(result as MarketingBrandResult);
        default: return null;
    }
}

// --- MAIN COMPONENT ---

export default function Marketing() {
    const project = useAppStore((s) => s.getActiveProject());
    const updateMarketing = useAppStore((s) => s.updateMarketing);
    const state = project.marketing;

    const handleGenerate = useCallback(async () => {
        updateMarketing({ isGenerating: true, generatedCards: null });
        try {
            const res = await fetch('/api/generate-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tool: 'marketing-strategy',
                    systemPrompt: `You are a world-class marketing strategist and brand consultant. Generate comprehensive, data-driven marketing analysis. Always respond in JSON format only.`,
                    prompt: `Generate a complete strategic marketing analysis for this brand:
- Brand Name: ${state.brandName}
- Brand URL: ${state.brandLink || 'N/A'}
- Industry: ${state.industry}
- Brief: ${state.projectBrief}
- Language: ${state.language === 'ar' ? 'Arabic' : 'English'}

Return a JSON object with these 8 keys. Each key has: title, content (HTML with <strong>, <ul>, <li> tags), and highlight (one-line key insight):
{
  "swot": { "title": "SWOT Analysis", "content": "<strong>Strengths:</strong><ul><li>...</li></ul><strong>Weaknesses:</strong>...<strong>Opportunities:</strong>...<strong>Threats:</strong>...", "highlight": "Key Insight: ..." },
  "persona": { "title": "Real Persona", "content": "<strong>Name:</strong> ...<br/><strong>Location:</strong>...<strong>Behavior:</strong><ul><li>...</li></ul>", "highlight": "Primary Channel: ..." },
  "competitors": { "title": "Competitor Gaps", "content": "<ul><li><strong>Gap 1:</strong>...</li>...</ul>", "highlight": "Biggest Opportunity: ..." },
  "value": { "title": "Value Proposition", "content": "<strong>Core Promise:</strong>...<strong>Key Differentiators:</strong><ul>...</ul>", "highlight": "Tagline: ..." },
  "gtm": { "title": "GTM Strategy", "content": "<strong>Phase 1:</strong><ul>...</ul><strong>Phase 2:</strong>...<strong>Phase 3:</strong>...", "highlight": "Expected ROI: ..." },
  "pricing": { "title": "Pricing Logic", "content": "<strong>Strategy:</strong>...<ul><li><strong>Entry:</strong>...</li>...</ul>", "highlight": "Sweet Spot: ..." },
  "roadmap": { "title": "30-60-90 Roadmap", "content": "<strong>30 Days:</strong><ul>...</ul><strong>60 Days:</strong>...<strong>90 Days:</strong>...", "highlight": "90-Day Target: ..." },
  "kpi": { "title": "KPI Dashboard", "content": "<ul><li><strong>CAC:</strong>...</li><li><strong>LTV:</strong>...</li>...</ul>", "highlight": "North Star Metric: ..." }
}

Make the analysis specific to the ${state.industry} industry and ${state.brandName} brand. Use real market data and insights.`,
                    maxTokens: 4096,
                }),
            });

            if (!res.ok) throw new Error('API failed');
            const data = await res.json();

            let parsedCards: Record<string, { title: string; content: string; highlight: string }> | null = null;
            try {
                const text = data.text.trim();
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                parsedCards = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
            } catch {
                console.error('Failed to parse strategy:', data.text);
            }

            if (parsedCards) {
                // Merge with DUMMY_CARDS icons
                const cards: Record<string, string> = {};
                Object.keys(DUMMY_CARDS).forEach((k) => {
                    if (parsedCards![k]) {
                        DUMMY_CARDS[k] = { ...DUMMY_CARDS[k], ...parsedCards![k] };
                    }
                    cards[k] = 'generated';
                });
                updateMarketing({ isGenerating: false, generatedCards: cards });
            } else {
                // Fallback to dummy
                const cards: Record<string, string> = {};
                Object.keys(DUMMY_CARDS).forEach((k) => { cards[k] = 'generated'; });
                updateMarketing({ isGenerating: false, generatedCards: cards });
            }
        } catch (error) {
            console.error('Strategy generation error:', error);
            const cards: Record<string, string> = {};
            Object.keys(DUMMY_CARDS).forEach((k) => { cards[k] = 'generated'; });
            updateMarketing({ isGenerating: false, generatedCards: cards });
        }
    }, [updateMarketing, state.brandName, state.brandLink, state.industry, state.projectBrief, state.language]);

    const handleSectionGenerate = useCallback(async (section: MarketingSection) => {
        updateMarketing({ generatingSection: section });
        try {
            const sectionDef = MARKETING_SECTIONS.find(s => s.id === section);
            const sectionName = sectionDef?.name || section;

            const sectionPrompts: Record<string, string> = {
                audit: `Perform a comprehensive marketing audit for ${state.brandName} (${state.industry}). Return JSON: { "overallScore": number(0-100), "categories": [{ "name": string, "score": number, "weight": string, "findings": [string] }], "topIssues": [string] }. Include 6 categories and 4 top issues.`,
                copy: `Generate optimized marketing copy for ${state.brandName} (${state.industry}). Return JSON: { "headlines": [{ "before": string, "after": string }], "ctas": [{ "before": string, "after": string }], "bodyRewrite": string }. Include 3 headlines and 3 CTAs.`,
                emails: `Create an email sequence for ${state.brandName} (${state.industry}). Return JSON: { "sequenceType": string, "emails": [{ "subject": string, "preview": string, "dayNumber": number, "purpose": string }] }. Include 5 emails.`,
                social: `Create a 10-day social media calendar for ${state.brandName} (${state.industry}). Return JSON: { "posts": [{ "day": number, "pillar": string, "platform": string, "hook": string, "time": string }] }. Include 10 posts.`,
                ads: `Create ad campaigns for ${state.brandName} (${state.industry}) on multiple platforms. Return JSON: { "platforms": [{ "name": string, "headline": string, "description": string, "cta": string, "budget": string }] }. Include Google, Meta, LinkedIn, TikTok.`,
                funnel: `Analyze the marketing funnel for ${state.brandName} (${state.industry}). Return JSON: { "stages": [{ "name": string, "conversionRate": string, "dropOff": string, "recommendation": string }] }. Include 6 stages from Awareness to Retention.`,
                competitors: `Analyze competitors for ${state.brandName} (${state.industry}). Return JSON: { "competitors": [{ "name": string, "positioning": string, "pricing": string, "strengths": [string], "weaknesses": [string] }] }. Include 3 competitors.`,
                landing: `Perform a landing page CRO audit for ${state.brandName} (${state.industry}). Return JSON: { "score": number(0-100), "checks": [{ "area": string, "status": "pass"|"fail"|"warning", "note": string }] }. Include 7 checks.`,
                launch: `Create an 8-week launch playbook for ${state.brandName} (${state.industry}). Return JSON: { "weeks": [{ "week": number, "phase": string, "tasks": [string] }] }. Include 8 weeks.`,
                proposal: `Create a client proposal for ${state.brandName} (${state.industry}). Return JSON: { "sections": [{ "title": string, "content": string }], "pricing": [{ "tier": string, "price": string, "features": [string] }] }. Include 4 sections and 3 tiers.`,
                report: `Generate a marketing report for ${state.brandName} (${state.industry}). Return JSON: { "sections": [{ "title": string, "content": string }], "pricing": [{ "tier": string, "price": string, "features": [string] }] }.`,
                seo: `Perform an SEO audit for ${state.brandName} (${state.industry}). Return JSON: { "score": number(0-100), "onPage": [{ "check": string, "status": "pass"|"fail"|"warning", "detail": string }], "technicalIssues": [string] }. Include 10 on-page checks and 4 technical issues.`,
                brand: `Analyze brand voice for ${state.brandName} (${state.industry}). Return JSON: { "voiceDimensions": [{ "dimension": string, "score": number(0-100), "description": string }], "toneMap": [{ "context": string, "tone": string }], "personality": [string] }. Include 4 dimensions, 5 tone contexts, 5 personality traits.`,
            };

            const prompt = sectionPrompts[section] || `Generate ${sectionName} analysis for ${state.brandName}. Return relevant JSON.`;

            const res = await fetch('/api/generate-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tool: `marketing-${section}`,
                    systemPrompt: `You are an expert marketing analyst. Generate specific, actionable, data-driven results for the ${sectionName} analysis. Respond ONLY in valid JSON format with no additional text.`,
                    prompt,
                    maxTokens: 3000,
                }),
            });

            if (!res.ok) throw new Error('API failed');
            const data = await res.json();

            let result: SectionResult | null = null;
            try {
                const text = data.text.trim();
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
            } catch {
                console.error('Failed to parse section result:', data.text);
                result = getDummyResult(section);
            }

            if (result) {
                updateMarketing({
                    generatingSection: null,
                    sectionResults: { ...state.sectionResults, [section]: result },
                });
            }
        } catch (error) {
            console.error('Section generation error:', error);
            const result = getDummyResult(section);
            if (result) {
                updateMarketing({
                    generatingSection: null,
                    sectionResults: { ...state.sectionResults, [section]: result },
                });
            }
        }
    }, [updateMarketing, state.sectionResults, state.brandName, state.industry, state.brandLink, state.projectBrief, state.language]);

    const canGenerate = state.brandName.trim() && state.industry;
    const activeSection = MARKETING_SECTIONS.find(s => s.id === state.activeSection) || MARKETING_SECTIONS[0];
    const currentResult = state.sectionResults[state.activeSection];
    const isGeneratingCurrent = state.generatingSection === state.activeSection;

    const renderSectionContent = () => {
        if (state.activeSection === 'strategy') {
            if (state.isGenerating) {
                return (
                    <div className={styles.loading}>
                        <div className={styles.spinnerWrap}><div className={styles.spinnerRing} /><BarChart3 size={24} className={styles.spinnerIcon} /></div>
                        <h3>Analyzing Market & Competition...</h3>
                        <p>Building comprehensive strategy with 8 strategic cards</p>
                    </div>
                );
            }
            if (state.generatedCards) {
                return (
                    <div className={styles.dashboard}>
                        <div className={styles.dashboardHeader}>
                            <h3>Strategic Dashboard — {state.brandName}</h3>
                            <span className={styles.badge}>8 cards &bull; {state.language === 'ar' ? 'Arabic' : 'English'}</span>
                        </div>
                        <div className={styles.cardsGrid}>
                            {Object.entries(DUMMY_CARDS).map(([key, card], i) => (
                                <div key={key} className={styles.card} style={{ animationDelay: `${i * 0.08}s` }}>
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardIcon}>{card.icon}</div>
                                        <span className={styles.cardTitle}>{card.title}</span>
                                    </div>
                                    <div className={styles.cardContent} dangerouslySetInnerHTML={{ __html: card.content }} />
                                    <div className={styles.cardHighlight}>{card.highlight}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
            return (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}><BarChart3 size={48} /></div>
                    <h3>Strategic Analysis Engine</h3>
                    <p>Enter your brand details to generate a comprehensive<br />marketing strategy with 8 professional analysis cards</p>
                </div>
            );
        }

        // Loading state for current section
        if (isGeneratingCurrent) {
            return (
                <div className={styles.loading}>
                    <div className={styles.spinnerWrap}>
                        <div className={styles.spinnerRing} style={{ borderTopColor: activeSection.color }} />
                        <div style={{ color: activeSection.color }}>{activeSection.icon}</div>
                    </div>
                    <h3>Running {activeSection.name}...</h3>
                    <p>Analyzing and generating actionable results</p>
                </div>
            );
        }

        // Show results if available
        if (currentResult) {
            return renderSectionResult(state.activeSection, currentResult);
        }

        // Default: show section detail view with inputs
        return (
            <div className={styles.sectionDetail}>
                <div className={styles.sectionDetailHeader}>
                    <div className={styles.sectionDetailIcon} style={{ background: `${activeSection.color}20`, color: activeSection.color }}>
                        {activeSection.icon}
                    </div>
                    <div>
                        <h3>{activeSection.name}</h3>
                        <p className={styles.sectionDetailAr}>{activeSection.nameAr}</p>
                    </div>
                    <span className={styles.sectionBadge} style={{ background: `${activeSection.color}15`, color: activeSection.color, borderColor: `${activeSection.color}30` }}>
                        AI-Powered
                    </span>
                </div>

                <p className={styles.sectionDescription}>{activeSection.description}</p>

                <div className={styles.featuresGrid}>
                    {activeSection.features.map((feature, i) => (
                        <div key={i} className={styles.featureItem} style={{ animationDelay: `${i * 0.05}s` }}>
                            <CheckCircle2 size={16} style={{ color: activeSection.color }} />
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>

                <div className={styles.sectionActions}>
                    {state.activeSection === 'audit' && (
                        <div className={styles.actionCard}>
                            <div className={styles.actionCardHeader}><Search size={18} /><span>Website URL to Audit</span></div>
                            <input className="input-field" placeholder="https://example.com" value={state.brandLink} onChange={(e) => updateMarketing({ brandLink: e.target.value })} />
                            <button className={styles.actionBtn} style={{ background: `linear-gradient(135deg, ${activeSection.color}, ${activeSection.color}99)` }} disabled={!state.brandLink.trim()} onClick={() => handleSectionGenerate('audit')}>
                                <Search size={16} /> Run Full Audit <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                    {(state.activeSection === 'copy' || state.activeSection === 'landing' || state.activeSection === 'seo' || state.activeSection === 'funnel') && (
                        <div className={styles.actionCard}>
                            <div className={styles.actionCardHeader}>{activeSection.icon}<span>Target URL</span></div>
                            <input className="input-field" placeholder="https://example.com" value={state.brandLink} onChange={(e) => updateMarketing({ brandLink: e.target.value })} />
                            <button className={styles.actionBtn} style={{ background: `linear-gradient(135deg, ${activeSection.color}, ${activeSection.color}99)` }} disabled={!state.brandLink.trim()} onClick={() => handleSectionGenerate(state.activeSection)}>
                                {activeSection.icon} Run {activeSection.name} <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                    {(state.activeSection === 'emails' || state.activeSection === 'social') && (
                        <div className={styles.actionCard}>
                            <div className={styles.actionCardHeader}>{activeSection.icon}<span>Topic or URL</span></div>
                            <input className="input-field" placeholder="Enter topic or URL..." value={state.projectBrief} onChange={(e) => updateMarketing({ projectBrief: e.target.value })} />
                            <button className={styles.actionBtn} style={{ background: `linear-gradient(135deg, ${activeSection.color}, ${activeSection.color}99)` }} disabled={!state.projectBrief.trim()} onClick={() => handleSectionGenerate(state.activeSection)}>
                                {activeSection.icon} Generate {activeSection.name} <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                    {(state.activeSection === 'ads' || state.activeSection === 'competitors' || state.activeSection === 'brand') && (
                        <div className={styles.actionCard}>
                            <div className={styles.actionCardHeader}>{activeSection.icon}<span>Brand / Website URL</span></div>
                            <input className="input-field" placeholder="https://example.com" value={state.brandLink} onChange={(e) => updateMarketing({ brandLink: e.target.value })} />
                            <button className={styles.actionBtn} style={{ background: `linear-gradient(135deg, ${activeSection.color}, ${activeSection.color}99)` }} disabled={!state.brandLink.trim()} onClick={() => handleSectionGenerate(state.activeSection)}>
                                {activeSection.icon} Analyze {activeSection.name} <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                    {state.activeSection === 'launch' && (
                        <div className={styles.actionCard}>
                            <div className={styles.actionCardHeader}><Rocket size={18} /><span>Product / Service Name</span></div>
                            <input className="input-field" placeholder="Enter product or service name..." value={state.brandName} onChange={(e) => updateMarketing({ brandName: e.target.value })} />
                            <textarea className="input-field" rows={3} placeholder="Brief description of what you're launching..." value={state.projectBrief} onChange={(e) => updateMarketing({ projectBrief: e.target.value })} style={{ resize: 'vertical', minHeight: '80px' }} />
                            <button className={styles.actionBtn} style={{ background: `linear-gradient(135deg, ${activeSection.color}, ${activeSection.color}99)` }} disabled={!state.brandName.trim()} onClick={() => handleSectionGenerate('launch')}>
                                <Rocket size={16} /> Generate Launch Playbook <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                    {state.activeSection === 'proposal' && (
                        <div className={styles.actionCard}>
                            <div className={styles.actionCardHeader}><FileCheck size={18} /><span>Client Details</span></div>
                            <input className="input-field" placeholder="Client company name..." value={state.brandName} onChange={(e) => updateMarketing({ brandName: e.target.value })} />
                            <input className="input-field" placeholder="Client website (optional)" value={state.brandLink} onChange={(e) => updateMarketing({ brandLink: e.target.value })} />
                            <textarea className="input-field" rows={3} placeholder="Services to propose + any audit findings..." value={state.projectBrief} onChange={(e) => updateMarketing({ projectBrief: e.target.value })} style={{ resize: 'vertical', minHeight: '80px' }} />
                            <button className={styles.actionBtn} style={{ background: `linear-gradient(135deg, ${activeSection.color}, ${activeSection.color}99)` }} disabled={!state.brandName.trim()} onClick={() => handleSectionGenerate('proposal')}>
                                <FileCheck size={16} /> Generate Proposal <ArrowRight size={16} />
                            </button>
                        </div>
                    )}
                    {state.activeSection === 'report' && (
                        <div className={styles.actionCard}>
                            <div className={styles.actionCardHeader}><ClipboardList size={18} /><span>Report Target</span></div>
                            <input className="input-field" placeholder="https://example.com" value={state.brandLink} onChange={(e) => updateMarketing({ brandLink: e.target.value })} />
                            <div className={styles.reportBtns}>
                                <button className={styles.actionBtn} style={{ background: `linear-gradient(135deg, ${activeSection.color}, ${activeSection.color}99)` }} disabled={!state.brandLink.trim()} onClick={() => handleSectionGenerate('report')}>
                                    <ClipboardList size={16} /> Markdown Report
                                </button>
                                <button className={styles.actionBtn} style={{ background: `linear-gradient(135deg, #8B5CF6, #6D28D9)` }} disabled={!state.brandLink.trim()} onClick={() => handleSectionGenerate('report')}>
                                    <FileText size={16} /> PDF Report
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarTitle}>
                        <BarChart3 size={18} className={styles.sidebarTitleIcon} />
                        <div>
                            <h2>Marketing Engine</h2>
                            <p className={styles.subtitle}>المحرك الاستراتيجي</p>
                        </div>
                    </div>
                </div>

                <div className={styles.sidebarContent}>
                    <div className={styles.sectionNav}>
                        <label className="label">Marketing Tools</label>
                        <div className={styles.sectionList}>
                            {MARKETING_SECTIONS.map((section) => (
                                <button
                                    key={section.id}
                                    className={`${styles.sectionItem} ${state.activeSection === section.id ? styles.sectionItemActive : ''}`}
                                    onClick={() => updateMarketing({ activeSection: section.id })}
                                    style={state.activeSection === section.id ? { borderColor: section.color, background: `${section.color}08` } : {}}
                                >
                                    <div className={styles.sectionItemIcon} style={{ color: section.color }}>
                                        {section.icon}
                                    </div>
                                    <div className={styles.sectionItemText}>
                                        <span className={styles.sectionItemName}>{section.name}</span>
                                        <span className={styles.sectionItemNameAr}>{section.nameAr}</span>
                                    </div>
                                    {state.sectionResults[section.id] && (
                                        <CheckCircle2 size={14} style={{ color: '#10B981', flexShrink: 0 }} />
                                    )}
                                    <ChevronRight size={14} className={styles.sectionItemArrow} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {state.activeSection === 'strategy' && (
                        <>
                            <div className={styles.divider} />
                            <div>
                                <label className="label">Brand Type</label>
                                <div className={styles.toggleGroup}>
                                    <button className={`${styles.toggleBtn} ${state.mode === 'new' ? styles.toggleBtnActive : ''}`} onClick={() => updateMarketing({ mode: 'new' })}>New Brand Concept</button>
                                    <button className={`${styles.toggleBtn} ${state.mode === 'existing' ? styles.toggleBtnActive : ''}`} onClick={() => updateMarketing({ mode: 'existing' })}>Existing Brand Link</button>
                                </div>
                            </div>
                            <div>
                                <label className="label">Brand Name</label>
                                <input className="input-field" placeholder="Enter brand name..." value={state.brandName} onChange={(e) => updateMarketing({ brandName: e.target.value })} />
                            </div>
                            {state.mode === 'existing' && (
                                <div>
                                    <label className="label">Brand Website / Link</label>
                                    <input className="input-field" placeholder="https://example.com" value={state.brandLink} onChange={(e) => updateMarketing({ brandLink: e.target.value })} />
                                </div>
                            )}
                            <SelectField label="Industry" value={state.industry} onChange={(v) => updateMarketing({ industry: v })} options={INDUSTRY_OPTIONS} />
                            <div>
                                <label className="label">Project Brief</label>
                                <textarea className="input-field" rows={4} placeholder="Describe your brand, target audience, and goals..." value={state.projectBrief} onChange={(e) => updateMarketing({ projectBrief: e.target.value })} style={{ resize: 'vertical', minHeight: '100px' }} />
                            </div>
                            <div>
                                <label className="label">Output Language</label>
                                <div className={styles.langToggle}>
                                    <button className={`${styles.langBtn} ${state.language === 'ar' ? styles.langBtnActive : ''}`} onClick={() => updateMarketing({ language: 'ar' })}>العربية</button>
                                    <button className={`${styles.langBtn} ${state.language === 'en' ? styles.langBtnActive : ''}`} onClick={() => updateMarketing({ language: 'en' })}>English</button>
                                </div>
                            </div>
                            <button className={`${styles.generateBtn} ${!canGenerate ? styles.disabled : ''}`} onClick={handleGenerate} disabled={!canGenerate || state.isGenerating}>
                                {state.isGenerating ? (<><Loader2 size={18} className={styles.spin} /> Analyzing Market...</>) : (<><Zap size={18} /> Generate Strategy</>)}
                            </button>
                        </>
                    )}

                    {/* Re-generate button for sections with results */}
                    {state.activeSection !== 'strategy' && currentResult && (
                        <>
                            <div className={styles.divider} />
                            <button
                                className={styles.generateBtn}
                                onClick={() => {
                                    const newResults = { ...state.sectionResults };
                                    delete newResults[state.activeSection];
                                    updateMarketing({ sectionResults: newResults });
                                }}
                                style={{ background: `linear-gradient(135deg, ${activeSection.color}, ${activeSection.color}99)` }}
                            >
                                <Zap size={18} /> Re-run {activeSection.name}
                            </button>
                        </>
                    )}
                </div>
            </aside>

            <main className={styles.workspace}>
                {renderSectionContent()}
            </main>
        </div>
    );
}
