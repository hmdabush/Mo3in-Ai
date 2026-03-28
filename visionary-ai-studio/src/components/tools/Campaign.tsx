'use client';

import React, { useCallback, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ImageUploader from '@/components/shared/ImageUploader';
import {
    Megaphone, Zap, Loader2, Download, Eye, X, RotateCcw,
    Instagram, Facebook, Twitter,
} from 'lucide-react';
import styles from './Campaign.module.css';
import ToolLayout from '@/components/shared/ToolLayout';

const MOODS = [
    { value: 'original', label: 'Original', color: '#06B6D4' },
    { value: 'dark-luxury', label: 'Dark Luxury', color: '#1a1a2e' },
    { value: 'minimalist', label: 'Minimalist', color: '#f5f5f5' },
    { value: 'vibrant', label: 'Vibrant Pop', color: '#FF6B35' },
    { value: 'pastel', label: 'Soft Pastel', color: '#FFB5C2' },
    { value: 'nature', label: 'Earthy Nature', color: '#2D6A4F' },
];

const FUNNEL_STEPS = ['Awareness', 'Interest', 'Desire', 'Social Proof', 'Urgency', 'Conversion'];
const STEP_COLORS = ['#06B6D4', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#EC4899'];

const PLATFORMS = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'twitter', label: 'X (Twitter)' },
];

export default function Campaign() {
    const project = useAppStore((s) => s.getActiveProject());
    const updateCampaign = useAppStore((s) => s.updateCampaign);
    const state = project.campaign;

    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
    const [zoomImage, setZoomImage] = useState<string | null>(null);

    const togglePlatform = useCallback((p: string) => {
        setSelectedPlatforms(prev =>
            prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
        );
    }, []);

    const handleGenerate = useCallback(async () => {
        updateCampaign({ isGenerating: true, generatedPosts: [] });
        try {
            const moodLabel = MOODS.find(m => m.value === state.moodPreset)?.label || state.moodPreset;
            const allImages: string[] = [];

            for (let i = 0; i < 6; i++) {
                const step = FUNNEL_STEPS[i];
                const stepDescriptions: Record<string, string> = {
                    'Awareness': 'Eye-catching brand introduction, bold typography, vibrant colors, pattern of brand colors in background',
                    'Interest': 'Product showcase with lifestyle context, elegant composition, benefit-focused text overlay',
                    'Desire': 'Emotional storytelling visual, close-up product detail, premium feel, golden/warm accents',
                    'Social Proof': 'Customer testimonial layout, star ratings, review quotes, trust badges, real-looking profile photos',
                    'Urgency': 'Limited time offer design, countdown visual, bold red/orange accents, flash sale typography',
                    'Conversion': 'Clear CTA button design, simple clean layout, arrow pointing to action, promotional code highlight',
                };
                const stepDesc = stepDescriptions[step] || 'Professional marketing visual';
                const prompt = `Professional social media marketing post for ${selectedPlatforms[0] || 'Instagram'}. Campaign stage: ${step}. ${stepDesc}. Theme: ${state.designTheme}. Visual mood: ${moodLabel} aesthetic. Requirements: Clean modern graphic design, proper text hierarchy, brand-consistent colors, high contrast for mobile viewing, no placeholder text - use Arabic text if needed. Square format 1:1 ratio, ready for social media posting. Ultra high quality, 4K resolution.`;

                const res = await fetch('/api/generate-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt, numberOfImages: 1, aspectRatio: '1:1' }),
                });

                if (!res.ok) throw new Error('Image generation failed');
                const data = await res.json();
                if (data.images?.[0]) allImages.push(data.images[0]);
                // Skip failed images
            }

            updateCampaign({ isGenerating: false, generatedPosts: allImages });
        } catch (error) {
            console.error('Campaign generation error:', error);
            updateCampaign({ isGenerating: false, generatedPosts: [] });
        }
    }, [updateCampaign, state.designTheme, state.moodPreset, selectedPlatforms]);

    const handleDownload = useCallback((imgUrl: string, name: string) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const link = document.createElement('a');
            link.download = `mo3in-ai-campaign-${name}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
        img.src = imgUrl;
    }, []);

    const handleDownloadAll = useCallback(() => {
        state.generatedPosts.forEach((img, i) => {
            setTimeout(() => handleDownload(img, FUNNEL_STEPS[i]?.toLowerCase() || `post-${i + 1}`), i * 300);
        });
    }, [state.generatedPosts, handleDownload]);

    const outputContent = (
        <>
            {state.isGenerating ? (
                <div className={styles.loading}>
                    <div className={styles.spinnerWrap}><div className={styles.spinnerRing} /><Megaphone size={24} className={styles.spinnerIcon} /></div>
                    <h3>Building Visual Funnel...</h3>
                    <p>Creating 6 cohesive social media posts with {MOODS.find(m => m.value === state.moodPreset)?.label} mood</p>
                </div>
            ) : state.generatedPosts.length > 0 ? (
                <div className={styles.results}>
                    <div className={styles.resultsHeader}>
                        <h3><Megaphone size={18} /> Social Media Funnel</h3>
                        <div className={styles.headerActions}>
                            <span className={styles.badge}>6 posts &bull; {MOODS.find(m => m.value === state.moodPreset)?.label}</span>
                            <button className={styles.downloadAllBtn} onClick={handleDownloadAll}>
                                <Download size={14} /> Download All
                            </button>
                        </div>
                    </div>
                    <div className={styles.funnelGrid}>
                        {state.generatedPosts.map((img, i) => (
                            <div key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className={styles.funnelCard}>
                                    <div className={styles.funnelCardImage}>
                                        <img src={img} alt={`Post ${i + 1}`} />
                                    </div>
                                    <div className={styles.funnelOverlay}>
                                        <span className={styles.funnelStep}>Step {i + 1}</span>
                                        <span className={styles.funnelName}>{FUNNEL_STEPS[i]}</span>
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button className={styles.cardBtn} onClick={() => setZoomImage(img)}>
                                            <Eye size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.funnelInfo}>
                                    <span className={styles.funnelStepBadge} style={{ background: STEP_COLORS[i] }}>{FUNNEL_STEPS[i]}</span>
                                    <span className={styles.funnelPlatformLabel}>{selectedPlatforms[0]}</span>
                                </div>
                                <div className={styles.downloadRow}>
                                    <button className={styles.downloadBtn} onClick={() => handleDownload(img, FUNNEL_STEPS[i]?.toLowerCase() || `post-${i + 1}`)}>
                                        <Download size={12} /> Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}><Megaphone size={40} /></div>
                    <p>ستظهر البوستات هنا بعد الإنشاء</p>
                </div>
            )}
        </>
    );

    return (
        <>
            <ToolLayout
                icon={<Megaphone size={18} />}
                title="Campaign"
                titleAr="حملات السوشيال ميديا"
                description="أنشئ حملة إعلانية متكاملة لمنصات التواصل. حدد المنصة والأسلوب واحصل على بوستات جاهزة."
                output={outputContent}
            >
                <ImageUploader label="Product Reference" image={state.productRef}
                    onUpload={(file, url) => updateCampaign({ productRef: { id: crypto.randomUUID(), file, url, name: file.name } })}
                    onRemove={() => updateCampaign({ productRef: null })} />

                <div>
                    <label className="label">Design Theme</label>
                    <textarea className="input-field" rows={3}
                        placeholder="Describe the visual theme, e.g., 'Luxurious gold and black with Arabic calligraphy accents'"
                        value={state.designTheme} onChange={(e) => updateCampaign({ designTheme: e.target.value })}
                        style={{ resize: 'vertical', minHeight: '80px' }} />
                </div>

                <div>
                    <label className="label">Mood Preset</label>
                    <div className={styles.moodGrid}>
                        {MOODS.map((m) => (
                            <button key={m.value}
                                className={`${styles.moodBtn} ${state.moodPreset === m.value ? styles.moodBtnActive : ''}`}
                                onClick={() => updateCampaign({ moodPreset: m.value })}
                            >
                                <span className={styles.moodDot} style={{ background: m.color }} />
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="label">Target Platforms</label>
                    <div className={styles.platformChips}>
                        {PLATFORMS.map((p) => (
                            <button key={p.value}
                                className={`${styles.platformChip} ${selectedPlatforms.includes(p.value) ? styles.platformChipActive : ''}`}
                                onClick={() => togglePlatform(p.value)}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="label">Scenario Mode</label>
                    <div className={styles.toggleGroup}>
                        <button className={`${styles.toggleBtn} ${state.mode === 'auto' ? styles.toggleBtnActive : ''}`}
                            onClick={() => updateCampaign({ mode: 'auto' })}>Auto Scenarios</button>
                        <button className={`${styles.toggleBtn} ${state.mode === 'custom' ? styles.toggleBtnActive : ''}`}
                            onClick={() => updateCampaign({ mode: 'custom' })}>Custom Ideas</button>
                    </div>
                </div>

                <button className={`${styles.generateBtn} ${!state.designTheme.trim() ? styles.disabled : ''}`}
                    onClick={handleGenerate} disabled={!state.designTheme.trim() || state.isGenerating}>
                    {state.isGenerating ? (<><Loader2 size={18} className={styles.spin} /> Creating Funnel...</>) : (<><Zap size={18} /> Generate 6-Post Funnel</>)}
                </button>

                {state.generatedPosts.length > 0 && (
                    <button className={styles.resetBtn} onClick={() => updateCampaign({ generatedPosts: [] })}>
                        <RotateCcw size={14} /> Reset Campaign
                    </button>
                )}
            </ToolLayout>

            {zoomImage && (
                <div className={styles.zoomModal} onClick={() => setZoomImage(null)}>
                    <button className={styles.zoomClose} onClick={() => setZoomImage(null)}><X size={20} /></button>
                    <img src={zoomImage} alt="Zoom" className={styles.zoomImage} onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </>
    );
}
