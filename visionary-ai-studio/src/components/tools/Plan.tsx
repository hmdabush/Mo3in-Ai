'use client';

import React, { useCallback, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ImageUploader from '@/components/shared/ImageUploader';
import SelectField from '@/components/shared/SelectField';
import {
    Target, Zap, Loader2, Copy, Check, Hash, Calendar, DollarSign,
    BarChart3, RotateCcw, Eye, TrendingUp,
} from 'lucide-react';
import ToolGuide from '@/components/shared/ToolGuide';
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

const DUMMY_POSTS = [
    { text: '\u064a\u0627 \u062c\u0645\u0627\u0639\u0629 \u0627\u0644\u0645\u0648\u0636\u0648\u0639 \u0645\u0634 \u0647\u0632\u0627\u0631! \u0627\u0644\u0645\u0646\u062a\u062c \u062f\u0647 \u063a\u064a\u0651\u0631 \u062d\u064a\u0627\u062a\u064a \u0628\u0627\u0644\u0643\u0627\u0645\u0644. \u062c\u0631\u0628\u0648\u0647 \u0648\u0627\u062f\u0639\u0648\u0644\u064a ', visualIdea: 'Before/after split image with vibrant colors', hashtags: ['#\u062a\u062c\u0631\u0628\u062a\u064a', '#\u0645\u0646\u062a\u062c_\u0639\u0638\u064a\u0645', '#\u0645\u0635\u0631'], platform: 'instagram', bestTime: '7:00 PM' },
    { text: '\u0645\u064a\u0646 \u0642\u0627\u0644 \u0625\u0646 \u0627\u0644\u062c\u0648\u062f\u0629 \u0644\u0627\u0632\u0645 \u062a\u0643\u0648\u0646 \u063a\u0627\u0644\u064a\u0629\u061f \u0625\u062d\u0646\u0627 \u0643\u0633\u0631\u0646\u0627 \u0627\u0644\u0642\u0627\u0639\u062f\u0629 ', visualIdea: 'Product showcase with price tag reveal animation', hashtags: ['#\u0639\u0631\u0636', '#\u062c\u0648\u062f\u0629', '#\u0623\u0641\u0636\u0644_\u0633\u0639\u0631'], platform: 'facebook', bestTime: '12:00 PM' },
    { text: '\u0627\u0644\u0646\u0627\u0633 \u0628\u062a\u0633\u0623\u0644 \u0639\u0646 \u0627\u0644\u0633\u0631... \u0647\u0642\u0648\u0644\u0643\u0645! \u0627\u0644\u0633\u0631 \u0641\u064a \u0627\u0644\u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0635\u063a\u064a\u0631\u0629 ', visualIdea: 'Macro close-up of product details with text overlay', hashtags: ['#\u0627\u0644\u0633\u0631', '#\u062a\u0641\u0627\u0635\u064a\u0644', '#\u0635\u0646\u0627\u0639\u0629_\u0645\u062a\u0642\u0646\u0629'], platform: 'instagram', bestTime: '9:00 PM' },
    { text: '\u0644\u064a\u0647 \u062a\u0634\u062a\u0631\u064a \u062a\u0642\u0644\u064a\u062f \u0644\u0645\u0627 \u0627\u0644\u0623\u0635\u0644\u064a \u0639\u0646\u062f\u0643 \u0628\u0633\u0639\u0631 \u0644\u0627 \u064a\u064f\u0635\u062f\u0642\u061f ', visualIdea: 'Side-by-side comparison with checkmark animations', hashtags: ['#\u0627\u0644\u0623\u0635\u0644\u064a', '#\u0645\u0642\u0627\u0631\u0646\u0629', '#\u0642\u064a\u0645\u0629'], platform: 'tiktok', bestTime: '8:00 PM' },
    { text: '\u0631\u062f\u0648\u062f \u0641\u0639\u0644 \u0627\u0644\u0646\u0627\u0633 \u0644\u0645\u0627 \u062c\u0631\u0628\u0648\u0627 \u0627\u0644\u0645\u0646\u062a\u062c \u0623\u0648\u0644 \u0645\u0631\u0629 ', visualIdea: 'Customer reaction collage with star ratings', hashtags: ['#\u062a\u0642\u064a\u064a\u0645\u0627\u062a', '#\u0639\u0645\u0644\u0627\u0621', '#\u0622\u0631\u0627\u0621'], platform: 'instagram', bestTime: '6:00 PM' },
    { text: '\u0627\u0644\u0639\u0631\u0636 \u062f\u0647 \u0645\u0634 \u0647\u064a\u062a\u0643\u0631\u0631! \u0622\u062e\u0631 24 \u0633\u0627\u0639\u0629 \u0627\u0637\u0644\u0628 \u062f\u0644\u0648\u0642\u062a\u064a!', visualIdea: 'Countdown timer design with urgency colors (red/orange)', hashtags: ['#\u0639\u0631\u0636_\u0645\u062d\u062f\u0648\u062f', '#\u0627\u0637\u0644\u0628_\u0627\u0644\u0622\u0646', '#\u062e\u0635\u0645'], platform: 'facebook', bestTime: '10:00 AM' },
    { text: '\u0634\u0648\u0641\u0648\u0627 \u0627\u0644\u062a\u0642\u064a\u064a\u0645\u0627\u062a! 4.9 \u0645\u0646 5 \u0645\u0634 \u0645\u0646 \u0641\u0631\u0627\u063a!', visualIdea: 'Review highlights with 5-star visual treatment', hashtags: ['#\u062a\u0642\u064a\u064a\u0645', '#\u062e\u0645\u0633_\u0646\u062c\u0648\u0645', '#\u0627\u0644\u0623\u0641\u0636\u0644'], platform: 'twitter', bestTime: '1:00 PM' },
    { text: '\u062d\u0627\u062c\u0629 \u0648\u0627\u062d\u062f\u0629 \u0628\u0633 \u0646\u062f\u0645\u062a \u0639\u0644\u064a\u0647\u0627... \u0625\u0646\u064a \u0645\u0627 \u062c\u0631\u0628\u062a\u0647\u0627 \u0628\u062f\u0631\u064a ', visualIdea: 'Testimonial style with emotional color palette', hashtags: ['#\u0634\u0647\u0627\u062f\u0629', '#\u0646\u062f\u0645', '#\u062a\u062c\u0631\u0628\u0629'], platform: 'tiktok', bestTime: '5:00 PM' },
    { text: '\u0627\u0644\u062e\u0644\u0627\u0635\u0629: \u0645\u0646\u062a\u062c \u064a\u0633\u062a\u0627\u0647\u0644 \u0643\u0644 \u0642\u0631\u0634. \u0644\u064a\u0646\u0643 \u0627\u0644\u0637\u0644\u0628 \u0641\u064a \u0627\u0644\u0628\u0627\u064a\u0648 ', visualIdea: 'CTA design with arrow pointing to bio link', hashtags: ['#\u0627\u0637\u0644\u0628_\u0627\u0644\u0622\u0646', '#\u0644\u064a\u0646\u0643_\u0627\u0644\u0628\u0627\u064a\u0648', '#CTA'], platform: 'instagram', bestTime: '8:00 PM' },
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
                    systemPrompt: `أنت خبير تسويق رقمي ومتخصص في السوشيال ميديا للسوق العربي. أنشئ محتوى إبداعي وجذاب يناسب الجمهور المستهدف. أجب دائماً بصيغة JSON فقط بدون أي نص إضافي.`,
                    prompt: `أنشئ ${postCount} بوست لحملة سوشيال ميديا بالمواصفات التالية:
- هدف الحملة: ${state.campaignGoal}
- السوق المستهدف: ${marketLabel}
- اللغة/اللهجة: ${langLabel}
- الأسلوب: ${styleLabel}
- المنصة الرئيسية: ${platformLabel}

أرجع النتيجة كـ JSON array بالشكل التالي (بدون أي نص قبله أو بعده):
[
  {
    "text": "نص البوست كامل باللهجة المطلوبة",
    "visualIdea": "وصف تفصيلي بالإنجليزي للتصميم المرئي المقترح",
    "hashtags": ["#هاشتاق1", "#هاشتاق2", "#هاشتاق3"],
    "platform": "${platform}",
    "bestTime": "أفضل وقت للنشر"
  }
]

مهم: استخدم اللهجة ${langLabel} بشكل طبيعي وأصيل. اكتب محتوى إبداعي حقيقي مناسب للمنصة.`,
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
                // Fallback to dummy posts
                posts = DUMMY_POSTS.slice(0, parseInt(postCount));
            }

            updatePlan({ isGenerating: false, generatedPosts: posts });
        } catch (error) {
            console.error('Generation error:', error);
            // Fallback to dummy data on error
            const count = parseInt(postCount);
            const posts = DUMMY_POSTS.slice(0, Math.min(count, DUMMY_POSTS.length));
            updatePlan({ isGenerating: false, generatedPosts: posts });
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

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarTitle}>
                        <Target size={18} className={styles.sidebarTitleIcon} />
                        <div><h2>Plan</h2><p className={styles.subtitle}>مخطط الحملات الاستراتيجية</p></div>
                    </div>
                </div>

                <ToolGuide
                    title="مخطط الحملات"
                    description="خطط لحملاتك التسويقية على السوشيال ميديا. أنشئ جدول نشر متكامل مع محتوى مخصص لكل منصة."
                    steps={[
                        'أدخل وصف المنتج أو الخدمة',
                        'اختر السوق المستهدف واللغة والأسلوب',
                        'حدد عدد المنشورات المطلوبة',
                        'اضغط "Generate Plan" لإنشاء خطة النشر',
                    ]}
                />

                <div className={styles.sidebarContent}>
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
                </div>
            </aside>

            <main className={styles.workspace}>
                {state.isGenerating ? (
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
                        <div className={styles.emptyIcon}><Target size={48} /></div>
                        <h3>Campaign Planner</h3>
                        <p>Set your target market and campaign goal to generate<br />localized posts with visual ideas and hashtags</p>
                    </div>
                )}
            </main>
        </div>
    );
}
