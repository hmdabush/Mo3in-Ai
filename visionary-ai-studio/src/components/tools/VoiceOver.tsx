'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import SelectField from '@/components/shared/SelectField';
import {
    Mic, Zap, Loader2, Play, Pause, Download, RotateCcw,
    Volume2, Clock, Globe,
} from 'lucide-react';
import styles from './VoiceOver.module.css';

const VOICES = [
    { id: 'Kore', name: 'Kore', desc: 'Warm, Professional' },
    { id: 'Puck', name: 'Puck', desc: 'Energetic, Young' },
    { id: 'Fenrir', name: 'Fenrir', desc: 'Deep, Authoritative' },
    { id: 'Charon', name: 'Charon', desc: 'Calm, Soothing' },
    { id: 'Aoede', name: 'Aoede', desc: 'Melodic, Expressive' },
    { id: 'Leda', name: 'Leda', desc: 'Soft, Elegant' },
];

const LANGUAGE_OPTIONS = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'Arabic' },
    { value: 'fr', label: 'French' },
    { value: 'es', label: 'Spanish' },
    { value: 'de', label: 'German' },
    { value: 'tr', label: 'Turkish' },
];

export default function VoiceOver() {
    const project = useAppStore((s) => s.getActiveProject());
    const updateVoiceOver = useAppStore((s) => s.updateVoiceOver);
    const state = project.voiceover;

    const [speed, setSpeed] = useState(100);
    const [pitch, setPitch] = useState(100);
    const [language, setLanguage] = useState('en');
    const [isPlaying, setIsPlaying] = useState(false);
    const [playingHistory, setPlayingHistory] = useState<number | null>(null);

    const handleGenerate = useCallback(() => {
        updateVoiceOver({ isGenerating: true });
        setTimeout(() => {
            const audioUrl = 'simulated-audio-url';
            const timestamp = new Date().toLocaleTimeString();
            updateVoiceOver({
                isGenerating: false,
                generatedAudioUrl: audioUrl,
                audioHistory: [{ url: audioUrl, voice: state.selectedVoice, timestamp }, ...state.audioHistory],
            });
        }, 2500);
    }, [updateVoiceOver, state.selectedVoice, state.audioHistory]);

    const waveBars = useMemo(() => {
        return Array.from({ length: 60 }, () => Math.random() * 40 + 10);
    }, []);

    const selectedVoiceData = VOICES.find((v) => v.id === state.selectedVoice) || VOICES[0];

    const estimatedDuration = useMemo(() => {
        const wordsPerMin = 150 * (speed / 100);
        const words = state.script.split(/\s+/).filter(Boolean).length;
        const seconds = Math.round((words / wordsPerMin) * 60);
        return seconds > 0 ? `~${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}` : '0:00';
    }, [state.script, speed]);

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarTitle}>
                        <Mic size={18} className={styles.sidebarTitleIcon} />
                        <div><h2>Voice Over</h2><p className={styles.subtitle}>التعليق الصوتي</p></div>
                    </div>
                </div>
                <div className={styles.sidebarContent}>
                    <div>
                        <label className="label">Script</label>
                        <textarea className="input-field" rows={6}
                            placeholder={'Enter your ad script or narration text...\n\nExample: Discover the future of skincare. Our revolutionary formula combines nature and science...'}
                            value={state.script} onChange={(e) => updateVoiceOver({ script: e.target.value })}
                            style={{ resize: 'vertical', minHeight: '140px' }} />
                        <div className={styles.scriptMeta}>
                            <span>{state.script.length} chars</span>
                            <span>{state.script.split(/\s+/).filter(Boolean).length} words</span>
                            <span><Clock size={10} /> {estimatedDuration}</span>
                        </div>
                    </div>

                    <div>
                        <label className="label">Style / Dialect Instructions</label>
                        <input className="input-field" placeholder="e.g., 'Confident and inspiring, with a slight Gulf accent'"
                            value={state.styleInstructions} onChange={(e) => updateVoiceOver({ styleInstructions: e.target.value })} />
                    </div>

                    <SelectField label="Language" value={language} onChange={setLanguage} options={LANGUAGE_OPTIONS} />

                    <div>
                        <label className="label">Voice Actor</label>
                        <div className={styles.voiceGrid}>
                            {VOICES.map((v) => (
                                <button key={v.id} className={`${styles.voiceCard} ${state.selectedVoice === v.id ? styles.voiceCardActive : ''}`}
                                    onClick={() => updateVoiceOver({ selectedVoice: v.id })}>
                                    <span className={styles.voiceAvatar}>{v.name[0]}</span>
                                    <span className={styles.voiceName}>{v.name}</span>
                                    <span className={styles.voiceDesc}>{v.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Speed & Pitch Controls */}
                    <div className={styles.controlsSection}>
                        <div className={styles.controlRow}>
                            <span className={styles.controlLabel}><Volume2 size={12} /> Speed</span>
                            <input type="range" min="50" max="200" value={speed} onChange={(e) => setSpeed(+e.target.value)} className={styles.controlSlider} />
                            <span className={styles.controlVal}>{speed}%</span>
                        </div>
                        <div className={styles.controlRow}>
                            <span className={styles.controlLabel}><Mic size={12} /> Pitch</span>
                            <input type="range" min="50" max="150" value={pitch} onChange={(e) => setPitch(+e.target.value)} className={styles.controlSlider} />
                            <span className={styles.controlVal}>{pitch}%</span>
                        </div>
                    </div>

                    <button className={`${styles.generateBtn} ${!state.script.trim() ? styles.disabled : ''}`}
                        onClick={handleGenerate} disabled={!state.script.trim() || state.isGenerating}>
                        {state.isGenerating ? (<><Loader2 size={18} className={styles.spin} /> Generating Audio...</>) : (<><Zap size={18} /> Generate Voice Over</>)}
                    </button>

                    {state.generatedAudioUrl && (
                        <button className={styles.resetBtn} onClick={() => { updateVoiceOver({ generatedAudioUrl: '' }); setIsPlaying(false); }}>
                            <RotateCcw size={14} /> Reset
                        </button>
                    )}
                </div>
            </aside>

            <main className={styles.workspace}>
                {state.isGenerating ? (
                    <div className={styles.loading}>
                        <div className={styles.spinnerWrap}><div className={styles.spinnerRing} /><Mic size={24} className={styles.spinnerIcon} /></div>
                        <h3>Recording Voice Over...</h3>
                        <p>Processing script with {selectedVoiceData.name} voice at {speed}% speed</p>
                    </div>
                ) : state.generatedAudioUrl ? (
                    <div className={styles.playerSection}>
                        <div className={styles.playerLabel}>Generated Audio</div>
                        <div className={styles.playerCard}>
                            <div className={styles.playerMeta}>
                                <div className={styles.playerAvatar}>{selectedVoiceData.name[0]}</div>
                                <div className={styles.playerInfo}>
                                    <h4>{selectedVoiceData.name}</h4>
                                    <p>{selectedVoiceData.desc} &bull; {state.script.split(/\s+/).filter(Boolean).length} words &bull; {LANGUAGE_OPTIONS.find(l => l.value === language)?.label}</p>
                                </div>
                            </div>

                            <div className={styles.waveform}>
                                {waveBars.map((h, i) => (
                                    <div key={i} className={styles.waveBar}
                                        style={{ height: `${h}%`, opacity: i < 22 ? 1 : 0.3 }} />
                                ))}
                            </div>

                            <div className={styles.playerControls}>
                                <button className={styles.playBtn} onClick={() => setIsPlaying(!isPlaying)}>
                                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                                </button>
                                <span className={styles.timeLabel}>0:12</span>
                                <div className={styles.progressBar}><div className={styles.progressFill} /></div>
                                <span className={styles.timeLabel}>{estimatedDuration.replace('~', '')}</span>
                            </div>

                            <div className={styles.playerActions}>
                                <button className={styles.playerActionBtn}><Download size={14} /> Download MP3</button>
                                <button className={styles.playerActionBtn}><Download size={14} /> Download WAV</button>
                            </div>
                        </div>

                        {/* Audio Settings Summary */}
                        <div className={styles.settingsSummary}>
                            <div className={styles.settingTag}><Globe size={10} /> {LANGUAGE_OPTIONS.find(l => l.value === language)?.label}</div>
                            <div className={styles.settingTag}><Volume2 size={10} /> Speed: {speed}%</div>
                            <div className={styles.settingTag}><Mic size={10} /> Pitch: {pitch}%</div>
                        </div>

                        {state.audioHistory.length > 0 && (
                            <>
                                <div className={styles.historyTitle}>Audio History ({state.audioHistory.length})</div>
                                <div className={styles.historyList}>
                                    {state.audioHistory.map((item, i) => (
                                        <div key={i} className={styles.historyItem}>
                                            <button className={styles.historyPlayBtn}
                                                onClick={() => setPlayingHistory(playingHistory === i ? null : i)}>
                                                {playingHistory === i ? <Pause size={12} /> : <Play size={12} />}
                                            </button>
                                            <div className={styles.historyMeta}>
                                                <div className={styles.historyVoice}>{item.voice}</div>
                                                <div className={styles.historyTime}>{item.timestamp}</div>
                                            </div>
                                            <button className={styles.historyDownload}><Download size={12} /></button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}><Mic size={48} /></div>
                        <h3>Voice Over Studio</h3>
                        <p>Write your script, choose a voice actor,<br />and generate professional AI narration</p>
                    </div>
                )}
            </main>
        </div>
    );
}
