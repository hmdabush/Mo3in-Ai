'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore, TOOLS, TOOL_CATEGORIES, ToolId } from '@/store/useAppStore';
import {
    Sparkles, TrendingUp, Zap, Crown, ArrowRight,
    Image, Video, Globe, Send, BarChart3, Mic,
    Clock, Star, Rocket, Users, Eye, FileText,
    Camera, Film, Palette, Target, Megaphone, Wand2,
    LayoutGrid, Brush, Play, ChevronRight, Activity,
    Calendar, Bell, Search, PlusCircle, Layers,
} from 'lucide-react';
import styles from './Dashboard.module.css';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    Sparkles, Film, BarChart3, Camera, Palette, Target, Megaphone, Wand2, Mic, Video, Globe, Send,
    TrendingUp, LayoutGrid, Brush,
};

const STATS = [
    { label: 'المشاريع النشطة', value: 12, icon: Layers, color: '#06B6D4', change: '+3', suffix: '' },
    { label: 'المحتوى المولّد', value: 248, icon: Sparkles, color: '#8B5CF6', change: '+42', suffix: '' },
    { label: 'المنشورات', value: 89, icon: Send, color: '#E4405F', change: '+12', suffix: '' },
    { label: 'المشاهدات', value: 15200, icon: Eye, color: '#10B981', change: '+22%', suffix: '' },
];

const QUICK_ACTIONS = [
    { id: 'creator-studio' as ToolId, label: 'تصميم جديد', desc: 'صور إبداعية بالـ AI', icon: Sparkles, gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)' },
    { id: 'social-publisher' as ToolId, label: 'نشر بوست', desc: 'انشر على المنصات', icon: Send, gradient: 'linear-gradient(135deg, #E4405F, #C13584)' },
    { id: 'video-studio' as ToolId, label: 'فيديو جديد', desc: 'فيديو سينمائي بالـ AI', icon: Video, gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' },
    { id: 'web-builder' as ToolId, label: 'بناء موقع', desc: 'موقع كامل بـ Claude', icon: Globe, gradient: 'linear-gradient(135deg, #10B981, #059669)' },
    { id: 'marketing' as ToolId, label: 'خطة تسويق', desc: 'استراتيجية متكاملة', icon: Target, gradient: 'linear-gradient(135deg, #F59E0B, #D97706)' },
    { id: 'campaign' as ToolId, label: 'حملة إعلانية', desc: '6 بوستات متناسقة', icon: Megaphone, gradient: 'linear-gradient(135deg, #EC4899, #BE185D)' },
];

const RECENT_ACTIVITY = [
    { type: 'image', title: 'تصميم منتج - كريم العناية', tool: 'Creator Studio', time: 'منذ 5 دقائق', color: '#06B6D4' },
    { type: 'post', title: 'بوست إنستغرام - عرض الجمعة', tool: 'Publisher', time: 'منذ ساعة', color: '#E4405F' },
    { type: 'video', title: 'فيديو إعلاني - 15 ثانية', tool: 'Video Studio', time: 'منذ 3 ساعات', color: '#8B5CF6' },
    { type: 'website', title: 'موقع شركة الإبداع الرقمي', tool: 'Web Builder', time: 'أمس', color: '#10B981' },
    { type: 'voice', title: 'تعليق صوتي - إعلان رمضان', tool: 'Voice Over', time: 'أمس', color: '#F59E0B' },
    { type: 'marketing', title: 'خطة تسويق - متجر إلكتروني', tool: 'Marketing', time: 'منذ يومين', color: '#EC4899' },
];

const TIPS = [
    { text: 'جرب "Campaign" لإنشاء حملة 6 بوستات متناسقة', tool: 'campaign' as ToolId },
    { text: 'يمكنك جدولة المنشورات للنشر التلقائي من "Publisher"', tool: 'social-publisher' as ToolId },
    { text: '"Prompt Engineer" يساعدك في كتابة أوامر أفضل للـ AI', tool: 'prompt' as ToolId },
    { text: 'استخدم "Brand Kit" لحفظ ألوان وخطوط علامتك التجارية', tool: 'brand-kit' as ToolId },
    { text: '"Web Builder" يمكنه بناء موقع كامل في ثوانٍ بالذكاء الاصطناعي', tool: 'web-builder' as ToolId },
];

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let start = 0;
        const step = value / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= value) {
                setDisplay(value);
                clearInterval(timer);
            } else {
                setDisplay(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [value, duration]);

    if (value >= 1000) {
        return <>{(display / 1000).toFixed(1)}K</>;
    }
    return <>{display.toLocaleString()}</>;
}

export default function Dashboard() {
    const { setActiveTool, projects } = useAppStore();
    const [currentTip] = useState(() => Math.floor(Math.random() * TIPS.length));
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

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
                            <h1>{getGreeting()}</h1>
                            <p>ماذا ستبتكر اليوم؟</p>
                        </div>
                    </div>
                    <div className={styles.heroActions}>
                        <button className={styles.tipCard} onClick={() => setActiveTool(TIPS[currentTip].tool)}>
                            <Zap size={14} />
                            <span>{TIPS[currentTip].text}</span>
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {STATS.map((stat, i) => (
                    <div key={i} className={styles.statCard} style={{ '--delay': `${i * 80}ms` } as React.CSSProperties}>
                        <div className={styles.statIcon} style={{ background: `${stat.color}12`, color: stat.color }}>
                            <stat.icon size={20} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>
                                {mounted ? <AnimatedNumber value={stat.value} /> : '0'}
                            </span>
                            <span className={styles.statLabel}>{stat.label}</span>
                        </div>
                        <span className={styles.statChange}>
                            <TrendingUp size={10} /> {stat.change}
                        </span>
                    </div>
                ))}
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

            {/* Two Column Layout */}
            <div className={styles.twoCol}>
                {/* All Tools */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2><Star size={18} /> جميع الأدوات</h2>
                        <span className={styles.toolCount}>{TOOLS.length} أداة</span>
                    </div>
                    <div className={styles.toolsGrid}>
                        {TOOL_CATEGORIES.map((cat) => (
                            <div key={cat.id} className={styles.toolCategory}>
                                <h3 className={styles.catTitle}>{cat.nameAr}</h3>
                                <div className={styles.catTools}>
                                    {TOOLS.filter(t => t.category === cat.id).map((tool) => {
                                        const IconComp = iconMap[tool.icon];
                                        return (
                                            <button
                                                key={tool.id}
                                                className={styles.toolItem}
                                                onClick={() => setActiveTool(tool.id)}
                                            >
                                                {IconComp && (
                                                    <div className={styles.toolItemIcon}>
                                                        <IconComp size={16} />
                                                    </div>
                                                )}
                                                <div className={styles.toolItemText}>
                                                    <span className={styles.toolName}>{tool.name}</span>
                                                    <span className={styles.toolNameAr}>{tool.nameAr}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column */}
                <div className={styles.rightCol}>
                    {/* Recent Activity */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2><Activity size={18} /> النشاط الأخير</h2>
                        </div>
                        <div className={styles.activityList}>
                            {RECENT_ACTIVITY.map((item, i) => (
                                <div key={i} className={styles.activityItem} style={{ '--delay': `${i * 60}ms` } as React.CSSProperties}>
                                    <div className={styles.activityDot} style={{ background: item.color }} />
                                    <div className={styles.activityInfo}>
                                        <span className={styles.activityTitle}>{item.title}</span>
                                        <div className={styles.activityMeta}>
                                            <span className={styles.activityTool} style={{ color: item.color }}>{item.tool}</span>
                                            <span className={styles.activityTime}>{item.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Current Plan */}
                    <div className={styles.planCard}>
                        <div className={styles.planHeader}>
                            <Crown size={20} className={styles.planIcon} />
                            <div>
                                <span className={styles.planName}>الخطة المجانية</span>
                                <span className={styles.planDesc}>ترقية لفتح ميزات أكثر</span>
                            </div>
                        </div>
                        <div className={styles.planUsage}>
                            <div className={styles.usageHeader}>
                                <span>الاستخدام</span>
                                <span className={styles.usageNumbers}>35 / 100</span>
                            </div>
                            <div className={styles.usageBar}>
                                <div className={styles.usageFill} style={{ width: mounted ? '35%' : '0%' }} />
                            </div>
                        </div>
                        <button className={styles.upgradeBtn}>
                            <Crown size={14} />
                            <span>ترقية للخطة الاحترافية</span>
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
