'use client';

import React, { useCallback, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ImageUploader from '@/components/shared/ImageUploader';
import SelectField from '@/components/shared/SelectField';
import {
    Target, Zap, Loader2, Copy, Check, Hash, Calendar, DollarSign,
    BarChart3, RotateCcw, Eye, TrendingUp,
} from 'lucide-react';
import ToolLayout from '@/components/shared/ToolLayout';
import styles from './Plan.module.css';

const MARKET_OPTIONS = [
    { value: 'egypt', label: 'Egypt' }, { value: 'ksa', label: 'Saudi Arabia' },
    { value: 'uae', label: 'UAE' }, { value: 'kuwait', label: 'Kuwait' },
    { value: 'jordan', label: 'Jordan' }, { value: 'iraq', label: 'Iraq' },
];
const LANG_OPTIONS = [
    { value: 'egyptian', label: 'Egyptian Arabic' }, { value: 'khaliji', label: 'Khaliji' },
    { value: 'levantine', label: 'Levantine' }, { value: 'msa', label: 'Modern Standard Arabic' },
    { value: 'english', label: 'English' },
];
const STYLE_OPTIONS = [
    { value: 'slang', label: 'Street Slang' }, { value: 'casual', label: 'Casual Friendly' },
    { value: 'formal', label: 'Formal Professional' }, { value: 'humor', label: 'Humorous' },
    { value: 'luxury', label: 'Luxury Premium' },
];

const POST_COUNT_OPTIONS = [
    { value: '5', label: '5 Posts' }, { value: '9', label: '9 Posts' },
    { value: '15', label: '15 Posts' }, { value: '30', label: '30 Posts (Monthly)' },
];

const PLATFORM_OPTIONS = [
    { value: 'instagram', label: 'Instagram' }, { value: 'tiktok', label: 'TikTok' },
    { value: 'facebook', label: 'Facebook' }, { value: 'twitter', label: 'X (Twitter)' },
    { value: 'linkedin', label: 'LinkedIn' },
];

export default function Plan() {
    const project = useAppStore((s) => s.getActiveProject());
    const updatePlan = useAppStore((s) => s.updatePlan);
    const state = project.plan;

    const [postCount, setPostCount] = useState('9');
    const [platform, setPlatform] = useState('instagram');
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
    const [expandedPost, setExpandedPost] = useState<number | null>(null);
    const [budget, setBudget] = useState('500');

    const handleGenerate = useCallback(async () => {
        updatePlan({ isGenerating: true, generatedPosts: [] });
        try {
            const marketLabel = MARKET_OPTIONS.find(m => m.value === state.targetMarket)?.label || state.targetMarket;
            const langLabel = LANG_OPTIONS.find(l => l.value === state.language)?.label || state.language;
            const styleLabel = STYLE_OPTIONS.find(s => s.value === state.style)?.label || state.style;
            const platformLabel = PLATFORM_OPTIONS.find(p => p.value === platform)?.label || platform;

            const res = await fetch('/api/generate-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tool: 'plan',
                    systemPrompt: `أنت خبير تسويق رقمي ومتخصص في السوشيال ميديا للسوق العربي والخليجي. لديك خبرة 15 سنة في إدارة الحملات الإعلانية وصناعة المحتوى الفيروسي. تعرف خوارزميات كل منصة وأفضل ممارسات كتابة المحتوى الذي يحقق أعلى تفاعل. أجب دائماً بصيغة JSON فقط بدون أي نص إضافي.`,
                    prompt: `أنشئ ${postCount} بوست احترافي لحملة سوشيال ميديا بالمواصفات التالية:
- هدف الحملة: ${state.campaignGoal}
- السوق المستهدف: ${marketLabel}
- اللغة/اللهجة: ${langLabel}
- الأسلوب: ${styleLabel}
- المنصة الرئيسية: ${platformLabel}

## قواعد كتابة المحتوى الاحترافي:
1. ابدأ كل بوست بـ "هوك" (خطاف) قوي يجذب الانتباه في أول 3 ثوانٍ
2. استخدم أسلوب القصص (Storytelling) كلما أمكن
3. اجعل كل بوست يحتوي على CTA واضح ومباشر
4. نوّع بين أنماط البوستات: سؤال، قصة، إحصائية، نصيحة، قبل/بعد، رأي جريء
5. الهاشتاقات يجب أن تكون مزيج من شائعة (100K+) ومتخصصة (نيش)
6. وقت النشر يجب أن يكون بناءً على بيانات حقيقية لنشاط الجمهور في ${marketLabel}
7. اكتب بلهجة ${langLabel} أصيلة وطبيعية - كأنك شخص حقيقي من المنطقة
8. حجم النص يناسب المنصة: ${platformLabel === 'Twitter' ? 'أقل من 280 حرف' : platformLabel === 'Instagram' ? '150-300 كلمة مع فواصل أسطر' : platformLabel === 'TikTok' ? 'قصير ومؤثر 50-100 كلمة' : platformLabel === 'LinkedIn' ? 'مهني ومفصل 200-400 كلمة' : '100-200 كلمة'}

أرجع النتيجة كـ JSON array بالشكل التالي (بدون أي نص قبله أو بعده):
[
  {
    "text": "نص البوست كامل باللهجة المطلوبة مع إيموجي مناسبة",
    "visualIdea": "وصف تفصيلي بالإنجليزي للتصميم المرئي المقترح يتضمن: الألوان، التكوين، نوع الصورة (فوتو/جرافيك/فيديو)، الخط المستخدم",
    "hashtags": ["#هاشتاق1", "#هاشتاق2", "#هاشتاق3", "#هاشتاق4", "#هاشتاق5"],
    "platform": "${platform}",
    "bestTime": "أفضل وقت للنشر مع السبب",
    "postType": "نوع البوست: سؤال/قصة/إحصائية/نصيحة/عرض/رأي"
  }
]

مهم جداً: اكتب محتوى إبداعي حقيقي يمكن نشره مباشرة. لا تكتب محتوى عام أو مكرر.`,
                    maxTokens: 4096,
                }),
            });

            if (!res.ok) throw new Error('API request failed');
            const data = await res.json();

            // Parse the JSON response
            let posts;
            try {
                const text = data.text.trim();
                // Try to extract JSON from the response
                const jsonMatch = text.match(/\[[\s\S]*\]/);
                posts = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
            } catch {
                console.error('Failed to parse posts:', data.text);
                posts = [];
            }

            updatePlan({ isGenerating: false, generatedPosts: posts });
        } catch (error) {
            console.error('Generation error:', error);
            updatePlan({ isGenerating: false, generatedPosts: [] });
        }
    }, [updatePlan, postCount, state.targetMarket, state.language, state.style, state.campaignGoal, platform]);

    const handleCopy = useCallback((text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    }, []);

    const canGenerate = state.campaignGoal.trim();

    const estimatedReach = parseInt(budget) * 120;
    const estimatedEngagement = Math.round(estimatedReach * 0.035);

    const outputJSX = (
                state.isGenerating ? (
                    <div className={styles.loading}>
                        <div className={styles.spinnerWrap}><div className={styles.spinnerRing} /><Target size={24} className={styles.spinnerIcon} /></div>
                        <h3>Crafting Localized Content...</h3>
                        <p>Writing {postCount} culturally relevant posts for {MARKET_OPTIONS.find(m => m.value === state.targetMarket)?.label}</p>
                    </div>
                ) : state.generatedPosts.length > 0 ? (
                    <div className={styles.results}>
                        <div className={styles.resultsHeader}>
                            <h3><Calendar size={18} /> Campaign Posts</h3>
                            <span className={styles.badge}>{state.generatedPosts.length} posts &bull; {MARKET_OPTIONS.find(m => m.value === state.targetMarket)?.label}</span>
                        </div>
                        <div className={styles.postsGrid}>
                            {state.generatedPosts.map((post, i) => (
                                <div key={i} className={`${styles.postCard} ${expandedPost === i ? styles.postCardExpanded : ''}`} style={{ animationDelay: `${i * 0.08}s` }}>
                                    <div className={styles.postHeader}>
                                        <div className={styles.postNum}>Post #{i + 1}</div>
                                        <div className={styles.postMeta}>
                                            {post.platform && <span className={styles.postPlatform}>{post.platform}</span>}
                                            {post.bestTime && <span className={styles.postTime}>{post.bestTime}</span>}
                                        </div>
                                    </div>
                                    <div className={styles.postText}>{post.text}</div>
                                    {post.hashtags && post.hashtags.length > 0 && (
                                    <div className={styles.postHashtags}>
                                        {post.hashtags.map((tag, j) => (
                                            <span key={j} className={styles.hashTag}><Hash size={10} />{tag.replace('#', '')}</span>
                                        ))}
                                    </div>
                                    )}
                                    <div className={styles.postVisual}>
                                        <div className={styles.postVisualLabel}><Eye size={10} /> Visual Idea</div>
                                        {post.visualIdea}
                                    </div>
                                    <div className={styles.postActions}>
                                        <button className={styles.postCopyBtn} onClick={() => handleCopy(post.text + '\n\n' + (post.hashtags || []).join(' '), i)}>
                                            {copiedIdx === i ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}><Target size={40} /></div>
                        <p>ستظهر الخطة هنا بعد الإنشاء</p>
                    </div>
                )
    );

    return (
        <ToolLayout
            icon={<Target size={18} />}
            title="Plan"
            titleAr="مخطط الحملات الاستراتيجية"
            description="خطط حملاتك التسويقية بذكاء. حدد الهدف والميزانية واحصل على خطة تنفيذية مفصلة."
            output={outputJSX}
        >
                    <ImageUploader label="Product Reference" image={state.productReference}
                        onUpload={(file, url) => updatePlan({ productReference: { id: crypto.randomUUID(), file, url, name: file.name } })}
                        onRemove={() => updatePlan({ productReference: null })} compact />

                    <div>
                        <label className="label">Campaign Goal</label>
                        <textarea className="input-field" rows={3}
                            placeholder="e.g., Launch a new product campaign targeting young Egyptians..."
                            value={state.campaignGoal} onChange={(e) => updatePlan({ campaignGoal: e.target.value })}
                            style={{ resize: 'vertical', minHeight: '80px' }} />
                    </div>

                    <SelectField label="Target Market" value={state.targetMarket} onChange={(v) => updatePlan({ targetMarket: v })} options={MARKET_OPTIONS} />
                    <SelectField label="Language / Dialect" value={state.language} onChange={(v) => updatePlan({ language: v })} options={LANG_OPTIONS} />
                    <SelectField label="Tone & Style" value={state.style} onChange={(v) => updatePlan({ style: v })} options={STYLE_OPTIONS} />
                    <SelectField label="Primary Platform" value={platform} onChange={setPlatform} options={PLATFORM_OPTIONS} />
                    <SelectField label="Number of Posts" value={postCount} onChange={setPostCount} options={POST_COUNT_OPTIONS} />

                    {/* Budget Calculator */}
                    <div className={styles.budgetSection}>
                        <label className="label"><DollarSign size={12} /> Ad Budget (USD)</label>
                        <input type="number" className="input-field" value={budget} onChange={(e) => setBudget(e.target.value)} min="50" step="50" />
                        <div className={styles.budgetEstimates}>
                            <div className={styles.budgetItem}>
                                <TrendingUp size={12} />
                                <span>Est. Reach: <strong>{estimatedReach.toLocaleString()}</strong></span>
                            </div>
                            <div className={styles.budgetItem}>
                                <BarChart3 size={12} />
                                <span>Est. Engagement: <strong>{estimatedEngagement.toLocaleString()}</strong></span>
                            </div>
                        </div>
                    </div>

                    <button className={`${styles.generateBtn} ${!canGenerate ? styles.disabled : ''}`} onClick={handleGenerate} disabled={!canGenerate || state.isGenerating}>
                        {state.isGenerating ? (<><Loader2 size={18} className={styles.spin} /> Creating Campaign...</>) : (<><Zap size={18} /> Generate {postCount} Posts</>)}
                    </button>

                    {state.generatedPosts.length > 0 && (
                        <button className={styles.resetBtn} onClick={() => updatePlan({ generatedPosts: [] })}>
                            <RotateCcw size={14} /> Reset Campaign
                        </button>
                    )}
        </ToolLayout>
    );
}
