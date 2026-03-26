'use client';

import React, { useCallback, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ImageUploader from '@/components/shared/ImageUploader';
import {
    Send, Instagram, Facebook, Twitter, Loader2,
    Calendar, Clock, Hash, Eye, Check, Copy,
    Link2, Unlink, Plus, Trash2, CheckCircle2,
    AlertCircle, ChevronRight, Sparkles, RotateCcw,
} from 'lucide-react';
import styles from './SocialPublisher.module.css';

const PLATFORMS = [
    { value: 'instagram', label: 'Instagram', icon: '📸', color: '#E4405F', bgColor: 'rgba(228, 64, 95, 0.1)' },
    { value: 'facebook', label: 'Facebook', icon: '📘', color: '#1877F2', bgColor: 'rgba(24, 119, 242, 0.1)' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵', color: '#00F2EA', bgColor: 'rgba(0, 242, 234, 0.1)' },
    { value: 'twitter', label: 'X (Twitter)', icon: '🐦', color: '#1DA1F2', bgColor: 'rgba(29, 161, 242, 0.1)' },
];

const BEST_TIMES = [
    { platform: 'Instagram', day: 'الثلاثاء - الخميس', time: '11:00 ص - 1:00 م' },
    { platform: 'Facebook', day: 'الأربعاء - الجمعة', time: '9:00 ص - 12:00 م' },
    { platform: 'TikTok', day: 'الثلاثاء - الأحد', time: '7:00 م - 9:00 م' },
    { platform: 'Twitter', day: 'الإثنين - الأربعاء', time: '8:00 ص - 10:00 ص' },
];

const HASHTAG_SUGGESTIONS = [
    '#تسويق_رقمي', '#محتوى_إبداعي', '#سوشيال_ميديا', '#تجارة_إلكترونية',
    '#ريادة_أعمال', '#تصميم', '#إبداع', '#مشاريع_ناجحة',
];

export default function SocialPublisher() {
    const project = useAppStore((s) => s.getActiveProject());
    const updateSocialPublisher = useAppStore((s) => s.updateSocialPublisher);
    const state = project.socialPublisher;

    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'compose' | 'scheduled' | 'analytics'>('compose');
    const [showBestTimes, setShowBestTimes] = useState(false);

    const togglePlatform = useCallback((platform: string) => {
        const current = state.selectedPlatforms;
        const updated = current.includes(platform)
            ? current.filter(p => p !== platform)
            : [...current, platform];
        updateSocialPublisher({ selectedPlatforms: updated });
    }, [state.selectedPlatforms, updateSocialPublisher]);

    const handleConnect = useCallback((platform: string) => {
        const updated = state.accounts.map(acc =>
            acc.platform === platform
                ? { ...acc, connected: !acc.connected, username: acc.connected ? '' : `@mo3in_${platform}` }
                : acc
        );
        updateSocialPublisher({ accounts: updated });
    }, [state.accounts, updateSocialPublisher]);

    const addHashtag = useCallback((tag: string) => {
        const current = state.hashtags;
        if (!current.includes(tag)) {
            updateSocialPublisher({ hashtags: current ? `${current} ${tag}` : tag });
        }
    }, [state.hashtags, updateSocialPublisher]);

    const handlePublish = useCallback(() => {
        updateSocialPublisher({ isPublishing: true });

        setTimeout(() => {
            const newPost = {
                id: `post-${Date.now()}`,
                content: state.postContent,
                mediaUrl: state.postMedia?.url,
                platforms: state.selectedPlatforms,
                scheduledAt: state.scheduleMode === 'now'
                    ? new Date().toISOString()
                    : `${state.scheduledDate}T${state.scheduledTime}`,
                status: state.scheduleMode === 'now' ? 'published' as const : 'scheduled' as const,
            };

            updateSocialPublisher({
                isPublishing: false,
                scheduledPosts: [...state.scheduledPosts, newPost],
                postContent: '',
                postMedia: null,
                hashtags: '',
                selectedPlatforms: [],
            });
        }, 2000);
    }, [updateSocialPublisher, state]);

    const handleCopy = () => {
        navigator.clipboard.writeText(`${state.postContent}\n\n${state.hashtags}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const canPublish = state.postContent.trim() !== '' && state.selectedPlatforms.length > 0;
    const connectedAccounts = state.accounts.filter(a => a.connected);
    const characterCount = state.postContent.length;
    const maxChars = 2200;

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarTitle}>
                        <Send size={18} className={styles.sidebarTitleIcon} />
                        <div>
                            <h2>Social Publisher</h2>
                            <p className={styles.subtitle}>النشر المباشر على المنصات</p>
                        </div>
                    </div>
                </div>

                <div className={styles.sidebarContent}>
                    {/* Connected Accounts */}
                    <div className={styles.sectionGroup}>
                        <label className="label">🔗 الحسابات المربوطة</label>
                        <div className={styles.accountsList}>
                            {PLATFORMS.map((p) => {
                                const account = state.accounts.find(a => a.platform === p.value);
                                const isConnected = account?.connected || false;
                                return (
                                    <div key={p.value} className={`${styles.accountItem} ${isConnected ? styles.accountItemConnected : ''}`}>
                                        <span className={styles.accountIcon}>{p.icon}</span>
                                        <div className={styles.accountInfo}>
                                            <span className={styles.accountName}>{p.label}</span>
                                            {isConnected && <span className={styles.accountUsername}>{account?.username}</span>}
                                        </div>
                                        <button
                                            className={`${styles.connectBtn} ${isConnected ? styles.connectBtnActive : ''}`}
                                            onClick={() => handleConnect(p.value)}
                                        >
                                            {isConnected ? <><Unlink size={12} /> فصل</> : <><Link2 size={12} /> ربط</>}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Platform Selection */}
                    <div className={styles.sectionGroup}>
                        <label className="label">📤 اختر منصات النشر</label>
                        <div className={styles.platformGrid}>
                            {PLATFORMS.map((p) => {
                                const account = state.accounts.find(a => a.platform === p.value);
                                const isConnected = account?.connected || false;
                                const isSelected = state.selectedPlatforms.includes(p.value);
                                return (
                                    <button
                                        key={p.value}
                                        className={`${styles.platformBtn} ${isSelected ? styles.platformBtnActive : ''}`}
                                        onClick={() => isConnected && togglePlatform(p.value)}
                                        disabled={!isConnected}
                                        style={isSelected ? { borderColor: p.color, background: p.bgColor } : {}}
                                    >
                                        <span className={styles.platformEmoji}>{p.icon}</span>
                                        <span>{p.label}</span>
                                        {isSelected && <Check size={12} />}
                                        {!isConnected && <span className={styles.platformLock}>🔒</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Schedule Mode */}
                    <div className={styles.sectionGroup}>
                        <label className="label">⏰ وقت النشر</label>
                        <div className={styles.scheduleToggle}>
                            <button
                                className={`${styles.scheduleBtn} ${state.scheduleMode === 'now' ? styles.scheduleBtnActive : ''}`}
                                onClick={() => updateSocialPublisher({ scheduleMode: 'now' })}
                            >
                                <Send size={14} /> نشر فوري
                            </button>
                            <button
                                className={`${styles.scheduleBtn} ${state.scheduleMode === 'scheduled' ? styles.scheduleBtnActive : ''}`}
                                onClick={() => updateSocialPublisher({ scheduleMode: 'scheduled' })}
                            >
                                <Calendar size={14} /> جدولة
                            </button>
                        </div>

                        {state.scheduleMode === 'scheduled' && (
                            <div className={styles.scheduleInputs}>
                                <div className={styles.scheduleField}>
                                    <Calendar size={14} />
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={state.scheduledDate}
                                        onChange={(e) => updateSocialPublisher({ scheduledDate: e.target.value })}
                                    />
                                </div>
                                <div className={styles.scheduleField}>
                                    <Clock size={14} />
                                    <input
                                        type="time"
                                        className="input-field"
                                        value={state.scheduledTime}
                                        onChange={(e) => updateSocialPublisher({ scheduledTime: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <button className={styles.bestTimesBtn} onClick={() => setShowBestTimes(!showBestTimes)}>
                            <Sparkles size={12} /> أفضل أوقات النشر
                            <ChevronRight size={12} className={showBestTimes ? styles.chevronOpen : ''} />
                        </button>

                        {showBestTimes && (
                            <div className={styles.bestTimesList}>
                                {BEST_TIMES.map((bt, i) => (
                                    <div key={i} className={styles.bestTimeItem}>
                                        <span className={styles.bestTimePlatform}>{bt.platform}</span>
                                        <span className={styles.bestTimeDay}>{bt.day}</span>
                                        <span className={styles.bestTimeHour}>{bt.time}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Publish Button */}
                    <button
                        className={`${styles.publishBtn} ${!canPublish ? styles.disabled : ''}`}
                        onClick={handlePublish}
                        disabled={!canPublish || state.isPublishing}
                    >
                        {state.isPublishing ? (
                            <><Loader2 size={18} className={styles.spin} /> جاري النشر...</>
                        ) : state.scheduleMode === 'now' ? (
                            <><Send size={18} /> نشر الآن</>
                        ) : (
                            <><Calendar size={18} /> جدولة النشر</>
                        )}
                    </button>
                </div>
            </aside>

            <main className={styles.workspace}>
                {/* Tabs */}
                <div className={styles.workspaceTabs}>
                    <button
                        className={`${styles.wsTab} ${activeTab === 'compose' ? styles.wsTabActive : ''}`}
                        onClick={() => setActiveTab('compose')}
                    >
                        <Plus size={14} /> كتابة بوست
                    </button>
                    <button
                        className={`${styles.wsTab} ${activeTab === 'scheduled' ? styles.wsTabActive : ''}`}
                        onClick={() => setActiveTab('scheduled')}
                    >
                        <Calendar size={14} /> المنشورات المجدولة
                        {state.scheduledPosts.length > 0 && (
                            <span className={styles.tabBadge}>{state.scheduledPosts.length}</span>
                        )}
                    </button>
                </div>

                {activeTab === 'compose' ? (
                    <div className={styles.composeArea}>
                        {/* Media Upload */}
                        <div className={styles.mediaSection}>
                            <ImageUploader
                                label="الوسائط (صورة أو فيديو)"
                                image={state.postMedia}
                                onUpload={(file, url) => updateSocialPublisher({
                                    postMedia: { id: crypto.randomUUID(), file, url, name: file.name }
                                })}
                                onRemove={() => updateSocialPublisher({ postMedia: null })}
                            />
                        </div>

                        {/* Post Content */}
                        <div className={styles.contentSection}>
                            <div className={styles.contentHeader}>
                                <label className="label">📝 محتوى البوست</label>
                                <span className={`${styles.charCount} ${characterCount > maxChars ? styles.charCountOver : ''}`}>
                                    {characterCount}/{maxChars}
                                </span>
                            </div>
                            <textarea
                                className={styles.postTextarea}
                                rows={6}
                                placeholder="اكتب محتوى البوست هنا... يمكنك استخدام الإيموجي والتنسيق 🎨"
                                value={state.postContent}
                                onChange={(e) => updateSocialPublisher({ postContent: e.target.value })}
                            />
                        </div>

                        {/* Hashtags */}
                        <div className={styles.hashtagSection}>
                            <div className={styles.contentHeader}>
                                <label className="label"><Hash size={12} /> الهاشتاقات</label>
                                <button className={styles.copyBtn} onClick={handleCopy}>
                                    {copied ? <><Check size={12} /> تم النسخ</> : <><Copy size={12} /> نسخ الكل</>}
                                </button>
                            </div>
                            <textarea
                                className={styles.hashtagInput}
                                rows={2}
                                placeholder="#تسويق #محتوى #إبداع"
                                value={state.hashtags}
                                onChange={(e) => updateSocialPublisher({ hashtags: e.target.value })}
                            />
                            <div className={styles.hashtagSuggestions}>
                                <span className={styles.suggestLabel}>اقتراحات:</span>
                                {HASHTAG_SUGGESTIONS.map((tag) => (
                                    <button
                                        key={tag}
                                        className={styles.suggestTag}
                                        onClick={() => addHashtag(tag)}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Preview Cards */}
                        {state.selectedPlatforms.length > 0 && state.postContent && (
                            <div className={styles.previewSection}>
                                <label className="label"><Eye size={12} /> معاينة</label>
                                <div className={styles.previewCards}>
                                    {state.selectedPlatforms.map((p) => {
                                        const platform = PLATFORMS.find(pl => pl.value === p);
                                        if (!platform) return null;
                                        return (
                                            <div key={p} className={styles.previewCard} style={{ borderColor: `${platform.color}30` }}>
                                                <div className={styles.previewCardHeader}>
                                                    <span>{platform.icon}</span>
                                                    <span className={styles.previewPlatform} style={{ color: platform.color }}>{platform.label}</span>
                                                </div>
                                                {state.postMedia && (
                                                    <div className={styles.previewImage}>
                                                        <img src={state.postMedia.url} alt="Preview" />
                                                    </div>
                                                )}
                                                <p className={styles.previewText}>{state.postContent}</p>
                                                <p className={styles.previewHashtags}>{state.hashtags}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Scheduled Posts Tab */
                    <div className={styles.scheduledArea}>
                        {state.scheduledPosts.length === 0 ? (
                            <div className={styles.empty}>
                                <div className={styles.emptyIcon}>
                                    <Calendar size={48} />
                                </div>
                                <h3>لا توجد منشورات مجدولة</h3>
                                <p>ابدأ بكتابة بوست وجدولته للنشر التلقائي</p>
                            </div>
                        ) : (
                            <div className={styles.postsList}>
                                {state.scheduledPosts.map((post) => (
                                    <div key={post.id} className={styles.scheduledPost}>
                                        <div className={styles.postStatus}>
                                            {post.status === 'published' ? (
                                                <CheckCircle2 size={18} className={styles.statusPublished} />
                                            ) : post.status === 'failed' ? (
                                                <AlertCircle size={18} className={styles.statusFailed} />
                                            ) : (
                                                <Clock size={18} className={styles.statusScheduled} />
                                            )}
                                        </div>
                                        <div className={styles.postContent}>
                                            <p className={styles.postText}>{post.content.substring(0, 100)}...</p>
                                            <div className={styles.postMeta}>
                                                <span>{new Date(post.scheduledAt).toLocaleDateString('ar-SA')}</span>
                                                <span>{post.platforms.map(p => PLATFORMS.find(pl => pl.value === p)?.icon).join(' ')}</span>
                                                <span className={`${styles.statusBadge} ${styles[`status${post.status.charAt(0).toUpperCase() + post.status.slice(1)}`]}`}>
                                                    {post.status === 'published' ? '✅ منشور' : post.status === 'scheduled' ? '⏰ مجدول' : '❌ فشل'}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            className={styles.deletePostBtn}
                                            onClick={() => updateSocialPublisher({
                                                scheduledPosts: state.scheduledPosts.filter(p => p.id !== post.id)
                                            })}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
