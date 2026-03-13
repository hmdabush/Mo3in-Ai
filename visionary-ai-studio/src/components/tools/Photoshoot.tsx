'use client';

import React, { useCallback, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ImageUploader from '@/components/shared/ImageUploader';
import {
    Camera, Zap, Loader2, Download, Eye, X, Sun, Lightbulb,
    RotateCcw, Heart, Sparkles, LayoutGrid, List,
} from 'lucide-react';
import styles from './Photoshoot.module.css';

const SHOT_TYPES = [
    { value: 'close-up', label: 'Close-Up', icon: '🔍' },
    { value: 'top-down', label: 'Top-Down', icon: '⬇️' },
    { value: 'macro', label: 'Macro Detail', icon: '🔬' },
    { value: '45-angle', label: '45° Angle', icon: '📐' },
    { value: 'lifestyle', label: 'Lifestyle', icon: '🏡' },
    { value: 'studio', label: 'Studio Clean', icon: '📷' },
    { value: 'packaging', label: 'Packaging', icon: '📦' },
    { value: 'in-use', label: 'In Use', icon: '✋' },
];

const LIGHTING_PRESETS = [
    { value: 'studio', label: 'Studio', icon: '💡' },
    { value: 'natural', label: 'Natural', icon: '☀️' },
    { value: 'dramatic', label: 'Dramatic', icon: '🌑' },
    { value: 'soft', label: 'Soft Box', icon: '🔲' },
    { value: 'golden', label: 'Golden Hour', icon: '🌅' },
    { value: 'neon', label: 'Neon', icon: '💜' },
];

const BG_PRESETS = [
    { value: 'white', label: 'White', color: '#ffffff' },
    { value: 'black', label: 'Black', color: '#0a0a0a' },
    { value: 'gradient', label: 'Gradient', color: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { value: 'marble', label: 'Marble', color: '#e8e0d8' },
    { value: 'wood', label: 'Wood', color: '#8B6914' },
    { value: 'nature', label: 'Nature', color: '#2D6A4F' },
];

export default function Photoshoot() {
    const project = useAppStore((s) => s.getActiveProject());
    const updatePhotoshoot = useAppStore((s) => s.updatePhotoshoot);
    const state = project.photoshoot;

    const [lighting, setLighting] = useState('studio');
    const [bgPreset, setBgPreset] = useState('white');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const [zoomImage, setZoomImage] = useState<string | null>(null);

    const toggleShot = useCallback((value: string) => {
        const current = state.selectedShots;
        if (current.includes(value)) {
            updatePhotoshoot({ selectedShots: current.filter((s) => s !== value) });
        } else if (current.length < 6) {
            updatePhotoshoot({ selectedShots: [...current, value] });
        }
    }, [state.selectedShots, updatePhotoshoot]);

    const handleGenerate = useCallback(() => {
        updatePhotoshoot({ isGenerating: true, generatedImages: [] });
        setTimeout(() => {
            const imgs = state.selectedShots.map((_, i) => `https://picsum.photos/seed/photo${i}${Date.now()}/600/600`);
            updatePhotoshoot({ isGenerating: false, generatedImages: imgs });
        }, 2500);
    }, [state.selectedShots, updatePhotoshoot]);

    const handleDownload = useCallback((imgUrl: string, shotName: string, is4K: boolean) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            if (is4K) {
                const scale = 3840 / img.width;
                canvas.width = 3840;
                canvas.height = Math.round(img.height * scale);
            } else {
                canvas.width = img.width;
                canvas.height = img.height;
            }
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            const link = document.createElement('a');
            link.download = `mo3in-ai-${shotName}${is4K ? '_4K' : ''}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
        img.src = imgUrl;
    }, []);

    const handleDownloadAll = useCallback(() => {
        state.generatedImages.forEach((img, i) => {
            setTimeout(() => {
                handleDownload(img, `shot-${i + 1}`, false);
            }, i * 300);
        });
    }, [state.generatedImages, handleDownload]);

    const toggleFavorite = useCallback((idx: number) => {
        setFavorites(prev => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx);
            else next.add(idx);
            return next;
        });
    }, []);

    const canGenerate = state.productImage !== null && state.selectedShots.length > 0;

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarTitle}>
                        <Camera size={18} className={styles.sidebarTitleIcon} />
                        <div>
                            <h2>Photoshoot</h2>
                            <p className={styles.subtitle}>جلسة التصوير</p>
                        </div>
                    </div>
                </div>

                <div className={styles.sidebarContent}>
                    <ImageUploader
                        label="Product Image"
                        image={state.productImage}
                        onUpload={(file, url) => updatePhotoshoot({ productImage: { id: crypto.randomUUID(), file, url, name: file.name } })}
                        onRemove={() => updatePhotoshoot({ productImage: null })}
                    />

                    <div>
                        <label className="label">Shot Types (select up to 6)</label>
                        <p className={styles.shotCount}>{state.selectedShots.length}/6 selected</p>
                        <div className={styles.shotsGrid}>
                            {SHOT_TYPES.map((shot) => (
                                <button
                                    key={shot.value}
                                    className={`${styles.shotChip} ${state.selectedShots.includes(shot.value) ? styles.shotChipActive : ''}`}
                                    onClick={() => toggleShot(shot.value)}
                                >
                                    <span className={styles.shotEmoji}>{shot.icon}</span>
                                    {shot.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Lighting Presets */}
                    <div>
                        <label className="label"><Sun size={12} /> Lighting Preset</label>
                        <div className={styles.lightingGrid}>
                            {LIGHTING_PRESETS.map((l) => (
                                <button
                                    key={l.value}
                                    className={`${styles.lightingBtn} ${lighting === l.value ? styles.lightingBtnActive : ''}`}
                                    onClick={() => setLighting(l.value)}
                                >
                                    <span>{l.icon}</span>
                                    <span>{l.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Background Presets */}
                    <div>
                        <label className="label"><Lightbulb size={12} /> Background</label>
                        <div className={styles.bgGrid}>
                            {BG_PRESETS.map((bg) => (
                                <button
                                    key={bg.value}
                                    className={`${styles.bgBtn} ${bgPreset === bg.value ? styles.bgBtnActive : ''}`}
                                    onClick={() => setBgPreset(bg.value)}
                                >
                                    <span
                                        className={styles.bgSwatch}
                                        style={{ background: bg.color }}
                                    />
                                    <span className={styles.bgLabel}>{bg.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="label">Custom Style Prompt</label>
                        <textarea
                            className="input-field"
                            rows={3}
                            placeholder="Add style direction, e.g., 'Minimalist white background with soft shadows'"
                            value={state.stylePrompt}
                            onChange={(e) => updatePhotoshoot({ stylePrompt: e.target.value })}
                            style={{ resize: 'vertical', minHeight: '80px' }}
                        />
                    </div>

                    <button
                        className={`${styles.generateBtn} ${!canGenerate ? styles.disabled : ''}`}
                        onClick={handleGenerate}
                        disabled={!canGenerate || state.isGenerating}
                    >
                        {state.isGenerating ? (
                            <><Loader2 size={18} className={styles.spin} /> Shooting...</>
                        ) : (
                            <><Zap size={18} /> Generate {state.selectedShots.length} Shots</>
                        )}
                    </button>

                    {state.generatedImages.length > 0 && (
                        <button className={styles.resetBtn} onClick={() => { updatePhotoshoot({ generatedImages: [] }); setFavorites(new Set()); }}>
                            <RotateCcw size={14} /> Reset Photoshoot
                        </button>
                    )}
                </div>
            </aside>

            <main className={styles.workspace}>
                {state.isGenerating ? (
                    <div className={styles.loading}>
                        <div className={styles.spinnerWrap}>
                            <div className={styles.spinnerRing} />
                            <Camera size={24} className={styles.spinnerIcon} />
                        </div>
                        <h3>Setting Up Virtual Photoshoot...</h3>
                        <p>Generating {state.selectedShots.length} shot types with {lighting} lighting</p>
                    </div>
                ) : state.generatedImages.length > 0 ? (
                    <div className={styles.results}>
                        <div className={styles.resultsHeader}>
                            <h3><Sparkles size={18} /> Photoshoot Results</h3>
                            <div className={styles.headerActions}>
                                <span className={styles.badge}>
                                    {state.generatedImages.length} shots
                                    {favorites.size > 0 && ` • ${favorites.size} favorited`}
                                </span>
                                <div className={styles.viewToggle}>
                                    <button
                                        className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <LayoutGrid size={14} />
                                    </button>
                                    <button
                                        className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
                                        onClick={() => setViewMode('list')}
                                    >
                                        <List size={14} />
                                    </button>
                                </div>
                                <button className={styles.downloadAllBtn} onClick={handleDownloadAll}>
                                    <Download size={14} /> Download All
                                </button>
                            </div>
                        </div>

                        {viewMode === 'grid' ? (
                            <div className={styles.grid}>
                                {state.generatedImages.map((img, i) => (
                                    <div key={i} className={styles.cellWrapper} style={{ animationDelay: `${i * 0.08}s` }}>
                                        <div className={styles.cell}>
                                            <img src={img} alt={`Shot ${i + 1}`} />
                                            <div className={styles.cellOverlay}>
                                                <span className={styles.cellLabel}>
                                                    {SHOT_TYPES.find((s) => s.value === state.selectedShots[i])?.label || `Shot ${i + 1}`}
                                                </span>
                                            </div>
                                            <div className={styles.cellActions}>
                                                <button
                                                    className={`${styles.cellBtn} ${favorites.has(i) ? styles.cellBtnFav : ''}`}
                                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(i); }}
                                                >
                                                    <Heart size={14} fill={favorites.has(i) ? 'currentColor' : 'none'} />
                                                </button>
                                                <button className={styles.cellBtn} onClick={(e) => { e.stopPropagation(); setZoomImage(img); }}>
                                                    <Eye size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className={styles.downloadRow}>
                                            <button className={styles.downloadBtn} onClick={() => handleDownload(img, `${state.selectedShots[i] || 'shot'}`, false)}>
                                                <Download size={12} /> Download
                                            </button>
                                            <button className={styles.download4kBtn} onClick={() => handleDownload(img, `${state.selectedShots[i] || 'shot'}`, true)}>
                                                <Download size={12} /> 4K
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.listView}>
                                {state.generatedImages.map((img, i) => (
                                    <div key={i} className={styles.listItem} style={{ animationDelay: `${i * 0.06}s` }}>
                                        <div className={styles.listThumb}>
                                            <img src={img} alt={`Shot ${i + 1}`} />
                                        </div>
                                        <div className={styles.listInfo}>
                                            <h4>{SHOT_TYPES.find((s) => s.value === state.selectedShots[i])?.label || `Shot ${i + 1}`}</h4>
                                            <p>Lighting: {LIGHTING_PRESETS.find(l => l.value === lighting)?.label} • Background: {BG_PRESETS.find(b => b.value === bgPreset)?.label}</p>
                                        </div>
                                        <div className={styles.listActions}>
                                            <button
                                                className={`${styles.cellBtn} ${favorites.has(i) ? styles.cellBtnFav : ''}`}
                                                onClick={() => toggleFavorite(i)}
                                            >
                                                <Heart size={14} fill={favorites.has(i) ? 'currentColor' : 'none'} />
                                            </button>
                                            <button className={styles.cellBtn} onClick={() => setZoomImage(img)}>
                                                <Eye size={14} />
                                            </button>
                                            <button className={styles.downloadBtn} onClick={() => handleDownload(img, `${state.selectedShots[i] || 'shot'}`, false)}>
                                                <Download size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}><Camera size={48} /></div>
                        <h3>Virtual Photoshoot</h3>
                        <p>Upload a product image and select up to 6 shot types<br />to generate professional product photography</p>
                    </div>
                )}
            </main>

            {/* Zoom Modal */}
            {zoomImage && (
                <div className={styles.zoomModal} onClick={() => setZoomImage(null)}>
                    <button className={styles.zoomClose} onClick={() => setZoomImage(null)}><X size={20} /></button>
                    <img src={zoomImage} alt="Zoom" className={styles.zoomImage} onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </div>
    );
}
