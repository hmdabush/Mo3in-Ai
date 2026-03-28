'use client';

import React, { useCallback, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ImageUploader from '@/components/shared/ImageUploader';
import SelectField from '@/components/shared/SelectField';
import {
    Wand2, Zap, Loader2, Copy, Check, BookOpen, Palette,
    RefreshCw, Sparkles, RotateCcw,
} from 'lucide-react';
import ToolLayout from '@/components/shared/ToolLayout';
import styles from './PromptEngineer.module.css';

const PROMPT_TEMPLATES = [
    { value: 'product', label: 'Product Photography', prefix: 'A professional product photograph of' },
    { value: 'lifestyle', label: 'Lifestyle Scene', prefix: 'A lifestyle photograph showing' },
    { value: 'food', label: 'Food Photography', prefix: 'A gourmet food photograph of' },
    { value: 'fashion', label: 'Fashion Editorial', prefix: 'A high-fashion editorial photograph of' },
    { value: 'architecture', label: 'Architecture', prefix: 'An architectural photograph of' },
    { value: 'portrait', label: 'Portrait', prefix: 'A professional portrait photograph of' },
];

const STYLE_LIBRARY = [
    { value: 'cinematic', label: 'Cinematic' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'editorial', label: 'Editorial' },
    { value: 'vintage', label: 'Vintage Film' },
    { value: 'neon', label: 'Neon Glow' },
    { value: 'watercolor', label: 'Watercolor' },
    { value: '3d-render', label: '3D Render' },
    { value: 'flat-design', label: 'Flat Design' },
];

const AI_MODELS = [
    { value: 'midjourney', label: 'Midjourney' },
    { value: 'dalle', label: 'DALL-E 3' },
    { value: 'stable', label: 'Stable Diffusion' },
    { value: 'flux', label: 'Flux' },
];

export default function PromptEngineer() {
    const project = useAppStore((s) => s.getActiveProject());
    const updatePrompt = useAppStore((s) => s.updatePrompt);
    const state = project.prompt;
    const [copied, setCopied] = useState(false);
    const [copiedVar, setCopiedVar] = useState<number | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState('product');
    const [selectedStyles, setSelectedStyles] = useState<string[]>(['cinematic']);
    const [targetModel, setTargetModel] = useState('midjourney');
    const [variations, setVariations] = useState<string[]>([]);
    const [showVariations, setShowVariations] = useState(false);

    const toggleStyle = useCallback((value: string) => {
        setSelectedStyles(prev =>
            prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
        );
    }, []);

    const handleGenerate = useCallback(async () => {
        updatePrompt({ isGenerating: true });
        try {
            const templateLabel = PROMPT_TEMPLATES.find(t => t.value === selectedTemplate)?.label || selectedTemplate;
            const modelLabel = AI_MODELS.find(m => m.value === targetModel)?.label || targetModel;
            const styleLabels = selectedStyles.map(s => STYLE_LIBRARY.find(sl => sl.value === s)?.label || s).join(', ');

            const res = await fetch('/api/generate-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tool: 'prompt-engineer',
                    systemPrompt: `You are the world's leading AI image prompt engineer with deep expertise in Midjourney v6, DALL-E 3, Stable Diffusion XL, and Flux Pro. You understand the nuances of each model's prompt syntax, weight systems, and style triggers. You craft prompts that consistently produce award-winning, commercially viable images. Your prompts include precise technical photography parameters, artistic direction, and model-specific optimizations. Always respond in JSON format only with no additional text.`,
                    prompt: `Generate a masterclass-level AI image generation prompt with the following parameters:
- Template Category: ${templateLabel}
- Target AI Model: ${modelLabel}
- Style Direction: ${styleLabels}
- User Vision: ${state.instructions || 'Generate a high-quality, commercially viable prompt based on the template and styles'}

Return a JSON object (no text before or after) in this exact format:
{
  "mainPrompt": "An extremely detailed prompt (300+ words) that includes: 1) Subject description with precise details, 2) Environment/setting with atmospheric details, 3) Lighting setup (key light, fill light, rim light, practical lights), 4) Camera specifications (exact lens mm, f-stop, ISO, shutter speed, sensor format), 5) Color palette with specific hex codes, 6) Composition technique (rule of thirds, golden ratio, leading lines), 7) Texture and material descriptions, 8) Post-processing pipeline (color grading, tone mapping, sharpening), 9) Art direction references (specific photographers, art movements, film looks), 10) Model-specific syntax and parameters for ${modelLabel}",
  "negativePrompt": "A comprehensive negative prompt to avoid common AI artifacts and unwanted elements",
  "variations": [
    "Variation 1: Same subject, dramatically different lighting - describe a complete alternative lighting setup with mood shift (150+ words)",
    "Variation 2: Same subject, completely different environment/context - new setting with atmospheric details (150+ words)",
    "Variation 3: Same subject, different artistic interpretation - new style, post-processing, and art direction (150+ words)"
  ],
  "modelTips": "3-5 specific tips for getting the best results with ${modelLabel} for this type of image"
}

Critical: Every detail must be specific and actionable. No vague descriptions like 'beautiful' or 'nice' - use precise technical and artistic terminology.`,
                    maxTokens: 3000,
                }),
            });

            if (!res.ok) throw new Error('API request failed');
            const data = await res.json();

            let mainPrompt = '';
            let vars: string[] = [];

            try {
                const text = data.text.trim();
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
                mainPrompt = parsed.mainPrompt || '';
                vars = parsed.variations || [];
            } catch {
                console.error('Failed to parse prompt response:', data.text);
            }

            const timestamp = new Date().toLocaleTimeString();
            updatePrompt({
                isGenerating: false,
                generatedPrompt: mainPrompt,
                promptHistory: [{ prompt: mainPrompt, timestamp }, ...state.promptHistory],
            });
            setVariations(vars);
            setShowVariations(true);
        } catch (error) {
            console.error('Generation error:', error);
            updatePrompt({ isGenerating: false, generatedPrompt: '' });
            setVariations([]);
            setShowVariations(false);
        }
    }, [updatePrompt, state.promptHistory, state.instructions, selectedTemplate, targetModel, selectedStyles]);

    const handleCopy = useCallback((text: string, varIdx?: number) => {
        navigator.clipboard.writeText(text);
        if (varIdx !== undefined) {
            setCopiedVar(varIdx);
            setTimeout(() => setCopiedVar(null), 2000);
        } else {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, []);

    const handleRegenerate = useCallback(() => {
        setVariations([]);
        setShowVariations(false);
        handleGenerate();
    }, [handleGenerate]);

    const outputJSX = (
                state.isGenerating ? (
                    <div className={styles.loading}>
                        <div className={styles.spinnerWrap}><div className={styles.spinnerRing} /><Wand2 size={24} className={styles.spinnerIcon} /></div>
                        <h3>Analyzing Image DNA...</h3>
                        <p>Extracting lighting, composition, lens, and style details for {AI_MODELS.find(m => m.value === targetModel)?.label}</p>
                    </div>
                ) : state.generatedPrompt ? (
                    <div className={styles.promptResult}>
                        <div className={styles.promptLabel}>
                            <Sparkles size={14} /> Generated Prompt &bull; {AI_MODELS.find(m => m.value === targetModel)?.label}
                        </div>
                        <div className={styles.promptBox}>
                            <button className={styles.copyBtn} onClick={() => handleCopy(state.generatedPrompt)}>
                                {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                            </button>
                            {state.generatedPrompt}
                        </div>

                        <div className={styles.promptActions}>
                            <button className={styles.actionBtn} onClick={handleRegenerate}>
                                <RefreshCw size={14} /> Regenerate
                            </button>
                        </div>

                        {/* Prompt Variations */}
                        {showVariations && variations.length > 0 && (
                            <div className={styles.variationsSection}>
                                <div className={styles.variationsTitle}>
                                    <Sparkles size={14} /> Prompt Variations ({variations.length})
                                </div>
                                {variations.map((v, i) => (
                                    <div key={i} className={styles.variationCard}>
                                        <div className={styles.variationHeader}>
                                            <span className={styles.variationLabel}>Variation {i + 1}</span>
                                            <button className={styles.variationCopy} onClick={() => handleCopy(v, i)}>
                                                {copiedVar === i ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
                                            </button>
                                        </div>
                                        <p className={styles.variationText}>{v}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {state.promptHistory.length > 0 && (
                            <>
                                <div className={styles.historyTitle}><BookOpen size={14} /> Prompt History ({state.promptHistory.length})</div>
                                <div className={styles.historyList}>
                                    {state.promptHistory.map((item, i) => (
                                        <div key={i} className={styles.historyItem} onClick={() => updatePrompt({ generatedPrompt: item.prompt })}>
                                            <div className={styles.historyText}>{item.prompt}</div>
                                            <div className={styles.historyTime}>{item.timestamp}</div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}><Wand2 size={40} /></div>
                        <p>ستظهر النتائج هنا بعد التحليل</p>
                    </div>
                )
    );

    return (
        <ToolLayout
            icon={<Wand2 size={18} />}
            title="Prompt Engineer"
            titleAr="هندسة الأوامر"
            description="حلل أي صورة واستخرج الأوامر المستخدمة لإنشائها. ارفع الصورة واحصل على البرومبت."
            output={outputJSX}
        >
                    <ImageUploader label="Reference Image" image={state.referenceImage}
                        onUpload={(file, url) => updatePrompt({ referenceImage: { id: crypto.randomUUID(), file, url, name: file.name } })}
                        onRemove={() => updatePrompt({ referenceImage: null })} />

                    <SelectField label="Prompt Template" value={selectedTemplate} onChange={setSelectedTemplate} options={PROMPT_TEMPLATES} />
                    <SelectField label="Target AI Model" value={targetModel} onChange={setTargetModel} options={AI_MODELS} />

                    <div>
                        <label className="label"><Palette size={12} /> Style Tags (multi-select)</label>
                        <div className={styles.styleGrid}>
                            {STYLE_LIBRARY.map((s) => (
                                <button key={s.value}
                                    className={`${styles.styleBtn} ${selectedStyles.includes(s.value) ? styles.styleBtnActive : ''}`}
                                    onClick={() => toggleStyle(s.value)}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="label">Instructions / Idea</label>
                        <textarea className="input-field" rows={4}
                            placeholder="What kind of prompt do you want? e.g., 'Create a detailed Midjourney prompt for product photography with this exact lighting style'"
                            value={state.instructions} onChange={(e) => updatePrompt({ instructions: e.target.value })}
                            style={{ resize: 'vertical', minHeight: '100px' }} />
                    </div>

                    <button className={`${styles.generateBtn} ${!state.referenceImage ? styles.disabled : ''}`}
                        onClick={handleGenerate} disabled={!state.referenceImage || state.isGenerating}>
                        {state.isGenerating ? (<><Loader2 size={18} className={styles.spin} /> Analyzing Image...</>) : (<><Zap size={18} /> Reverse-Engineer Prompt</>)}
                    </button>
        </ToolLayout>
    );
}
