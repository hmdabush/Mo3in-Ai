'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore, TOOLS, ToolId } from '@/store/useAppStore';
import { useSubscription } from '@/lib/SubscriptionContext';
import PricingModal from '@/components/subscription/PricingModal';
import {
    Sparkles, TrendingUp, Zap, Crown, ArrowRight,
    Image, Video, Globe, Send, BarChart3, Mic,
    Clock, Star, Rocket, Users, Eye, FileText,
    Camera, Film, Palette, Target, Megaphone, Wand2,
    LayoutGrid, Brush, Play, ChevronRight, Activity,
    Calendar, Bell, Search, PlusCircle, Layers, Coins,
} from 'lucide-react';
import styles from './Dashboard.module.css';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    Sparkles, Film, BarChart3, Camera, Palette, Target, Megaphone, Wand2, Mic, Video, Globe, Send,
    TrendingUp, LayoutGrid, Brush,
};

const QUICK_ACTIONS = [
    { id: 'creator-studio' as ToolId, label: 'تصميم جديد', desc: 'صور إبداعية بالـ AI', icon: Sparkles, gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)' },
    { id: 'video-studio' as ToolId, label: 'فيديو جديد', desc: 'فيديو سينمائي بالـ AI', icon: Video, gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' },
    { id: 'web-builder' as ToolId, label: 'بناء موقع', desc: 'موقع كامل بـ Claude', icon: Globe, gradient: 'linear-gradient(135deg, #10B981, #059669)' },
    { id: 'marketing' as ToolId, label: 'خطة تسويق', desc: 'استراتيجية متكاملة', icon: Target, gradient: 'linear-gradient(135deg, #F59E0B, #D97706)' },
    { id: 'campaign' as ToolId, label: 'حملة إعلانية', desc: '6 بوستات متناسقة', icon: Megaphone, gradient: 'linear-gradient(135deg, #EC4899, #BE185D)' },
    { id: 'voice-over' as ToolId, label: 'تعليق صوتي', desc: 'صوت احترافي بالـ AI', icon: Mic, gradient: 'linear-gradient(135deg, #F97316, #EA580C)' },
];

const PLAN_NAMES: Record<string, string> = {
    free: 'المجانية',
    pro: 'الاحترافية',
    enterprise: 'المؤسسات',
};

export default function Dashboard() {
    const { setActiveTool, projects } = useAppStore();
    const { plan, credits } = useSubscription();
    const [mounted, setMounted] = useState(false);
    const [showPricing, setShowPricing] = useState(false);

    useEffect(() => setMounted(true), []);

    const projectCount = projects?.length || 0;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 6) return 'ليلة سعيدة';
        if (hour < 12) return 'صباح الخير';
        if (hour < 17) return 'مساء الخير';
        return 'مساء النور';
    };

    const getGreetingEmoji = () => {
        const hour = new Date().getHours();
        if (hour < 6) return '🌙';
        if (hour < 12) return '☀️';
        if (hour < 17) return '🌤️';
        return '🌙';
    };

    return (
        <div className={`${styles.dashboard} ${mounted ? styles.mounted : ''}`}>
            {/* Hero Section */}
            <div className={styles.hero}>
                <div className={styles.heroGlow} />
                <div className={styles.heroContent}>
                    <div className={styles.greeting}>
                        <span className={styles.greetingEmoji}>{getGreetingEmoji()}</span>
                        <div>
                            <h1 className={styles.greetingText}>{getGreeting()}</h1>
                            <p className={styles.greetingSub}>ماذا ستبتكر اليوم؟</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid - Real Data */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard} style={{ '--delay': '0ms' } as React.CSSProperties}>
                    <div className={styles.statIcon} style={{ background: '#06B6D412', color: '#06B6D4' }}>
                        <Layers size={20} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{projectCount}</span>
                        <span className={styles.statLabel}>المشاريع</span>
                    </div>
                </div>
                <div className={styles.statCard} style={{ '--delay': '80ms' } as React.CSSProperties}>
                    <div className={styles.statIcon} style={{ background: '#8B5CF612', color: '#8B5CF6' }}>
                        <Coins size={20} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{credits}</span>
                        <span className={styles.statLabel}>الرصيد المتبقي</span>
                    </div>
                </div>
                <div className={styles.statCard} style={{ '--delay': '160ms' } as React.CSSProperties}>
                    <div className={styles.statIcon} style={{ background: '#10B98112', color: '#10B981' }}>
                        <Crown size={20} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{PLAN_NAMES[plan] || 'المجانية'}</span>
                        <span className={styles.statLabel}>الخطة الحالية</span>
                    </div>
                </div>
                <div className={styles.statCard} style={{ '--delay': '240ms' } as React.CSSProperties}>
                    <div className={styles.statIcon} style={{ background: '#E4405F12', color: '#E4405F' }}>
                        <Star size={20} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statValue}>{TOOLS.length}</span>
                        <span className={styles.statLabel}>أداة متاحة</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2><Rocket size={18} /> إجراءات سريعة</h2>
                    <span className={styles.sectionHint}>اختر أداة للبدء</span>
                </div>
                <div className={styles.quickGrid}>
                    {QUICK_ACTIONS.map((action, i) => (
                        <button
                            key={action.id}
                            className={styles.quickCard}
                            onClick={() => setActiveTool(action.id)}
                            style={{ '--delay': `${i * 60}ms` } as React.CSSProperties}
                        >
                            <div className={styles.quickIcon} style={{ background: action.gradient }}>
                                <action.icon size={22} />
                            </div>
                            <div className={styles.quickInfo}>
                                <span className={styles.quickLabel}>{action.label}</span>
                                <span className={styles.quickDesc}>{action.desc}</span>
                            </div>
                            <ArrowRight size={16} className={styles.quickArrow} />
                        </button>
                    ))}
                </div>
            </div>

            {/* All Tools - Centered */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2><Star size={18} /> جميع الأدوات</h2>
                    <span className={styles.toolCount}>{TOOLS.length} أداة</span>
                </div>
                <div className={styles.allToolsGrid}>
                    {TOOLS.map((tool) => {
                        const IconComp = iconMap[tool.icon];
                        return (
                            <button
                                key={tool.id}
                                className={styles.toolCard}
                                onClick={() => setActiveTool(tool.id)}
                            >
                                {IconComp && (
                                    <div className={styles.toolCardIcon}>
                                        <IconComp size={20} />
                                    </div>
                                )}
                                <div className={styles.toolCardText}>
                                    <span className={styles.toolCardName}>{tool.nameAr}</span>
                                    <span className={styles.toolCardDesc}>{tool.name}</span>
                                </div>
                                <ChevronRight size={14} className={styles.toolCardArrow} />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Upgrade Banner */}
            {plan === 'free' && (
                <div className={styles.upgradeBanner}>
                    <div className={styles.upgradeBannerContent}>
                        <Crown size={18} className={styles.upgradeBannerIcon} />
                        <div>
                            <span className={styles.upgradeBannerTitle}>ترقية للخطة الاحترافية</span>
                            <span className={styles.upgradeBannerDesc}>احصل على 500 كريدت شهرياً وميزات إضافية</span>
                        </div>
                    </div>
                    <button className={styles.upgradeBannerBtn} onClick={() => setShowPricing(true)}>
                        ترقية الآن <ArrowRight size={14} />
                    </button>
                </div>
            )}

            {/* Pricing Modal */}
            <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
        </div>
    );
}
