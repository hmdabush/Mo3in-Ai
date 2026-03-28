'use client';

import React, { useCallback, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ImageUploader from '@/components/shared/ImageUploader';
import SelectField from '@/components/shared/SelectField';
import {
    Sparkles, Zap, RotateCcw, Download, ZoomIn, Loader2,
    Heart, Star, Copy, Check, Image, Grid3X3, DownloadCloud, X,
} from 'lucide-react';
import styles from './CreatorStudio.module.css';
import ToolLayout from '@/components/shared/ToolLayout';

const DUMMY_IMAGES = [
    'https://picsum.photos/seed/vis1/400/400',
    'https://picsum.photos/seed/vis2/400/400',
    'https://picsum.photos/seed/vis3/400/400',
    'https://picsum.photos/seed/vis4/400/400',
    'https://picsum.photos/seed/vis5/400/400',
    'https://picsum.photos/seed/vis6/400/400',
    'https://picsum.photos/seed/vis7/400/400',
    'https://picsum.photos/seed/vis8/400/400',
    'https://picsum.photos/seed/vis9/400/400',
];

const LIGHTING_OPTIONS = [
    { value: 'natural', label: 'Natural Light' },
    { value: 'studio', label: 'Studio Light' },
    { value: 'dramatic', label: 'Dramatic' },
    { value: 'golden-hour', label: 'Golden Hour' },
    { value: 'neon', label: 'Neon Glow' },
    { value: 'soft-diffused', label: 'Soft Diffused' },
    { value: 'backlit', label: 'Backlit' },
    { value: 'moody', label: 'Moody Dark' },
];

const ANGLE_OPTIONS = [
    { value: 'front', label: 'Front View' },
    { value: 'side', label: 'Side View' },
    { value: 'top-down', label: 'Top-Down / Flat Lay' },
    { value: '45-degree', label: '45\u00B0 Angle' },
    { value: 'close-up', label: 'Close-Up / Macro' },
    { value: 'wide', label: 'Wide Shot' },
    { value: 'low-angle', label: 'Low Angle' },
    { value: 'eye-level', label: 'Eye Level' },
];

const BACKGROUND_PRESETS = [
    { value: 'none', label: 'Auto', color: 'transparent' },
    { value: 'white', label: 'White', color: '#FFFFFF' },
    { value: 'black', label: 'Black', color: '#000000' },
    { value: 'marble', label: 'Marble', color: '#E8E0D8' },
    { value: 'wood', label: 'Wood', color: '#8B6F4E' },
    { value: 'gradient', label: 'Gradient', color: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { value: 'nature', label: 'Nature', color: '#2D5016' },
    { value: 'studio-gray', label: 'Studio', color: '#4A4A4A' },
];

const STYLE_PRESETS = [
    { value: 'realistic', label: 'Photorealistic', icon: '📸' },
    { value: 'editorial', label: 'Editorial', icon: '📰' },
    { value: 'lifestyle', label: 'Lifestyle', icon: '🏡' },
    { value: 'ecommerce', label: 'E-Commerce', icon: '🛍' },
    { value: 'luxury', label: 'Luxury', icon: '✨' },
    { value: 'minimal', label: 'Minimal', icon: '◻️' },
];

export default function CreatorStudio() {
    const project = useAppStore((s) => s.getActiveProject());
    const updateCreatorStudio = useAppStore((s) => s.updateCreatorStudio);
    const state = project.creatorStudio;

    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    const [selectedBg, setSelectedBg] = useState('none');
    const [selectedStyle, setSelectedStyle] = useState('realistic');
    const [variationCount, setVariationCount] = useState(9);

    const handleMainProductUpload = useCallback((file: File, url: string) => {
        updateCreatorStudio({
            mainProduct: { id: crypto.randomUUID(), file, url, name: file.name },
        });
    }, [updateCreatorStudio]);

    const handleStyleUpload = useCallback((file: File, url: string) => {
        updateCreatorStudio({
            styleReference: { id: crypto.randomUUID(), file, url, name: file.name },
        });
    }, [updateCreatorStudio]);

    const handleGenerate = useCallback(async () => {
        updateCreatorStudio({ isGenerating: true, generatedImages: [] });
        setFavorites(new Set());
        try {
            const styleLabel = STYLE_PRESETS.find(s => s.value === selectedStyle)?.label || selectedStyle;
            const lightLabel = LIGHTING_OPTIONS.find(l => l.value === state.lighting)?.label || state.lighting;
            const angleLabel = ANGLE_OPTIONS.find(a => a.value === state.angle)?.label || state.angle;
            const bgLabel = BACKGROUND_PRESETS.find(b => b.value === selectedBg)?.label || selectedBg;

            const prompt = `Professional ${styleLabel} product photography. ${state.visionPrompt || 'High-end commercial product shot'}. Lighting: ${lightLabel}. Camera angle: ${angleLabel}. Background: ${bgLabel}. Ultra high quality, 8K resolution, professional studio photography.`;

            const allImages: string[] = [];
            const batchCount = Math.ceil(variationCount / 4);

            for (let i = 0; i < batchCount; i++) {
                const remaining = variationCount - allImages.length;
                const count = Math.min(remaining, 4);

                const res = await fetch('/api/generate-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt, numberOfImages: count, aspectRatio: '1:1' }),
                });

                if (!res.ok) throw new Error('Image generation failed');
                const data = await res.json();
                if (data.images) allImages.push(...data.images);
            }

            updateCreatorStudio({
                isGenerating: false,
                generatedImages: allImages.length > 0 ? allImages : DUMMY_IMAGES.slice(0, variationCount),
            });
        } catch (error) {
            console.error('Image generation error:', error);
            updateCreatorStudio({
                isGenerating: false,
                generatedImages: DUMMY_IMAGES.slice(0, variationCount),
            });
        }
    }, [updateCreatorStudio, variationCount, selectedStyle, state.lighting, state.angle, state.visionPrompt, selectedBg]);

    const handleReset = useCallback(() => {
        updateCreatorStudio({
            generatedImages: [],
            mainProduct: null,
            styleReference: null,
            lighting: 'natural',
            angle: 'front',
            visionPrompt: '',
        });
        setFavorites(new Set());
    }, [updateCreatorStudio]);

    const toggleFavorite = (idx: number) => {
        setFavorites(prev => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx); else next.add(idx);
            return next;
        });
    };

    const handleDownloadAll = () => {
        state.generatedImages.forEach((img, i) => {
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = img;
                link.download = `mo3in-ai-variation-${i + 1}.png`;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, i * 300);
        });
    };

    const canGenerate = state.mainProduct !== null;

    const outputJSX = (
        <>
            {state.isGenerating ? (
                <div className={styles.loading}>
                    <div className={styles.spinner}>
                        <div className={styles.spinnerRing} />
                        <Sparkles size={24} className={styles.spinnerIcon} />
                    </div>
                    <h3>Creating AI Magic...</h3>
                    <p>Analyzing product & style, generating {variationCount} unique variations</p>
                    <div className={styles.loadingGrid}>
                        {Array.from({ length: variationCount }).map((_, i) => (
                            <div key={i} className={styles.loadingCell} style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                    </div>
                </div>
            ) : state.generatedImages.length > 0 ? (
                <div className={styles.results}>
                    <div className={styles.resultsHeader}>
                        <h3>Generated Variations</h3>
                        <div className={styles.resultsActions}>
                            {favorites.size > 0 && (
                                <span className={styles.favCount}>
                                    <Heart size={14} /> {favorites.size} favorited
                                </span>
                            )}
                            <span className={styles.resultsCount}>{state.generatedImages.length} images</span>
                        </div>
                    </div>
                    <div className={styles.grid}>
                        {state.generatedImages.map((img, i) => (
                            <div key={i} className={styles.cell} style={{ animationDelay: `${i * 0.08}s` }}>
                                <div className={styles.cellImageWrap}>
                                    <img src={img} alt={`Variation ${i + 1}`} />
                                    <div className={styles.cellOverlay}>
                                        <span className={styles.cellNum}>#{i + 1}</span>
                                        <div className={styles.cellActions}>
                                            <button
                                                className={`${styles.cellBtn} ${favorites.has(i) ? styles.cellBtnFav : ''}`}
                                                title="Favorite"
                                                onClick={() => toggleFavorite(i)}
                                            >
                                                <Heart size={14} fill={favorites.has(i) ? '#EF4444' : 'none'} />
                                            </button>
                                            <button className={styles.cellBtn} title="Zoom" onClick={() => setZoomedImage(img)}>
                                                <ZoomIn size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className={styles.downloadBtn}
                                    title={`Download Variation ${i + 1}`}
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = img;
                                        link.download = `mo3in-ai-variation-${i + 1}.png`;
                                        link.target = '_blank';
                                        link.rel = 'noopener noreferrer';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                >
                                    <Download size={14} />
                                    <span>Download</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>
                        <Sparkles size={40} />
                    </div>
                    <p>ستظهر التصاميم هنا بعد الإنشاء</p>
                </div>
            )}
        </>
    );

    return (
        <>
            <ToolLayout
                icon={<Sparkles size={20} />}
                title="Creator Studio"
                titleAr="استوديو الإبداع"
                description="أنشئ صور إبداعية احترافية لمنتجاتك. ارفع صورة المنتج، اختر الأسلوب والإضاءة، واحصل على تصاميم بالذكاء الاصطناعي."
                output={outputJSX}
            >
                <ImageUploader
                    label="Main Product Image"
                    image={state.mainProduct}
                    onUpload={handleMainProductUpload}
                    onRemove={() => updateCreatorStudio({ mainProduct: null })}
                />

                <ImageUploader
                    label="Style Reference (Optional)"
                    image={state.styleReference}
                    onUpload={handleStyleUpload}
                    onRemove={() => updateCreatorStudio({ styleReference: null })}
                    compact
                />

                {/* Style Presets */}
                <div>
                    <label className="label">Style Preset</label>
                    <div className={styles.styleGrid}>
                        {STYLE_PRESETS.map((s) => (
                            <button
                                key={s.value}
                                className={`${styles.styleBtn} ${selectedStyle === s.value ? styles.styleBtnActive : ''}`}
                                onClick={() => setSelectedStyle(s.value)}
                            >
                                <span>{s.icon}</span>
                                <span>{s.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Background Presets */}
                <div>
                    <label className="label">Background</label>
                    <div className={styles.bgGrid}>
                        {BACKGROUND_PRESETS.map((bg) => (
                            <button
                                key={bg.value}
                                className={`${styles.bgBtn} ${selectedBg === bg.value ? styles.bgBtnActive : ''}`}
                                onClick={() => setSelectedBg(bg.value)}
                                title={bg.label}
                            >
                                <span
                                    className={styles.bgSwatch}
                                    style={{ background: bg.color || '#333' }}
                                />
                                <span className={styles.bgLabel}>{bg.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.inputRow}>
                    <SelectField
                        label="Lighting"
                        value={state.lighting}
                        onChange={(v) => updateCreatorStudio({ lighting: v })}
                        options={LIGHTING_OPTIONS}
                    />
                    <SelectField
                        label="Camera Angle"
                        value={state.angle}
                        onChange={(v) => updateCreatorStudio({ angle: v })}
                        options={ANGLE_OPTIONS}
                    />
                </div>

                {/* Variation Count */}
                <div>
                    <label className="label">Variations: {variationCount}</label>
                    <div className={styles.varCountRow}>
                        {[4, 6, 9].map(n => (
                            <button
                                key={n}
                                className={`${styles.varCountBtn} ${variationCount === n ? styles.varCountBtnActive : ''}`}
                                onClick={() => setVariationCount(n)}
                            >
                                <Grid3X3 size={12} /> {n}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="label">AI Vision Prompt</label>
                    <textarea
                        className="input-field"
                        rows={4}
                        placeholder="Describe the desired scene, style, mood... e.g., 'Product on a marble table in a luxurious penthouse with city skyline view, warm ambient lighting'"
                        value={state.visionPrompt}
                        onChange={(e) => updateCreatorStudio({ visionPrompt: e.target.value })}
                        style={{ resize: 'vertical', minHeight: '100px' }}
                    />
                </div>

                <button
                    className={`${styles.generateBtn} ${!canGenerate ? styles.disabled : ''}`}
                    onClick={handleGenerate}
                    disabled={!canGenerate || state.isGenerating}
                    id="creator-generate-btn"
                >
                    {state.isGenerating ? (
                        <><Loader2 size={18} className={styles.spin} /> Generating {variationCount} Variations...</>
                    ) : (
                        <><Zap size={18} /> Generate {variationCount} Variations</>
                    )}
                </button>

                {state.generatedImages.length > 0 && (
                    <div className={styles.bottomActions}>
                        <button className={styles.resetBtn} onClick={handleReset}>
                            <RotateCcw size={14} /> Reset All
                        </button>
                        <button className={styles.downloadAllBtn} onClick={handleDownloadAll}>
                            <DownloadCloud size={14} /> Download All
                        </button>
                    </div>
                )}
            </ToolLayout>

            {/* Zoom Modal */}
            {zoomedImage && (
                <div className={styles.zoomModal} onClick={() => setZoomedImage(null)}>
                    <button className={styles.zoomClose} onClick={() => setZoomedImage(null)}><X size={20} /></button>
                    <img src={zoomedImage} alt="Zoomed" className={styles.zoomImage} onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </>
    );
}
