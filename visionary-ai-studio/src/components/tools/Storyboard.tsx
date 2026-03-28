'use client';

import React, { useCallback, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ImageUploader from '@/components/shared/ImageUploader';
import SelectField from '@/components/shared/SelectField';
import {
    Film, Zap, Loader2, Monitor, Smartphone, Download, LayoutGrid,
    Clock, ArrowRight, Clapperboard, Type, RotateCcw, Eye, X,
} from 'lucide-react';
import ToolLayout from '@/components/shared/ToolLayout';
import styles from './Storyboard.module.css';

const SCENE_TITLES = [
    'Opening Hook', 'Problem Statement', 'Solution Reveal',
    'Feature Highlight 1', 'Feature Highlight 2', 'Social Proof',
    'Emotional Appeal', 'Call to Action', 'Brand Closing',
];

const SCENE_DURATIONS = ['2s', '3s', '3s', '4s', '3s', '3s', '3s', '4s', '2s'];

const SCENE_DESCRIPTIONS = [
    'Capture attention with a compelling visual or question',
    'Present the pain point your audience relates to',
    'Introduce your product/service as the answer',
    'Showcase the primary benefit or feature',
    'Highlight a secondary compelling feature',
    'Show customer testimonials or results',
    'Create an emotional connection with the viewer',
    'Clear and urgent call to action',
    'Brand logo, tagline, and contact info',
];

const GENRE_OPTIONS = [
    { value: 'commercial', label: 'Commercial Ad' },
    { value: 'social', label: 'Social Media' },
    { value: 'product', label: 'Product Demo' },
    { value: 'brand', label: 'Brand Story' },
    { value: 'testimonial', label: 'Testimonial' },
    { value: 'explainer', label: 'Explainer' },
];

export default function Storyboard() {
    const project = useAppStore((s) => s.getActiveProject());
    const updateStoryboard = useAppStore((s) => s.updateStoryboard);
    const state = project.storyboard;

    const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
    const [activeScene, setActiveScene] = useState<number | null>(null);
    const [genre, setGenre] = useState('commercial');
    const [previewScene, setPreviewScene] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        updateStoryboard({ isGenerating: true, generatedScenes: [] });
        try {
            const genreLabel = GENRE_OPTIONS.find(g => g.value === genre)?.label || genre;
            const allScenes: string[] = [];

            for (let i = 0; i < 9; i++) {
                const sceneTitle = SCENE_TITLES[i];
                const sceneDesc = SCENE_DESCRIPTIONS[i];
                const prompt = `Cinematic storyboard frame ${i + 1} of 9 for a ${genreLabel} video advertisement. Scene: "${sceneTitle}" - ${sceneDesc}. Story context: ${state.storyVision}. Visual requirements: ${state.aspectRatio} aspect ratio, cinematic film-quality composition with rule of thirds, dramatic depth of field, professional color grading with teal-orange cinema palette. Lighting: motivated practical lighting with volumetric atmosphere. Style: high-end film production storyboard, photorealistic rendering quality, Hollywood-grade visual storytelling. Each frame should feel like a screenshot from a premium video advertisement.`;

                const res = await fetch('/api/generate-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt,
                        numberOfImages: 1,
                        aspectRatio: state.aspectRatio === '16:9' ? '16:9' : '9:16',
                    }),
                });

                if (!res.ok) throw new Error('Scene generation failed');
                const data = await res.json();
                if (data.images?.[0]) allScenes.push(data.images[0]);
            }

            updateStoryboard({ isGenerating: false, generatedScenes: allScenes });
        } catch (error) {
            console.error('Storyboard generation error:', error);
            updateStoryboard({ isGenerating: false, generatedScenes: [] });
        }
    }, [updateStoryboard, state.storyVision, state.aspectRatio, genre]);

    const handleDownload = useCallback((imgUrl: string, sceneName: string, is4K: boolean) => {
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
            link.download = `${sceneName}${is4K ? '_4K' : ''}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
        img.src = imgUrl;
    }, []);

    const totalDuration = SCENE_DURATIONS.reduce((sum, d) => sum + parseInt(d), 0);

    const outputContent = (
        <>
            {state.isGenerating ? (
                <div className={styles.loading}>
                    <div className={styles.spinnerWrap}>
                        <div className={styles.spinnerRing} />
                        <Film size={24} className={styles.spinnerIcon} />
                    </div>
                    <h3>Crafting Your Storyboard...</h3>
                    <p>Parsing script into 9 cinematic scenes</p>
                </div>
            ) : state.generatedScenes.length > 0 ? (
                <div className={styles.results}>
                    <div className={styles.resultsHeader}>
                        <h3><Clapperboard size={20} /> Storyboard Scenes</h3>
                        <div className={styles.headerActions}>
                            <span className={styles.badge}>{state.aspectRatio} &bull; 9 scenes &bull; ~{totalDuration}s</span>
                        </div>
                    </div>

                    {viewMode === 'grid' ? (
                        <div className={styles.grid}>
                            {state.generatedScenes.map((img, i) => (
                                <div key={i} className={styles.cellWrapper} style={{ animationDelay: `${i * 0.08}s` }}>
                                    <div className={`${styles.cell} ${state.aspectRatio === '16:9' ? styles.cellWide : styles.cellTall}`}>
                                        <img src={img} alt={`Scene ${i + 1}`} />
                                        <div className={styles.cellOverlay}>
                                            <span className={styles.sceneLabel}>Scene {i + 1}</span>
                                            <span className={styles.sceneTitle}>{SCENE_TITLES[i]}</span>
                                            <button className={styles.previewBtn} onClick={() => setPreviewScene(img)}>
                                                <Eye size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className={styles.sceneInfo}>
                                        <span className={styles.sceneDuration}><Clock size={12} /> {SCENE_DURATIONS[i]}</span>
                                        <span className={styles.sceneDesc}>{SCENE_DESCRIPTIONS[i]}</span>
                                    </div>
                                    <div className={styles.downloadRow}>
                                        <button className={styles.downloadBtn} onClick={() => handleDownload(img, `Scene_${i + 1}`, false)}>
                                            <Download size={14} /> Download
                                        </button>
                                        <button className={styles.download4kBtn} onClick={() => handleDownload(img, `Scene_${i + 1}`, true)}>
                                            <Download size={14} /> 4K
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Timeline View */
                        <div className={styles.timeline}>
                            {state.generatedScenes.map((img, i) => (
                                <div
                                    key={i}
                                    className={`${styles.timelineItem} ${activeScene === i ? styles.timelineItemActive : ''}`}
                                    onClick={() => setActiveScene(activeScene === i ? null : i)}
                                    style={{ animationDelay: `${i * 0.06}s` }}
                                >
                                    <div className={styles.timelineLeft}>
                                        <div className={styles.timelineNum}>{i + 1}</div>
                                        <div className={styles.timelineLine} />
                                    </div>
                                    <div className={styles.timelineThumb}>
                                        <img src={img} alt={`Scene ${i + 1}`} />
                                    </div>
                                    <div className={styles.timelineContent}>
                                        <div className={styles.timelineHeader}>
                                            <span className={styles.timelineTitle}>{SCENE_TITLES[i]}</span>
                                            <span className={styles.timelineDur}><Clock size={12} /> {SCENE_DURATIONS[i]}</span>
                                        </div>
                                        <p className={styles.timelineDesc}>{SCENE_DESCRIPTIONS[i]}</p>
                                        {activeScene === i && (
                                            <div className={styles.timelineExpanded}>
                                                <div className={styles.timelineActions}>
                                                    <button className={styles.downloadBtn} onClick={(e) => { e.stopPropagation(); handleDownload(img, `Scene_${i + 1}`, false); }}>
                                                        <Download size={14} /> Download
                                                    </button>
                                                    <button className={styles.download4kBtn} onClick={(e) => { e.stopPropagation(); handleDownload(img, `Scene_${i + 1}`, true); }}>
                                                        <Download size={14} /> 4K
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {i < 8 && <ArrowRight size={14} className={styles.timelineArrow} />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}><Film size={40} /></div>
                    <p>ستظهر المشاهد هنا بعد الإنشاء</p>
                </div>
            )}
        </>
    );

    return (
        <>
            <ToolLayout
                icon={<Film size={18} />}
                title="Storyboard"
                titleAr="اللوحة السينمائية"
                description="أنشئ لوحات سينمائية متسلسلة لقصتك أو إعلانك. اكتب السيناريو واحصل على مشاهد مرئية."
                output={outputContent}
            >
                <div>
                    <label className="label">Aspect Ratio</label>
                    <div className={styles.toggleGroup}>
                        <button
                            className={`${styles.toggleBtn} ${state.aspectRatio === '16:9' ? styles.toggleBtnActive : ''}`}
                            onClick={() => updateStoryboard({ aspectRatio: '16:9' })}
                        >
                            <Monitor size={14} /> 16:9 Landscape
                        </button>
                        <button
                            className={`${styles.toggleBtn} ${state.aspectRatio === '9:16' ? styles.toggleBtnActive : ''}`}
                            onClick={() => updateStoryboard({ aspectRatio: '9:16' })}
                        >
                            <Smartphone size={14} /> 9:16 Portrait
                        </button>
                    </div>
                </div>

                <SelectField
                    label="Content Genre"
                    value={genre}
                    onChange={setGenre}
                    options={GENRE_OPTIONS}
                />

                <ImageUploader
                    label="Reference Subject"
                    image={state.referenceSubject}
                    onUpload={(file, url) =>
                        updateStoryboard({ referenceSubject: { id: crypto.randomUUID(), file, url, name: file.name } })
                    }
                    onRemove={() => updateStoryboard({ referenceSubject: null })}
                />

                <div>
                    <label className="label">Story Vision / Ad Script</label>
                    <textarea
                        className="input-field"
                        rows={6}
                        placeholder="Describe your ad story or paste your script...&#10;&#10;Example: A 30-second perfume ad. Scene opens on a misty morning in Paris, a woman walks through a garden..."
                        value={state.storyVision}
                        onChange={(e) => updateStoryboard({ storyVision: e.target.value })}
                        style={{ resize: 'vertical', minHeight: '140px' }}
                    />
                </div>

                <div className={styles.generateBtnGroup}>
                    <button
                        className={`${styles.generateBtn} ${!state.storyVision.trim() ? styles.disabled : ''}`}
                        onClick={handleGenerate}
                        disabled={!state.storyVision.trim() || state.isGenerating}
                    >
                        {state.isGenerating ? (
                            <><Loader2 size={18} className={styles.spin} /> Generating...</>
                        ) : (
                            <><Zap size={18} /> Generate 9 Scenes</>
                        )}
                    </button>
                </div>

                {state.generatedScenes.length > 0 && (
                    <>
                        <div>
                            <label className="label">View Mode</label>
                            <div className={styles.toggleGroup}>
                                <button className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.toggleBtnActive : ''}`} onClick={() => setViewMode('grid')}>
                                    <LayoutGrid size={14} /> Grid View
                                </button>
                                <button className={`${styles.toggleBtn} ${viewMode === 'timeline' ? styles.toggleBtnActive : ''}`} onClick={() => setViewMode('timeline')}>
                                    <Clock size={14} /> Timeline
                                </button>
                            </div>
                        </div>
                        <button className={styles.resetBtnFull} onClick={() => updateStoryboard({ generatedScenes: [] })}>
                            <RotateCcw size={14} /> Reset Storyboard
                        </button>
                    </>
                )}
            </ToolLayout>

            {/* Scene Preview Modal */}
            {previewScene && (
                <div className={styles.previewModal} onClick={() => setPreviewScene(null)}>
                    <button className={styles.previewClose} onClick={() => setPreviewScene(null)}><X size={20} /></button>
                    <img src={previewScene} alt="Preview" className={styles.previewImage} onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </>
    );
}
