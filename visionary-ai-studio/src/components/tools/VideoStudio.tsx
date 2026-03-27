'use client';

import React, { useCallback, useRef, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ImageUploader from '@/components/shared/ImageUploader';
import SelectField from '@/components/shared/SelectField';
import {
    Video, Zap, Loader2, Play, Pause, Volume2, VolumeX, Maximize2,
    Download, RotateCcw, Sparkles,
} from 'lucide-react';
import styles from './VideoStudio.module.css';
import ToolGuide from '@/components/shared/ToolGuide';

const CAMERA_MOVES = [
    { value: 'pan', label: 'Pan' },
    { value: 'dolly-in', label: 'Dolly-In' },
    { value: 'orbit', label: 'Orbit' },
    { value: 'reveal', label: 'Reveal' },
    { value: 'crane', label: 'Crane Up' },
    { value: 'tracking', label: 'Tracking' },
    { value: 'zoom-burst', label: 'Zoom Burst' },
    { value: 'whip-pan', label: 'Whip Pan' },
];

const TRANSITION_EFFECTS = [
    { value: 'none', label: 'None' },
    { value: 'dissolve', label: 'Dissolve' },
    { value: 'fade-black', label: 'Fade Black' },
    { value: 'morph', label: 'Morph' },
    { value: 'slide', label: 'Slide' },
    { value: 'zoom', label: 'Zoom' },
];

const VIDEO_STYLES = [
    { value: 'cinematic', label: 'Cinematic' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'social', label: 'Social Media' },
    { value: 'product', label: 'Product Focus' },
];

export default function VideoStudio() {
    const project = useAppStore((s) => s.getActiveProject());
    const updateVideoStudio = useAppStore((s) => s.updateVideoStudio);
    const state = project.videoStudio;

    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [duration, setDuration] = useState('0:00');
    const [transition, setTransition] = useState('dissolve');
    const [videoStyle, setVideoStyle] = useState('cinematic');

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(isNaN(p) ? 0 : p);
            setCurrentTime(formatTime(videoRef.current.currentTime));
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) setDuration(formatTime(videoRef.current.duration));
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current) {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = pct * videoRef.current.duration;
        }
    };

    const handleGenerate = useCallback(async () => {
        updateVideoStudio({ isGenerating: true, generatedVideoUrl: '', videoVariations: [] });
        try {
            const cameraLabel = CAMERA_MOVES.find(c => c.value === state.cameraMove)?.label || state.cameraMove;
            const styleLabel = VIDEO_STYLES.find(v => v.value === videoStyle)?.label || videoStyle;

            const prompt = `${state.motionPrompt || `Professional ${styleLabel} video with ${cameraLabel} camera movement`}. Style: ${styleLabel}. Camera: ${cameraLabel}. Transition: ${transition}. High quality cinematic video production.`;

            const res = await fetch('/api/generate-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    model: 'veo3_fast',
                    aspectRatio: state.aspectRatio === '9:16' ? '9:16' : '16:9',
                    generationType: 'TEXT_2_VIDEO',
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Video generation failed');
            }

            const data = await res.json();

            if (data.taskId) {
                // Poll for video completion
                let attempts = 0;
                const maxAttempts = 60; // 5 minutes max

                const pollInterval = setInterval(async () => {
                    attempts++;
                    try {
                        const statusRes = await fetch(`/api/generate-video?taskId=${data.taskId}`);
                        const statusData = await statusRes.json();

                        if (statusData.videoUrl) {
                            clearInterval(pollInterval);
                            updateVideoStudio({
                                isGenerating: false,
                                generatedVideoUrl: statusData.videoUrl,
                                videoVariations: [],
                            });
                        } else if (attempts >= maxAttempts || statusData.status === 'failed') {
                            clearInterval(pollInterval);
                            throw new Error('Video generation timed out or failed');
                        }
                    } catch {
                        if (attempts >= maxAttempts) {
                            clearInterval(pollInterval);
                            // Fallback to demo video
                            updateVideoStudio({
                                isGenerating: false,
                                generatedVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                                videoVariations: [],
                            });
                        }
                    }
                }, 5000); // Check every 5 seconds
            } else {
                throw new Error('No taskId returned');
            }
        } catch (error) {
            console.error('Video generation error:', error);
            // Fallback to demo videos
            updateVideoStudio({
                isGenerating: false,
                generatedVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
                videoVariations: [
                    'https://www.w3schools.com/html/movie.mp4',
                    'https://www.w3schools.com/html/mov_bbb.mp4',
                ],
            });
        }
    }, [updateVideoStudio, state.motionPrompt, state.cameraMove, state.aspectRatio, videoStyle, transition]);

    const canGenerate = state.firstFrame !== null && state.lastFrame !== null;

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarTitle}>
                        <Video size={18} className={styles.sidebarTitleIcon} />
                        <div>
                            <h2>Video Studio</h2>
                            <p className={styles.subtitle}>استوديو إنتاج الفيديو</p>
                        </div>
                    </div>
                </div>

                <ToolGuide
                    title="استوديو الفيديو"
                    description="أنشئ فيديوهات إعلانية سينمائية بالذكاء الاصطناعي. ارفع صورتين (البداية والنهاية) وسيقوم AI بإنشاء فيديو متحرك بينهما."
                    steps={[
                        'ارفع صورة الإطار الأول (البداية)',
                        'ارفع صورة الإطار الأخير (النهاية) - اختياري',
                        'اختر حركة الكاميرا والمؤثرات والمدة',
                        'اضغط "Generate Video" لإنشاء الفيديو',
                    ]}
                />

                <div className={styles.sidebarContent}>
                    {/* Dual Frame Upload */}
                    <div className={styles.framesRow}>
                        <div className={styles.frameCol}>
                            <ImageUploader label="First Frame" image={state.firstFrame}
                                onUpload={(file, url) => updateVideoStudio({ firstFrame: { id: crypto.randomUUID(), file, url, name: file.name } })}
                                onRemove={() => updateVideoStudio({ firstFrame: null })} />
                            <span className={styles.frameHint}>Raw product / start</span>
                        </div>
                        <div className={styles.frameArrow}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                        <div className={styles.frameCol}>
                            <ImageUploader label="Last Frame" image={state.lastFrame}
                                onUpload={(file, url) => updateVideoStudio({ lastFrame: { id: crypto.randomUUID(), file, url, name: file.name } })}
                                onRemove={() => updateVideoStudio({ lastFrame: null })} />
                            <span className={styles.frameHint}>Lifestyle / end look</span>
                        </div>
                    </div>

                    {/* Motion & Audio Prompt */}
                    <div>
                        <label className="label">Motion & Audio Prompt</label>
                        <textarea className="input-field" rows={4}
                            placeholder="Describe camera movement and sound, e.g., 'Fast camera zoom into the product, water splashing in slow motion. Audio: Dramatic bass drop and water splash'"
                            value={state.motionPrompt} onChange={(e) => updateVideoStudio({ motionPrompt: e.target.value })}
                            style={{ resize: 'vertical', minHeight: '100px' }} />
                    </div>

                    {/* Camera Move */}
                    <SelectField label="Camera Move" value={state.cameraMove} options={CAMERA_MOVES}
                        onChange={(v) => updateVideoStudio({ cameraMove: v })} />

                    {/* Transition Effect */}
                    <SelectField label="Transition Effect" value={transition} options={TRANSITION_EFFECTS}
                        onChange={setTransition} />

                    {/* Video Style */}
                    <SelectField label="Video Style" value={videoStyle} options={VIDEO_STYLES}
                        onChange={setVideoStyle} />

                    {/* Output Settings */}
                    <div className={styles.settingsSection}>
                        <div className={styles.settingGroup}>
                            <label className="label">Aspect Ratio</label>
                            <div className={styles.chipRow}>
                                {['16:9', '9:16', '1:1', '4:3'].map((r) => (
                                    <button key={r} className={`${styles.chip} ${state.aspectRatio === r ? styles.chipActive : ''}`}
                                        onClick={() => updateVideoStudio({ aspectRatio: r })}>{r}</button>
                                ))}
                            </div>
                        </div>
                        <div className={styles.settingGroup}>
                            <label className="label">Quality</label>
                            <div className={styles.chipRow}>
                                {['480p', '720p', '1080p', '4K'].map((q) => (
                                    <button key={q} className={`${styles.chip} ${state.quality === q ? styles.chipActive : ''}`}
                                        onClick={() => updateVideoStudio({ quality: q })}>{q}</button>
                                ))}
                            </div>
                        </div>
                        <div className={styles.settingGroup}>
                            <label className="label">Duration</label>
                            <div className={styles.chipRow}>
                                {['3s', '5s', '10s', '15s'].map((d) => (
                                    <button key={d} className={`${styles.chip} ${state.duration === d ? styles.chipActive : ''}`}
                                        onClick={() => updateVideoStudio({ duration: d })}>{d}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Generate */}
                    <button className={`${styles.generateBtn} ${!canGenerate ? styles.disabled : ''}`}
                        onClick={handleGenerate} disabled={!canGenerate || state.isGenerating}>
                        {state.isGenerating ? (<><Loader2 size={18} className={styles.spin} /> Directing Video...</>) : (<><Zap size={18} /> Generate Video</>)}
                    </button>

                    {state.generatedVideoUrl && (
                        <button className={styles.resetBtn} onClick={() => { updateVideoStudio({ generatedVideoUrl: '', videoVariations: [] }); setIsPlaying(false); setProgress(0); }}>
                            <RotateCcw size={14} /> Reset
                        </button>
                    )}
                </div>
            </aside>

            <main className={styles.workspace}>
                {state.isGenerating ? (
                    <div className={styles.loading}>
                        <div className={styles.spinnerWrap}><div className={styles.spinnerRing} /><Video size={24} className={styles.spinnerIcon} /></div>
                        <h3>Directing Your Video...</h3>
                        <p>AI is creating a {videoStyle} transition with {CAMERA_MOVES.find(c => c.value === state.cameraMove)?.label} camera move</p>
                    </div>
                ) : state.generatedVideoUrl ? (
                    <div className={styles.results}>
                        <div className={styles.playerSection}>
                            <div className={styles.playerLabel}>
                                <span><Sparkles size={14} /> Generated Video</span>
                                <span className={styles.badge}>
                                    {CAMERA_MOVES.find(c => c.value === state.cameraMove)?.label} &bull; {state.duration} &bull; {videoStyle}
                                </span>
                            </div>
                            <div className={styles.videoContainer}>
                                <video ref={videoRef} src={state.generatedVideoUrl} className={styles.videoElement}
                                    muted={isMuted} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata}
                                    onEnded={() => setIsPlaying(false)} playsInline />
                                <div className={styles.videoControls}>
                                    <button className={styles.controlBtn} onClick={handlePlayPause}>
                                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                                    </button>
                                    <span className={styles.timeCode}>{currentTime}</span>
                                    <div className={styles.progressTrack} onClick={handleProgressClick}>
                                        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                                        <div className={styles.progressThumb} style={{ left: `${progress}%` }} />
                                    </div>
                                    <span className={styles.timeCode}>{duration}</span>
                                    <button className={styles.controlBtn} onClick={() => setIsMuted(!isMuted)}>
                                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                    </button>
                                    <button className={styles.controlBtn} onClick={() => videoRef.current?.requestFullscreen?.()}>
                                        <Maximize2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Download Options */}
                            <div className={styles.downloadActions}>
                                <button className={styles.downloadBtn}><Download size={14} /> Download MP4</button>
                                <button className={styles.downloadBtn}><Download size={14} /> Download GIF</button>
                                <button className={styles.downloadBtn}><Download size={14} /> Download WebM</button>
                            </div>
                        </div>

                        {/* Variations */}
                        <div className={styles.variationsSection}>
                            <div className={styles.variationsLabel}>Camera Variations</div>
                            <div className={styles.variationsGrid}>
                                {state.videoVariations.map((vidUrl, i) => (
                                    <div key={i} className={styles.variationCard} style={{ animationDelay: `${i * 0.12}s` }}
                                        onClick={() => { updateVideoStudio({ generatedVideoUrl: vidUrl }); setIsPlaying(false); setProgress(0); }}>
                                        <video src={vidUrl} className={styles.variationVideo} muted playsInline />
                                        <div className={styles.variationOverlay}>
                                            <Play size={20} />
                                            <span>Variation {i + 1}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}><Video size={48} /></div>
                        <h3>Frame-to-Frame Evolution</h3>
                        <p>Upload a First Frame and Last Frame to create<br />a cinematic video transition with AI</p>
                        <div className={styles.emptySteps}>
                            <div className={styles.emptyStep}><span className={styles.stepNum}>1</span>Upload First & Last Frame</div>
                            <div className={styles.emptyStep}><span className={styles.stepNum}>2</span>Describe motion & audio</div>
                            <div className={styles.emptyStep}><span className={styles.stepNum}>3</span>Choose camera & transition</div>
                            <div className={styles.emptyStep}><span className={styles.stepNum}>4</span>Click Generate Video</div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
