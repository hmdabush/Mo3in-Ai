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

const DUMMY_PROMPT = `A professional product photograph of a sleek, matte-black wireless earbuds case resting on a smooth marble surface. The scene is lit with soft, diffused natural light coming from the upper-left at approximately 45 degrees, creating gentle shadows and subtle highlights on the product's curved surfaces.

Camera: Sony A7R IV with a 90mm macro lens at f/2.8, creating a shallow depth of field with a beautifully blurred background. The focus is tack-sharp on the product logo.

Environment: Minimalist studio setting with a gradient backdrop transitioning from warm cream to soft white. A single eucalyptus leaf is placed casually in the background for organic contrast.

Color Palette: Dominant blacks and charcoals of the product against warm neutral tones. Subtle golden reflection on the marble surface adds warmth.

Post-Processing: Adobe Lightroom adjustments — slight clarity boost (+15), dehaze (+10), split toning with warm highlights and cool shadows. Final output maintains a clean, premium advertising aesthetic suitable for social media and e-commerce platforms.

Style Reference: Apple-inspired minimalist product photography with a touch of Scandinavian design aesthetics. High-end commercial look with attention to material textures and surface reflections.`;

const DUMMY_VARIATIONS = [
    `Product shot on dark obsidian surface, dramatic side-lighting with sharp shadows. Camera: 85mm f/1.4, shallow DOF. Mood: mysterious, high-end. Post: high contrast, desaturated with teal highlights.`,
    `Floating product on pure white infinity curve, soft ring light from above. Camera: 100mm macro f/4, focus stacking. Mood: clean, clinical precision. Post: overexposed whites, minimal shadows.`,
    `Product in natural environment — wooden table by window, golden hour light streaming in. Camera: 35mm f/2, environmental context. Mood: warm, inviting, lifestyle. Post: warm tones, film grain.`,
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
                    systemPrompt: `You are an expert AI image prompt engineer. You specialize in crafting highly detailed, professional prompts for AI image generation models like Midjourney, DALL-E 3, Stable Diffusion, and Flux. Always respond in JSON format only with no additional text.`,
                    prompt: `Generate a detailed, professional AI image generation prompt with the following parameters:
- Template: ${templateLabel}
- Target AI Model: ${modelLabel}
- Style Tags: ${styleLabels}
- User Instructions: ${state.instructions || 'Generate a high-quality prompt based on the template and styles'}

Return a JSON object (no text before or after) in this format:
{
  "mainPrompt": "A very detailed prompt (200+ words) describing the scene, lighting, camera, lens, color palette, composition, post-processing, and style references. Be extremely specific about technical details.",
  "variations": [
    "Variation 1: Same subject but different lighting/mood/angle (100+ words)",
    "Variation 2: Same subject but different environment/setting (100+ words)",
    "Variation 3: Same subject but different artistic style/post-processing (100+ words)"
  ]
}

Make the main prompt extremely detailed with specific camera settings (lens mm, f-stop, ISO), lighting setup, color palette hex codes, post-processing steps, and style references.`,
                    maxTokens: 3000,
                }),
            });

            if (!res.ok) throw new Error('API request failed');
            const data = await res.json();

            let mainPrompt = DUMMY_PROMPT;
            let vars = DUMMY_VARIATIONS;

            try {
                const text = data.text.trim();
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
                mainPrompt = parsed.mainPrompt || DUMMY_PROMPT;
                vars = parsed.variations || DUMMY_VARIATIONS;
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
            const timestamp = new Date().toLocaleTimeString();
            updatePrompt({
                isGenerating: false,
                generatedPrompt: DUMMY_PROMPT,
                promptHistory: [{ prompt: DUMMY_PROMPT, timestamp }, ...state.promptHistory],
            });
            setVariations(DUMMY_VARIATIONS);
            setShowVariations(true);
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
