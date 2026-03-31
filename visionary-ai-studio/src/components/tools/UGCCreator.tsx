'use client';

import React, { useCallback, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ImageUploader from '@/components/shared/ImageUploader';
import SelectField from '@/components/shared/SelectField';
import {
    Users, Zap, Loader2, RotateCcw, Download, Play, Pause,
    Volume2, Video, Sparkles, Image, FileText, ChevronRight,
    Check, Copy, Mic,
} from 'lucide-react';
import styles from './UGCCreator.module.css';
import ToolLayout from '@/components/shared/ToolLayout';

const CHARACTER_TYPES = [
    { value: 'young-woman', label: 'شابة (18-25)', promptEn: 'Young woman aged 20-25, natural beauty, casual modern style, authentic social media influencer look' },
    { value: 'young-man', label: 'شاب (18-25)', promptEn: 'Young man aged 20-25, clean-cut, trendy casual style, authentic social media creator look' },
    { value: 'business-woman', label: 'سيدة أعمال (30-40)', promptEn: 'Professional businesswoman aged 30-40, elegant corporate style, confident and polished appearance' },
    { value: 'business-man', label: 'رجل أعمال (30-40)', promptEn: 'Professional businessman aged 30-40, smart business casual, confident and trustworthy appearance' },
    { value: 'mother', label: 'أم شابة (28-35)', promptEn: 'Young mother aged 28-35, warm and approachable, casual comfortable style, relatable everyday look' },
    { value: 'fitness', label: 'مدرب رياضي', promptEn: 'Fitness trainer, athletic build, sporty activewear, energetic and motivational appearance' },
    { value: 'student', label: 'طالب جامعي', promptEn: 'College student aged 19-22, casual trendy style, backpack, youthful and relatable appearance' },
    { value: 'expert', label: 'خبير/متخصص (40-50)', promptEn: 'Industry expert aged 40-50, glasses, professional attire, authoritative and knowledgeable appearance' },
];

const SKIN_TONES = [
    { value: 'light', label: 'فاتح' },
    { value: 'medium', label: 'متوسط' },
    { value: 'olive', label: 'قمحي' },
    { value: 'tan', label: 'أسمر' },
    { value: 'dark', label: 'داكن' },
];

const BACKGROUNDS = [
    { value: 'home', label: 'منزل عصري', promptEn: 'modern cozy living room with soft natural lighting' },
    { value: 'office', label: 'مكتب', promptEn: 'modern minimalist office with plants and natural light' },
    { value: 'cafe', label: 'مقهى', promptEn: 'trendy cafe with warm ambient lighting and blurred background' },
    { value: 'outdoor', label: 'خارجي', promptEn: 'outdoor urban setting with soft golden hour lighting' },
    { value: 'studio', label: 'استوديو', promptEn: 'clean white/gray professional studio with soft lighting' },
    { value: 'gym', label: 'صالة رياضية', promptEn: 'modern gym with dramatic lighting' },
];

const SCRIPT_TONES = [
    { value: 'excited', label: 'حماسي' },
    { value: 'casual', label: 'عفوي' },
    { value: 'professional', label: 'مهني' },
    { value: 'storytelling', label: 'قصصي' },
    { value: 'review', label: 'مراجعة صادقة' },
    { value: 'unboxing', label: 'فتح صندوق' },
];

const DIALECT_OPTIONS = [
    { value: 'egyptian', label: 'مصري' },
    { value: 'khaliji', label: 'خليجي' },
    { value: 'levantine', label: 'شامي' },
    { value: 'msa', label: 'فصحى' },
    { value: 'english', label: 'English' },
];

type UGCStep = 'setup' | 'character' | 'script' | 'video';

export default function UGCCreator() {
    const project = useAppStore((s) => s.getActiveProject());
    const updateUGC = useAppStore((s) => s.updateUGC);
    const state = project.ugc;

    const [activeStep, setActiveStep] = useState<UGCStep>('setup');
    const [characterType, setCharacterType] = useState('young-woman');
    const [skinTone, setSkinTone] = useState('olive');
    const [background, setBackground] = useState('home');
    const [scriptTone, setScriptTone] = useState('excited');
    const [dialect, setDialect] = useState('khaliji');
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [copiedScript, setCopiedScript] = useState(false);

    // Step 1: Generate Character Photo
    const handleGenerateCharacter = useCallback(async () => {
        updateUGC({ isGeneratingCharacter: true, characterImage: '' });
        try {
            const charDef = CHARACTER_TYPES.find(c => c.value === characterType);
            const bgDef = BACKGROUNDS.find(b => b.value === background);

            const prompt = `Ultra realistic portrait photograph of a real person for UGC content creation. ${charDef?.promptEn}. Skin tone: ${skinTone}. Setting: ${bgDef?.promptEn}. The person is looking directly at the camera with a natural, genuine expression as if recording a selfie video testimonial. Shot on iPhone 15 Pro, natural lighting, shallow depth of field on background, sharp focus on face. The person should look like a real social media user, NOT a model. Photorealistic, candid feel, authentic UGC aesthetic. Upper body framing, centered composition.`;

            const res = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, numberOfImages: 1, aspectRatio: '9:16' }),
            });

            if (!res.ok) throw new Error('Character generation failed');
            const data = await res.json();

            if (data.images?.[0]) {
                updateUGC({ isGeneratingCharacter: false, characterImage: data.images[0] });
                setActiveStep('script');
            } else {
                updateUGC({ isGeneratingCharacter: false });
            }
        } catch (error) {
            console.error('Character generation error:', error);
            updateUGC({ isGeneratingCharacter: false });
        }
    }, [updateUGC, characterType, skinTone, background]);

    // Step 2: Generate Script
    const handleGenerateScript = useCallback(async () => {
        updateUGC({ isGeneratingScript: true, generatedScript: '' });
        try {
            const toneDef = SCRIPT_TONES.find(t => t.value === scriptTone);
            const dialectLabel = DIALECT_OPTIONS.find(d => d.value === dialect)?.label || dialect;

            const res = await fetch('/api/generate-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tool: 'ugc',
                    systemPrompt: `أنت كاتب سكربتات UGC محترف متخصص في إنشاء محتوى إعلاني يبدو طبيعياً وعفوياً كأنه من مستخدم حقيقي. تكتب سكربتات قصيرة (30-60 ثانية) تحقق أعلى معدلات تحويل. لديك خبرة عميقة في السوق العربي وفهم دقيق لسيكولوجية المستهلك.`,
                    prompt: `اكتب سكربت UGC احترافي لإعلان منتج على السوشيال ميديا:

## معلومات المنتج:
- اسم المنتج: ${productName}
- وصف المنتج: ${productDescription}

## متطلبات السكربت:
- الأسلوب: ${toneDef?.label} (${scriptTone})
- اللهجة: ${dialectLabel}
- المدة: 30-45 ثانية (حوالي 80-120 كلمة)

## هيكل السكربت الاحترافي:
1. **الخطاف (أول 3 ثوانٍ):** جملة صادمة أو سؤال يوقف التمرير فوراً
2. **المشكلة (5 ثوانٍ):** وصف المشكلة التي يعاني منها المشاهد
3. **الاكتشاف (5 ثوانٍ):** كيف اكتشفت المنتج
4. **التجربة (10 ثوانٍ):** وصف التجربة الشخصية مع المنتج بتفاصيل حسية
5. **النتيجة (5 ثوانٍ):** النتيجة المبهرة التي حصلت عليها
6. **CTA (3 ثوانٍ):** دعوة واضحة للشراء أو التجربة

## قواعد مهمة:
- اكتب كأنك شخص حقيقي يتكلم بعفوية، ليس كإعلان رسمي
- استخدم كلمات يومية بسيطة باللهجة ${dialectLabel}
- أضف تعبيرات طبيعية مثل "والله"، "يعني"، "بصراحة"
- لا تذكر أنه إعلان أبداً
- اجعله يبدو كتجربة شخصية حقيقية

أرجع السكربت كنص عادي (بدون JSON). اكتب السكربت فقط بدون أي شرح إضافي.`,
                    maxTokens: 1024,
                }),
            });

            if (!res.ok) throw new Error('Script generation failed');
            const data = await res.json();

            if (data.text) {
                updateUGC({ isGeneratingScript: false, generatedScript: data.text.trim() });
            } else {
                updateUGC({ isGeneratingScript: false });
            }
        } catch (error) {
            console.error('Script generation error:', error);
            updateUGC({ isGeneratingScript: false });
        }
    }, [updateUGC, productName, productDescription, scriptTone, dialect]);

    // Step 3: Generate Voice
    const handleGenerateVoice = useCallback(async () => {
        if (!state.generatedScript) return;
        updateUGC({ isGeneratingVoice: true, voiceUrl: '' });
        try {
            const voiceMap: Record<string, { name: string; lang: string }> = {
                'egyptian': { name: 'ar-XA-Standard-A', lang: 'ar-XA' },
                'khaliji': { name: 'ar-XA-Standard-D', lang: 'ar-XA' },
                'levantine': { name: 'ar-XA-Standard-B', lang: 'ar-XA' },
                'msa': { name: 'ar-XA-Standard-A', lang: 'ar-XA' },
                'english': { name: 'en-US-Standard-J', lang: 'en-US' },
            };
            const voice = voiceMap[dialect] || voiceMap['khaliji'];

            const res = await fetch('/api/generate-voice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: state.generatedScript,
                    voice: voice.name,
                    language: voice.lang,
                    speed: 1.05,
                }),
            });

            const data = await res.json();
            if (data.audioUrl) {
                updateUGC({ isGeneratingVoice: false, voiceUrl: data.audioUrl });
            } else {
                updateUGC({ isGeneratingVoice: false });
            }
        } catch (error) {
            console.error('Voice generation error:', error);
            updateUGC({ isGeneratingVoice: false });
        }
    }, [updateUGC, state.generatedScript, dialect]);

    // Step 4: Generate Video
    const handleGenerateVideo = useCallback(async () => {
        if (!state.characterImage) return;
        updateUGC({ isGeneratingVideo: true, videoUrl: '' });
        try {
            const res = await fetch('/api/generate-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: `UGC testimonial video. A real person talking directly to camera about a product, natural head movements, lip sync, subtle facial expressions, authentic feel, vertical video format, soft natural lighting, genuine enthusiasm.`,
                    imageUrls: [state.characterImage],
                    model: 'veo3_fast',
                    aspectRatio: '9:16',
                    generationType: 'FIRST_AND_LAST_FRAMES_2_VIDEO',
                }),
            });

            if (!res.ok) throw new Error('Video generation failed');
            const data = await res.json();

            if (data.taskId) {
                // Poll for video completion
                const pollInterval = setInterval(async () => {
                    try {
                        const statusRes = await fetch(`/api/generate-video?taskId=${data.taskId}`);
                        const statusData = await statusRes.json();

                        if (statusData.status === 'completed' && statusData.videoUrl) {
                            clearInterval(pollInterval);
                            updateUGC({ isGeneratingVideo: false, videoUrl: statusData.videoUrl });
                        } else if (statusData.status === 'failed') {
                            clearInterval(pollInterval);
                            updateUGC({ isGeneratingVideo: false });
                        }
                    } catch {
                        clearInterval(pollInterval);
                        updateUGC({ isGeneratingVideo: false });
                    }
                }, 5000);

                // Timeout after 5 minutes
                setTimeout(() => {
                    clearInterval(pollInterval);
                    if (state.isGeneratingVideo) {
                        updateUGC({ isGeneratingVideo: false });
                    }
                }, 300000);
            }
        } catch (error) {
            console.error('Video generation error:', error);
            updateUGC({ isGeneratingVideo: false });
        }
    }, [updateUGC, state.characterImage, state.isGeneratingVideo]);

    const handleReset = useCallback(() => {
        updateUGC({
            productImage: null, characterImage: '', generatedScript: '',
            voiceUrl: '', videoUrl: '', isGeneratingCharacter: false,
            isGeneratingScript: false, isGeneratingVoice: false, isGeneratingVideo: false,
        });
        setActiveStep('setup');
        setProductName('');
        setProductDescription('');
    }, [updateUGC]);

    const handleCopyScript = () => {
        navigator.clipboard.writeText(state.generatedScript);
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 2000);
    };

    const steps: { id: UGCStep; label: string; icon: React.ReactNode; done: boolean }[] = [
        { id: 'setup', label: 'المنتج', icon: <Image size={14} />, done: !!state.productImage },
        { id: 'character', label: 'الشخصية', icon: <Users size={14} />, done: !!state.characterImage },
        { id: 'script', label: 'السكربت', icon: <FileText size={14} />, done: !!state.generatedScript },
        { id: 'video', label: 'الفيديو', icon: <Video size={14} />, done: !!state.videoUrl },
    ];

    const outputJSX = (
        <div className={styles.output}>
            {/* Steps Progress */}
            <div className={styles.stepsBar}>
                {steps.map((step, i) => (
                    <React.Fragment key={step.id}>
                        <button
                            className={`${styles.stepBtn} ${activeStep === step.id ? styles.stepBtnActive : ''} ${step.done ? styles.stepBtnDone : ''}`}
                            onClick={() => setActiveStep(step.id)}
                        >
                            {step.done ? <Check size={14} /> : step.icon}
                            <span>{step.label}</span>
                        </button>
                        {i < steps.length - 1 && <ChevronRight size={12} className={styles.stepArrow} />}
                    </React.Fragment>
                ))}
            </div>

            {/* Character Preview */}
            {state.characterImage && (
                <div className={styles.previewSection}>
                    <h3 className={styles.previewTitle}>الشخصية المولّدة</h3>
                    <div className={styles.characterPreview}>
                        <img src={state.characterImage} alt="AI Character" className={styles.characterImg} />
                    </div>
                </div>
            )}

            {/* Script Preview */}
            {state.generatedScript && (
                <div className={styles.previewSection}>
                    <div className={styles.scriptHeader}>
                        <h3 className={styles.previewTitle}><FileText size={14} /> السكربت</h3>
                        <button className={styles.copyBtn} onClick={handleCopyScript}>
                            {copiedScript ? <><Check size={12} /> تم النسخ</> : <><Copy size={12} /> نسخ</>}
                        </button>
                    </div>
                    <div className={styles.scriptBox}>{state.generatedScript}</div>
                    <div className={styles.scriptActions}>
                        <button className={styles.actionBtn} onClick={handleGenerateVoice}
                            disabled={state.isGeneratingVoice}>
                            {state.isGeneratingVoice ? <><Loader2 size={14} className={styles.spin} /> جاري التوليد...</>
                                : <><Volume2 size={14} /> توليد الصوت</>}
                        </button>
                    </div>
                </div>
            )}

            {/* Voice Preview */}
            {state.voiceUrl && (
                <div className={styles.previewSection}>
                    <h3 className={styles.previewTitle}><Mic size={14} /> التعليق الصوتي</h3>
                    <audio controls src={state.voiceUrl} className={styles.audioPlayer} />
                </div>
            )}

            {/* Video Preview */}
            {state.videoUrl && (
                <div className={styles.previewSection}>
                    <h3 className={styles.previewTitle}><Video size={14} /> الفيديو النهائي</h3>
                    <video controls src={state.videoUrl} className={styles.videoPlayer} />
                    <a href={state.videoUrl} download="mo3in-ugc-video.mp4" className={styles.downloadBtn}>
                        <Download size={14} /> تحميل الفيديو
                    </a>
                </div>
            )}

            {/* Loading States */}
            {state.isGeneratingCharacter && (
                <div className={styles.loadingState}>
                    <Loader2 size={32} className={styles.spin} />
                    <h3>جاري إنشاء الشخصية...</h3>
                    <p>نقوم بتوليد صورة واقعية للشخصية المختارة</p>
                </div>
            )}

            {state.isGeneratingScript && (
                <div className={styles.loadingState}>
                    <Loader2 size={32} className={styles.spin} />
                    <h3>جاري كتابة السكربت...</h3>
                    <p>نكتب سكربت إعلاني احترافي عن {productName}</p>
                </div>
            )}

            {state.isGeneratingVideo && (
                <div className={styles.loadingState}>
                    <Loader2 size={32} className={styles.spin} />
                    <h3>جاري إنشاء الفيديو...</h3>
                    <p>هذه العملية قد تستغرق 2-5 دقائق</p>
                </div>
            )}

            {/* Empty State */}
            {!state.characterImage && !state.isGeneratingCharacter && !state.isGeneratingScript && !state.isGeneratingVideo && (
                <div className={styles.emptyState}>
                    <Users size={48} className={styles.emptyIcon} />
                    <h3>أنشئ محتوى UGC احترافي</h3>
                    <p>ارفع صورة منتجك، اختر شخصية، واحصل على فيديو إعلاني واقعي</p>
                </div>
            )}
        </div>
    );

    return (
        <ToolLayout
            icon={<Users size={18} />}
            title="UGC Creator"
            titleAr="صانع المحتوى الإعلاني"
            description="أنشئ فيديوهات UGC احترافية بشخصيات واقعية تتحدث عن منتجك. من الصورة إلى الفيديو."
            output={outputJSX}
        >
            {/* Step 1: Product Setup */}
            {activeStep === 'setup' && (
                <>
                    <ImageUploader label="صورة المنتج"
                        image={state.productImage}
                        onUpload={(file, url) => updateUGC({ productImage: { id: crypto.randomUUID(), file, url, name: file.name } })}
                        onRemove={() => updateUGC({ productImage: null })} />
                    <div>
                        <label className="label">اسم المنتج</label>
                        <input className="input-field" placeholder="مثال: كريم العناية بالبشرة..."
                            value={productName} onChange={(e) => setProductName(e.target.value)} />
                    </div>
                    <div>
                        <label className="label">وصف المنتج</label>
                        <textarea className="input-field" rows={3}
                            placeholder="صف منتجك بإيجاز: ما هو؟ ما فائدته؟ لمن هو؟"
                            value={productDescription} onChange={(e) => setProductDescription(e.target.value)}
                            style={{ resize: 'vertical', minHeight: '80px' }} />
                    </div>
                    <button className={styles.nextBtn}
                        onClick={() => setActiveStep('character')}
                        disabled={!state.productImage || !productName.trim()}>
                        <span>التالي: اختيار الشخصية</span>
                        <ChevronRight size={16} />
                    </button>
                </>
            )}

            {/* Step 2: Character Setup */}
            {activeStep === 'character' && (
                <>
                    <div>
                        <label className="label">نوع الشخصية</label>
                        <div className={styles.charGrid}>
                            {CHARACTER_TYPES.map(ct => (
                                <button key={ct.value}
                                    className={`${styles.charBtn} ${characterType === ct.value ? styles.charBtnActive : ''}`}
                                    onClick={() => setCharacterType(ct.value)}>
                                    {ct.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="label">لون البشرة</label>
                        <div className={styles.toneGrid}>
                            {SKIN_TONES.map(st => (
                                <button key={st.value}
                                    className={`${styles.toneBtn} ${skinTone === st.value ? styles.toneBtnActive : ''}`}
                                    onClick={() => setSkinTone(st.value)}>
                                    {st.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <SelectField label="الخلفية" value={background} onChange={setBackground}
                        options={BACKGROUNDS.map(b => ({ value: b.value, label: b.label }))} />
                    <button className={styles.generateBtn} onClick={handleGenerateCharacter}
                        disabled={state.isGeneratingCharacter}>
                        {state.isGeneratingCharacter
                            ? <><Loader2 size={18} className={styles.spin} /> جاري التوليد...</>
                            : <><Sparkles size={18} /> توليد الشخصية</>}
                    </button>
                </>
            )}

            {/* Step 3: Script */}
            {activeStep === 'script' && (
                <>
                    <SelectField label="أسلوب السكربت" value={scriptTone} onChange={setScriptTone}
                        options={SCRIPT_TONES.map(s => ({ value: s.value, label: s.label }))} />
                    <SelectField label="اللهجة" value={dialect} onChange={setDialect}
                        options={DIALECT_OPTIONS.map(d => ({ value: d.value, label: d.label }))} />
                    <div>
                        <label className="label">تعديل السكربت يدوياً (اختياري)</label>
                        <textarea className="input-field" rows={6}
                            placeholder="يمكنك تعديل السكربت بعد التوليد أو كتابة سكربت خاص بك..."
                            value={state.generatedScript}
                            onChange={(e) => updateUGC({ generatedScript: e.target.value })}
                            style={{ resize: 'vertical', minHeight: '120px' }} />
                    </div>
                    <button className={styles.generateBtn} onClick={handleGenerateScript}
                        disabled={state.isGeneratingScript || !productName.trim()}>
                        {state.isGeneratingScript
                            ? <><Loader2 size={18} className={styles.spin} /> جاري الكتابة...</>
                            : <><Zap size={18} /> توليد السكربت</>}
                    </button>
                    {state.generatedScript && (
                        <button className={styles.nextBtn} onClick={() => setActiveStep('video')}>
                            <span>التالي: إنشاء الفيديو</span>
                            <ChevronRight size={16} />
                        </button>
                    )}
                </>
            )}

            {/* Step 4: Video Generation */}
            {activeStep === 'video' && (
                <>
                    <div className={styles.summaryCard}>
                        <h3>ملخص المشروع</h3>
                        <div className={styles.summaryItem}><strong>المنتج:</strong> {productName}</div>
                        <div className={styles.summaryItem}><strong>الشخصية:</strong> {CHARACTER_TYPES.find(c => c.value === characterType)?.label}</div>
                        <div className={styles.summaryItem}><strong>الخلفية:</strong> {BACKGROUNDS.find(b => b.value === background)?.label}</div>
                        <div className={styles.summaryItem}><strong>الأسلوب:</strong> {SCRIPT_TONES.find(s => s.value === scriptTone)?.label}</div>
                        {state.characterImage && <img src={state.characterImage} alt="Character" className={styles.summaryThumb} />}
                    </div>
                    <button className={styles.generateBtn} onClick={handleGenerateVideo}
                        disabled={state.isGeneratingVideo || !state.characterImage}>
                        {state.isGeneratingVideo
                            ? <><Loader2 size={18} className={styles.spin} /> جاري إنشاء الفيديو...</>
                            : <><Video size={18} /> إنشاء فيديو UGC</>}
                    </button>
                </>
            )}

            {/* Reset */}
            {(state.characterImage || state.generatedScript || state.videoUrl) && (
                <button className={styles.resetBtn} onClick={handleReset}>
                    <RotateCcw size={14} /> البدء من جديد
                </button>
            )}
        </ToolLayout>
    );
}
