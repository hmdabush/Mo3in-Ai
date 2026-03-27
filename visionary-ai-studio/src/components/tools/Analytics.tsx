'use client';

import React, { useState, useEffect } from 'react';
import {
    TrendingUp, Eye, Users, MousePointerClick, Share2,
    ArrowUp, ArrowDown, Calendar, BarChart3, Target,
    Zap, Clock, Filter, Download,
} from 'lucide-react';
import styles from './Analytics.module.css';
import ToolGuide from '@/components/shared/ToolGuide';

const OVERVIEW_STATS = [
    { label: 'إجمالي المشاهدات', value: '24,892', rawValue: 24892, change: '+18%', up: true, icon: Eye, color: '#06B6D4' },
    { label: 'المتابعون الجدد', value: '1,247', rawValue: 1247, change: '+32%', up: true, icon: Users, color: '#8B5CF6' },
    { label: 'معدل التفاعل', value: '4.8%', rawValue: 4.8, change: '+0.6%', up: true, icon: MousePointerClick, color: '#10B981' },
    { label: 'المشاركات', value: '892', rawValue: 892, change: '-3%', up: false, icon: Share2, color: '#F59E0B' },
];

const PLATFORM_DATA = [
    { name: 'Instagram', icon: '📸', followers: '12.4K', engagement: '5.2%', posts: 34, color: '#E4405F', growth: '+420', barWidth: 85 },
    { name: 'Facebook', icon: '📘', followers: '8.7K', engagement: '3.1%', posts: 28, color: '#1877F2', growth: '+180', barWidth: 62 },
    { name: 'TikTok', icon: '🎵', followers: '5.2K', engagement: '8.4%', posts: 18, color: '#00F2EA', growth: '+890', barWidth: 95 },
    { name: 'Twitter', icon: '🐦', followers: '3.1K', engagement: '2.8%', posts: 45, color: '#1DA1F2', growth: '+95', barWidth: 40 },
];

const WEEKLY_DATA = [
    { day: 'سبت', views: 3200, engagement: 180 },
    { day: 'أحد', views: 4100, engagement: 220 },
    { day: 'إثنين', views: 3800, engagement: 195 },
    { day: 'ثلاثاء', views: 5200, engagement: 310 },
    { day: 'أربعاء', views: 4600, engagement: 275 },
    { day: 'خميس', views: 6100, engagement: 380 },
    { day: 'جمعة', views: 5800, engagement: 345 },
];

const TOP_POSTS = [
    { title: 'عرض رمضان الخاص', platform: 'Instagram', platformIcon: '📸', views: '8,420', engagement: '12.3%', date: '15 مارس' },
    { title: 'فيديو تعريفي بالمنتج', platform: 'TikTok', platformIcon: '🎵', views: '6,890', engagement: '9.7%', date: '12 مارس' },
    { title: 'نصائح للتسويق الرقمي', platform: 'Facebook', platformIcon: '📘', views: '4,230', engagement: '6.1%', date: '10 مارس' },
    { title: 'مراجعة منتج جديد', platform: 'Instagram', platformIcon: '📸', views: '3,910', engagement: '5.4%', date: '8 مارس' },
    { title: 'بث مباشر Q&A', platform: 'TikTok', platformIcon: '🎵', views: '3,450', engagement: '4.9%', date: '5 مارس' },
];

const CONTENT_INSIGHTS = [
    { label: 'أفضل وقت للنشر', value: 'الخميس 7 مساءً', icon: Clock, color: '#06B6D4' },
    { label: 'نوع المحتوى الأفضل', value: 'فيديو قصير', icon: Zap, color: '#8B5CF6' },
    { label: 'أعلى منصة تفاعل', value: 'TikTok (8.4%)', icon: TrendingUp, color: '#10B981' },
    { label: 'أفضل يوم', value: 'الخميس', icon: Calendar, color: '#F59E0B' },
];

const maxViews = Math.max(...WEEKLY_DATA.map(d => d.views));
const maxEngagement = Math.max(...WEEKLY_DATA.map(d => d.engagement));

export default function Analytics() {
    const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
    const [mounted, setMounted] = useState(false);
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);

    useEffect(() => setMounted(true), []);

    return (
        <div className={styles.layout}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <TrendingUp size={22} className={styles.headerIcon} />
                    <div>
                        <h1>التحليلات</h1>
                        <p>تتبع أداء محتواك عبر جميع المنصات</p>
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <div className={styles.periodToggle}>
                        {(['week', 'month', 'year'] as const).map(p => (
                            <button key={p} className={`${styles.periodBtn} ${period === p ? styles.periodBtnActive : ''}`}
                                onClick={() => setPeriod(p)}>
                                {p === 'week' ? 'أسبوع' : p === 'month' ? 'شهر' : 'سنة'}
                            </button>
                        ))}
                    </div>
                    <button className={styles.exportBtn}>
                        <Download size={14} /> تصدير
                    </button>
                </div>
            </div>

            <ToolGuide
                    title="التحليلات"
                    description="تابع أداء محتواك وحملاتك التسويقية. اطلع على إحصائيات المشاهدات والتفاعل والنمو عبر جميع المنصات."
                    steps={[
                        'راجع الإحصائيات العامة في لوحة التحكم',
                        'تابع أداء كل منصة على حدة',
                        'حلل البيانات الأسبوعية والشهرية',
                        'استخدم التوصيات لتحسين استراتيجيتك',
                    ]}
                />

            <div className={styles.content}>
                {/* Overview Stats */}
                <div className={styles.statsGrid}>
                    {OVERVIEW_STATS.map((stat, i) => (
                        <div key={i} className={styles.statCard} style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className={styles.statTop}>
                                <div className={styles.statIconWrap} style={{ background: `${stat.color}12`, color: stat.color }}>
                                    <stat.icon size={18} />
                                </div>
                                <span className={`${styles.statChange} ${stat.up ? styles.up : styles.down}`}>
                                    {stat.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                    {stat.change}
                                </span>
                            </div>
                            <span className={styles.statValue}>{stat.value}</span>
                            <span className={styles.statLabel}>{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Content Insights */}
                <div className={styles.insightsGrid}>
                    {CONTENT_INSIGHTS.map((insight, i) => (
                        <div key={i} className={styles.insightCard}>
                            <insight.icon size={16} style={{ color: insight.color }} />
                            <div className={styles.insightText}>
                                <span className={styles.insightLabel}>{insight.label}</span>
                                <span className={styles.insightValue}>{insight.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.twoCol}>
                    {/* Chart */}
                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h3><BarChart3 size={16} /> المشاهدات والتفاعل</h3>
                            <div className={styles.chartLegend}>
                                <span className={styles.legendItem}>
                                    <span className={styles.legendDot} style={{ background: '#06B6D4' }} />
                                    مشاهدات
                                </span>
                                <span className={styles.legendItem}>
                                    <span className={styles.legendDot} style={{ background: '#8B5CF6' }} />
                                    تفاعل
                                </span>
                            </div>
                        </div>
                        <div className={styles.chart}>
                            {WEEKLY_DATA.map((d, i) => {
                                const isHovered = hoveredBar === i;
                                return (
                                    <div key={i} className={`${styles.chartCol} ${isHovered ? styles.chartColHovered : ''}`}
                                        onMouseEnter={() => setHoveredBar(i)}
                                        onMouseLeave={() => setHoveredBar(null)}
                                    >
                                        <div className={styles.barGroup}>
                                            <div className={styles.barWrap}>
                                                <div className={styles.bar}
                                                    style={{ height: mounted ? `${(d.views / maxViews) * 100}%` : '0%' }}>
                                                    {isHovered && (
                                                        <span className={styles.barTooltip}>{d.views.toLocaleString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={styles.barWrap}>
                                                <div className={styles.barEngagement}
                                                    style={{ height: mounted ? `${(d.engagement / maxEngagement) * 100}%` : '0%' }}>
                                                    {isHovered && (
                                                        <span className={styles.barTooltip}>{d.engagement}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <span className={styles.chartLabel}>{d.day}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Platforms */}
                    <div className={styles.platformsCard}>
                        <h3><Target size={16} /> أداء المنصات</h3>
                        <div className={styles.platformsList}>
                            {PLATFORM_DATA.map((p, i) => (
                                <div key={i} className={styles.platformItem}>
                                    <span className={styles.platformIcon}>{p.icon}</span>
                                    <div className={styles.platformInfo}>
                                        <div className={styles.platformTop}>
                                            <span className={styles.platformName}>{p.name}</span>
                                            <span className={styles.platformEng}>{p.engagement}</span>
                                        </div>
                                        <div className={styles.platformBar}>
                                            <div className={styles.platformBarFill}
                                                style={{
                                                    width: mounted ? `${p.barWidth}%` : '0%',
                                                    background: p.color,
                                                }}
                                            />
                                        </div>
                                        <div className={styles.platformBottom}>
                                            <span className={styles.platformFollowers}>{p.followers} متابع</span>
                                            <span className={styles.platformGrowth}>
                                                <ArrowUp size={10} /> {p.growth}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Top Posts */}
                <div className={styles.topPostsCard}>
                    <h3>🏆 أفضل المنشورات أداءً</h3>
                    <div className={styles.postsTable}>
                        <div className={styles.tableHeader}>
                            <span>#</span>
                            <span>المنشور</span>
                            <span>المنصة</span>
                            <span>المشاهدات</span>
                            <span>التفاعل</span>
                            <span>التاريخ</span>
                        </div>
                        {TOP_POSTS.map((post, i) => (
                            <div key={i} className={styles.tableRow} style={{ animationDelay: `${i * 0.08}s` }}>
                                <span className={styles.postRank}>{i + 1}</span>
                                <span className={styles.postTitle}>{post.title}</span>
                                <span className={styles.postPlatform}>
                                    <span>{post.platformIcon}</span> {post.platform}
                                </span>
                                <span className={styles.postViews}>{post.views}</span>
                                <span className={styles.postEng}>{post.engagement}</span>
                                <span className={styles.postDate}>{post.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
