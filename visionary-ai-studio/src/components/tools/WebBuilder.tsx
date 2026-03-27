'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import {
    Globe, Zap, RotateCcw, Download, Loader2,
    Monitor, Tablet, Smartphone, Code, Eye,
    Palette, Type, Layout, FileCode, RefreshCcw,
    ExternalLink, Copy, Check, Sparkles,
} from 'lucide-react';
import styles from './WebBuilder.module.css';
import ToolLayout from '@/components/shared/ToolLayout';

// Site type options
const SITE_TYPES = [
    { value: 'landing', label: 'Landing Page', labelAr: 'صفحة هبوط', icon: '🚀' },
    { value: 'portfolio', label: 'Portfolio', labelAr: 'معرض أعمال', icon: '🎨' },
    { value: 'ecommerce', label: 'E-Commerce', labelAr: 'متجر إلكتروني', icon: '🛍️' },
    { value: 'blog', label: 'Blog', labelAr: 'مدونة', icon: '📝' },
    { value: 'business', label: 'Business', labelAr: 'شركة / أعمال', icon: '🏢' },
    { value: 'restaurant', label: 'Restaurant', labelAr: 'مطعم', icon: '🍽️' },
    { value: 'saas', label: 'SaaS', labelAr: 'برنامج خدمي', icon: '💻' },
    { value: 'agency', label: 'Agency', labelAr: 'وكالة', icon: '📐' },
];

// Color palettes
const COLOR_PALETTES = [
    { value: 'modern-dark', label: 'Modern Dark', colors: ['#0f0f23', '#1a1a3e', '#6c63ff', '#f8f8ff'] },
    { value: 'ocean-breeze', label: 'Ocean Breeze', colors: ['#0A2647', '#144272', '#205295', '#2C74B3'] },
    { value: 'sunset-warm', label: 'Sunset Warm', colors: ['#2b1055', '#d53369', '#ff6b6b', '#feca57'] },
    { value: 'forest-green', label: 'Forest Green', colors: ['#1a3c40', '#1d5c63', '#417d7a', '#b8e0d2'] },
    { value: 'royal-purple', label: 'Royal Purple', colors: ['#1b0a3c', '#4a1a6b', '#8B5CF6', '#c4b5fd'] },
    { value: 'minimal-light', label: 'Minimal Light', colors: ['#ffffff', '#f5f5f5', '#333333', '#0066ff'] },
    { value: 'neon-cyber', label: 'Neon Cyber', colors: ['#0a0a0a', '#1a1a2e', '#00f5d4', '#f72585'] },
    { value: 'earth-tones', label: 'Earth Tones', colors: ['#2c1810', '#5c3d2e', '#d4a574', '#faf3e3'] },
];

// Design styles
const DESIGN_STYLES = [
    { value: 'modern', label: 'Modern' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'bold', label: 'Bold' },
    { value: 'glassmorphism', label: 'Glass' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'dark-luxury', label: 'Luxury' },
    { value: 'playful', label: 'Playful' },
    { value: 'corporate', label: 'Corporate' },
];

// Pages
const PAGE_OPTIONS = [
    { value: 'hero', label: 'Hero Section', labelAr: 'القسم الرئيسي', default: true },
    { value: 'about', label: 'About', labelAr: 'عن الشركة', default: true },
    { value: 'services', label: 'Services', labelAr: 'الخدمات', default: true },
    { value: 'testimonials', label: 'Testimonials', labelAr: 'آراء العملاء', default: false },
    { value: 'pricing', label: 'Pricing', labelAr: 'الأسعار', default: false },
    { value: 'contact', label: 'Contact', labelAr: 'تواصل معنا', default: true },
    { value: 'faq', label: 'FAQ', labelAr: 'الأسئلة الشائعة', default: false },
    { value: 'footer', label: 'Footer', labelAr: 'الذيل', default: true },
];

// Dummy generated website HTML
const DEMO_HTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>موقع تجريبي</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Cairo', sans-serif; background: #0f0f23; color: #f8f8ff; overflow-x: hidden; }

/* Hero */
.hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; position: relative; padding: 40px 20px; background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%); overflow: hidden; }
.hero::before { content: ''; position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%); top: -100px; right: -100px; border-radius: 50%; }
.hero::after { content: ''; position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%); bottom: -50px; left: -50px; border-radius: 50%; }
.hero-content { max-width: 800px; position: relative; z-index: 1; }
.badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 20px; background: rgba(108,99,255,0.15); border: 1px solid rgba(108,99,255,0.3); border-radius: 50px; font-size: 14px; color: #a78bfa; margin-bottom: 24px; backdrop-filter: blur(10px); }
.badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #6c63ff; animation: pulse-dot 2s ease-in-out infinite; }
@keyframes pulse-dot { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
.hero h1 { font-size: clamp(36px, 6vw, 64px); font-weight: 900; line-height: 1.2; margin-bottom: 20px; background: linear-gradient(135deg, #f8f8ff 0%, #a78bfa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero p { font-size: 18px; color: rgba(248,248,255,0.7); line-height: 1.8; max-width: 600px; margin: 0 auto 32px; }
.hero-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
.btn-primary { padding: 14px 32px; background: linear-gradient(135deg, #6c63ff, #4f46e5); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.3s; box-shadow: 0 4px 20px rgba(108,99,255,0.3); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(108,99,255,0.4); }
.btn-secondary { padding: 14px 32px; background: rgba(255,255,255,0.05); color: #f8f8ff; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.3s; backdrop-filter: blur(10px); }
.btn-secondary:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }

/* Stats */
.stats { display: flex; gap: 40px; justify-content: center; margin-top: 60px; }
.stat { text-align: center; }
.stat-number { font-size: 32px; font-weight: 900; color: #6c63ff; }
.stat-label { font-size: 14px; color: rgba(248,248,255,0.5); margin-top: 4px; }

/* Services */
.services { padding: 100px 20px; background: #0f0f23; }
.section-header { text-align: center; margin-bottom: 60px; }
.section-tag { display: inline-block; padding: 6px 16px; background: rgba(108,99,255,0.1); border: 1px solid rgba(108,99,255,0.2); border-radius: 20px; font-size: 13px; color: #a78bfa; margin-bottom: 16px; font-weight: 600; }
.section-header h2 { font-size: 36px; font-weight: 900; margin-bottom: 12px; }
.section-header p { font-size: 16px; color: rgba(248,248,255,0.6); max-width: 500px; margin: 0 auto; }
.services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; max-width: 1100px; margin: 0 auto; }
.service-card { padding: 32px; background: rgba(26,26,62,0.5); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; transition: all 0.3s; backdrop-filter: blur(10px); }
.service-card:hover { border-color: rgba(108,99,255,0.3); transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
.service-icon { width: 50px; height: 50px; border-radius: 12px; background: linear-gradient(135deg, rgba(108,99,255,0.2), rgba(99,102,241,0.1)); display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 20px; }
.service-card h3 { font-size: 20px; font-weight: 700; margin-bottom: 10px; }
.service-card p { font-size: 14px; color: rgba(248,248,255,0.6); line-height: 1.7; }

/* CTA */
.cta { padding: 100px 20px; text-align: center; background: linear-gradient(135deg, #1a1a3e 0%, #2d1b69 100%); position: relative; overflow: hidden; }
.cta::before { content: ''; position: absolute; width: 300px; height: 300px; background: radial-gradient(circle, rgba(108,99,255,0.2) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); border-radius: 50%; }
.cta h2 { font-size: 36px; font-weight: 900; margin-bottom: 16px; position: relative; }
.cta p { font-size: 16px; color: rgba(248,248,255,0.6); margin-bottom: 32px; position: relative; }
.cta .btn-primary { position: relative; }

/* Footer */
footer { padding: 40px 20px; background: #0a0a1a; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
footer p { color: rgba(248,248,255,0.3); font-size: 14px; }
footer a { color: #6c63ff; text-decoration: none; }
</style>
</head>
<body>

<section class="hero">
    <div class="hero-content">
        <div class="badge"><span class="badge-dot"></span> منصة الجيل القادم</div>
        <h1>حوّل أفكارك إلى واقع رقمي مذهل</h1>
        <p>نبني لك مواقع وتطبيقات ذكية بتقنيات الذكاء الاصطناعي، بتصميم احترافي يجذب عملاءك ويضاعف مبيعاتك</p>
        <div class="hero-btns">
            <button class="btn-primary">ابدأ الآن مجاناً</button>
            <button class="btn-secondary">شاهد العرض التوضيحي</button>
        </div>
        <div class="stats">
            <div class="stat"><div class="stat-number">+2500</div><div class="stat-label">عميل سعيد</div></div>
            <div class="stat"><div class="stat-number">+150</div><div class="stat-label">مشروع منجز</div></div>
            <div class="stat"><div class="stat-number">99%</div><div class="stat-label">نسبة الرضا</div></div>
        </div>
    </div>
</section>

<section class="services">
    <div class="section-header">
        <span class="section-tag">خدماتنا</span>
        <h2>حلول متكاملة لعملك</h2>
        <p>نقدم لك مجموعة شاملة من الخدمات الرقمية المتطورة</p>
    </div>
    <div class="services-grid">
        <div class="service-card">
            <div class="service-icon">🎨</div>
            <h3>تصميم واجهات</h3>
            <p>تصميم واجهات مستخدم عصرية وجذابة تعكس هوية علامتك التجارية بأحدث التقنيات</p>
        </div>
        <div class="service-card">
            <div class="service-icon">⚡</div>
            <h3>تطوير المواقع</h3>
            <p>بناء مواقع سريعة ومتجاوبة مع جميع الأجهزة باستخدام أحدث التقنيات البرمجية</p>
        </div>
        <div class="service-card">
            <div class="service-icon">🤖</div>
            <h3>ذكاء اصطناعي</h3>
            <p>دمج حلول الذكاء الاصطناعي في مشروعك لتحسين تجربة المستخدم وزيادة الإنتاجية</p>
        </div>
    </div>
</section>

<section class="cta">
    <h2>جاهز لبناء مشروعك الرقمي؟</h2>
    <p>انضم لآلاف العملاء الذين يثقون بنا لبناء حضورهم الرقمي</p>
    <button class="btn-primary">تواصل معنا الآن</button>
</section>

<footer>
    <p>جميع الحقوق محفوظة © 2026 | صُنع بواسطة <a href="#">Mo3in AI</a></p>
</footer>

</body>
</html>`;

const LOADING_STEPS = [
    { label: 'تحليل المتطلبات', labelEn: 'Analyzing requirements' },
    { label: 'بناء الهيكل', labelEn: 'Building structure' },
    { label: 'تصميم الواجهة', labelEn: 'Designing UI' },
    { label: 'إضافة التفاعلات', labelEn: 'Adding interactions' },
    { label: 'تحسين الأداء', labelEn: 'Optimizing performance' },
];

export default function WebBuilder() {
    const project = useAppStore((s) => s.getActiveProject());
    const updateWebBuilder = useAppStore((s) => s.updateWebBuilder);
    const state = project.webBuilder;

    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Local UI states
    const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [showCode, setShowCode] = useState(false);
    const [codeTab, setCodeTab] = useState<'html' | 'css' | 'js'>('html');
    const [copied, setCopied] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // Loading animation
    useEffect(() => {
        if (state.isGenerating) {
            setLoadingStep(0);
            const interval = setInterval(() => {
                setLoadingStep(prev => {
                    if (prev < LOADING_STEPS.length - 1) return prev + 1;
                    return prev;
                });
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [state.isGenerating]);

    // Write to iframe
    useEffect(() => {
        if (state.generatedHtml && iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            if (doc) {
                doc.open();
                doc.write(state.generatedHtml);
                doc.close();
            }
        }
    }, [state.generatedHtml, showCode]);

    const togglePage = (page: string) => {
        const current = state.selectedPages;
        const updated = current.includes(page)
            ? current.filter(p => p !== page)
            : [...current, page];
        updateWebBuilder({ selectedPages: updated });
    };

    const callGenerateApi = useCallback(async () => {
        updateWebBuilder({ isGenerating: true, generatedHtml: '' });
        setLoadingStep(0);
        setError(null);

        try {
            const res = await fetch('/api/generate-website', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    siteName: state.siteName,
                    siteType: state.siteType,
                    siteDescription: state.siteDescription,
                    colorPalette: state.colorPalette,
                    designStyle: state.designStyle,
                    selectedPages: state.selectedPages,
                    language: 'ar',
                }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(errData.error || `HTTP ${res.status}`);
            }

            const data = await res.json();
            updateWebBuilder({
                isGenerating: false,
                generatedHtml: data.html,
            });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to generate website';
            console.error('Generation error:', errorMessage);
            setError(errorMessage);
            updateWebBuilder({ isGenerating: false });
        }
    }, [updateWebBuilder, state.siteName, state.siteType, state.siteDescription, state.colorPalette, state.designStyle, state.selectedPages]);

    const handleGenerate = useCallback(() => {
        callGenerateApi();
    }, [callGenerateApi]);

    const handleReset = useCallback(() => {
        updateWebBuilder({
            generatedHtml: '',
            siteType: 'landing',
            siteName: '',
            siteDescription: '',
            colorPalette: 'modern-dark',
            designStyle: 'modern',
            selectedPages: PAGE_OPTIONS.filter(p => p.default).map(p => p.value),
        });
        setShowCode(false);
    }, [updateWebBuilder]);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(state.generatedHtml);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExportHtml = () => {
        const blob = new Blob([state.generatedHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${state.siteName || 'website'}-mo3in-ai.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const canGenerate = state.siteName.trim() !== '' && state.siteDescription.trim() !== '';

    const outputContent = (
        <>
            {state.isGenerating ? (
                /* Loading State */
                <div className={styles.loading}>
                    <div className={styles.loadingSpinner}>
                        <div className={styles.loadingRing} />
                        <div className={styles.loadingRing2} />
                        <Globe size={28} className={styles.loadingIcon} />
                    </div>
                    <h3>Claude Opus يبني موقعك...</h3>
                    <p>الذكاء الاصطناعي يعمل على تصميم وبرمجة موقعك بالكامل بناءً على متطلباتك</p>
                    <div className={styles.loadingSteps}>
                        {LOADING_STEPS.map((step, i) => (
                            <div
                                key={i}
                                className={`${styles.loadingStep} ${
                                    i === loadingStep ? styles.loadingStepActive :
                                    i < loadingStep ? styles.loadingStepDone : ''
                                }`}
                            >
                                <span className={`${styles.loadingStepIcon} ${
                                    i === loadingStep ? styles.loadingStepIconActive :
                                    i < loadingStep ? styles.loadingStepIconDone : ''
                                }`}>
                                    {i < loadingStep ? <Check size={10} /> :
                                     i === loadingStep ? <Loader2 size={10} className={styles.spin} /> :
                                     (i + 1)}
                                </span>
                                {step.label}
                            </div>
                        ))}
                    </div>
                </div>
            ) : error ? (
                /* Error State */
                <div className={styles.empty}>
                    <div className={styles.emptyIcon} style={{ borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.08)' }}>
                        <Globe size={48} style={{ color: '#EF4444' }} />
                    </div>
                    <h3 style={{ color: '#EF4444' }}>حدث خطأ</h3>
                    <p>{error}</p>
                    <button
                        className={styles.generateBtn}
                        onClick={() => { setError(null); callGenerateApi(); }}
                        style={{ maxWidth: '300px', marginTop: '12px' }}
                    >
                        <RefreshCcw size={16} /> إعادة المحاولة
                    </button>
                </div>
            ) : state.generatedHtml ? (
                /* Preview / Code View */
                <>
                    <div className={styles.previewToolbar}>
                        <div className={styles.deviceToggles}>
                            <button
                                className={`${styles.deviceBtn} ${deviceView === 'desktop' ? styles.deviceBtnActive : ''}`}
                                onClick={() => setDeviceView('desktop')}
                            >
                                <Monitor size={14} /> Desktop
                            </button>
                            <button
                                className={`${styles.deviceBtn} ${deviceView === 'tablet' ? styles.deviceBtnActive : ''}`}
                                onClick={() => setDeviceView('tablet')}
                            >
                                <Tablet size={14} /> Tablet
                            </button>
                            <button
                                className={`${styles.deviceBtn} ${deviceView === 'mobile' ? styles.deviceBtnActive : ''}`}
                                onClick={() => setDeviceView('mobile')}
                            >
                                <Smartphone size={14} /> Mobile
                            </button>
                        </div>

                        <div className={styles.previewUrl}>
                            <span className={styles.previewUrlDot} />
                            <span className={styles.previewUrlText}>
                                https://{state.siteName.replace(/\s+/g, '-').toLowerCase() || 'my-site'}.mo3in.ai
                            </span>
                        </div>

                        <div className={styles.toolbarActions}>
                            <button
                                className={`${styles.toolbarBtn} ${showCode ? styles.codeToggleActive : ''}`}
                                onClick={() => setShowCode(!showCode)}
                            >
                                {showCode ? <Eye size={14} /> : <Code size={14} />}
                                {showCode ? 'Preview' : 'Code'}
                            </button>
                            <button className={styles.toolbarBtn} onClick={handleCopyCode}>
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                            <button className={styles.toolbarBtn} onClick={() => callGenerateApi()}>
                                <RefreshCcw size={14} /> Regenerate
                            </button>
                        </div>
                    </div>

                    {showCode ? (
                        /* Code Editor */
                        <div className={styles.codeEditor}>
                            <div className={styles.codeTabs}>
                                <button
                                    className={`${styles.codeTab} ${codeTab === 'html' ? styles.codeTabActive : ''}`}
                                    onClick={() => setCodeTab('html')}
                                >
                                    <FileCode size={12} style={{ marginLeft: 4 }} /> index.html
                                </button>
                            </div>
                            <div className={styles.codeContent}>
                                <pre>{state.generatedHtml}</pre>
                            </div>
                        </div>
                    ) : (
                        /* Preview Frame */
                        <div className={styles.previewArea}>
                            <div className={`${styles.previewFrame} ${
                                deviceView === 'desktop' ? styles.previewFrameDesktop :
                                deviceView === 'tablet' ? styles.previewFrameTablet :
                                styles.previewFrameMobile
                            }`}>
                                <div className={styles.browserBar}>
                                    <div className={styles.browserDots}>
                                        <span className={`${styles.browserDot} ${styles.browserDotRed}`} />
                                        <span className={`${styles.browserDot} ${styles.browserDotYellow}`} />
                                        <span className={`${styles.browserDot} ${styles.browserDotGreen}`} />
                                    </div>
                                    <span className={styles.browserAddress}>
                                        https://{state.siteName.replace(/\s+/g, '-').toLowerCase() || 'my-site'}.mo3in.ai
                                    </span>
                                </div>
                                <iframe
                                    ref={iframeRef}
                                    className={styles.previewIframe}
                                    title="Website Preview"
                                    sandbox="allow-scripts"
                                />
                            </div>
                        </div>
                    )}
                </>
            ) : (
                /* Empty State */
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>
                        <Globe size={48} />
                    </div>
                    <h3>Website Builder</h3>
                    <p>
                        صمم وأنشئ موقعك الإلكتروني بالكامل باستخدام الذكاء الاصطناعي.
                        <br />
                        حدد نوع موقعك، اختر الألوان والنمط، واترك Claude Opus يبني لك موقع احترافي كامل
                    </p>
                    <div className={styles.steps}>
                        <div className={styles.step}>
                            <span className={styles.stepNum}>1</span>
                            <span>أدخل اسم ووصف موقعك</span>
                        </div>
                        <div className={styles.step}>
                            <span className={styles.stepNum}>2</span>
                            <span>اختر نوع الموقع والألوان</span>
                        </div>
                        <div className={styles.step}>
                            <span className={styles.stepNum}>3</span>
                            <span>حدد الأقسام المطلوبة</span>
                        </div>
                        <div className={styles.step}>
                            <span className={styles.stepNum}>4</span>
                            <span>اضغط Build Website</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

    return (
        <ToolLayout
            icon={<Globe size={18} />}
            title="Website Builder"
            titleAr="مُعين المواقع"
            description="صمم وابني موقع إلكتروني كامل بالذكاء الاصطناعي. صف موقعك واحصل على كود جاهز للنشر."
            output={outputContent}
        >
            {/* Site Name */}
            <div className={styles.sectionGroup}>
                <label className="label">Site Name / اسم الموقع</label>
                <input
                    className="input-field"
                    placeholder="مثل: شركة الإبداع الرقمي"
                    value={state.siteName}
                    onChange={(e) => updateWebBuilder({ siteName: e.target.value })}
                />
            </div>

            {/* Site Type */}
            <div className={styles.sectionGroup}>
                <label className="label">Site Type / نوع الموقع</label>
                <div className={styles.siteTypeGrid}>
                    {SITE_TYPES.map((type) => (
                        <button
                            key={type.value}
                            className={`${styles.siteTypeBtn} ${state.siteType === type.value ? styles.siteTypeBtnActive : ''}`}
                            onClick={() => updateWebBuilder({ siteType: type.value })}
                        >
                            <span className={styles.siteTypeIcon}>{type.icon}</span>
                            <span>{type.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Description */}
            <div className={styles.sectionGroup}>
                <label className="label">Description / وصف المشروع</label>
                <textarea
                    className="input-field"
                    rows={3}
                    placeholder="وصف مختصر عن الموقع ونشاطه... مثل: شركة تصميم مواقع وتطبيقات في السعودية"
                    value={state.siteDescription}
                    onChange={(e) => updateWebBuilder({ siteDescription: e.target.value })}
                    style={{ resize: 'vertical', minHeight: '80px' }}
                />
            </div>

            {/* Color Palette */}
            <div className={styles.sectionGroup}>
                <label className="label">Color Palette / لوحة الألوان</label>
                <div className={styles.paletteGrid}>
                    {COLOR_PALETTES.map((palette) => (
                        <button
                            key={palette.value}
                            className={`${styles.paletteBtn} ${state.colorPalette === palette.value ? styles.paletteBtnActive : ''}`}
                            onClick={() => updateWebBuilder({ colorPalette: palette.value })}
                        >
                            <div className={styles.paletteSwatches}>
                                {palette.colors.map((color, i) => (
                                    <span
                                        key={i}
                                        className={styles.paletteSwatch}
                                        style={{ background: color }}
                                    />
                                ))}
                            </div>
                            <span className={styles.paletteLabel}>{palette.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Design Style */}
            <div className={styles.sectionGroup}>
                <label className="label">Design Style / نمط التصميم</label>
                <div className={styles.styleChips}>
                    {DESIGN_STYLES.map((s) => (
                        <button
                            key={s.value}
                            className={`${styles.styleChip} ${state.designStyle === s.value ? styles.styleChipActive : ''}`}
                            onClick={() => updateWebBuilder({ designStyle: s.value })}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Pages */}
            <div className={styles.sectionGroup}>
                <label className="label">Sections / الأقسام</label>
                <div className={styles.pagesSection}>
                    {PAGE_OPTIONS.map((page) => {
                        const isActive = state.selectedPages.includes(page.value);
                        return (
                            <div
                                key={page.value}
                                className={`${styles.pageItem} ${isActive ? styles.pageItemActive : ''}`}
                            >
                                <button
                                    className={`${styles.pageCheck} ${isActive ? styles.pageCheckActive : ''}`}
                                    onClick={() => togglePage(page.value)}
                                >
                                    {isActive && <Check size={12} />}
                                </button>
                                <span className={styles.pageLabel}>{page.label}</span>
                                <span className={styles.pageLabelAr}>{page.labelAr}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* AI Badge */}
            <div style={{ textAlign: 'center' }}>
                <span className={styles.aiBadge}>
                    <span className={styles.aiBadgeDot} />
                    Powered by Claude Opus
                </span>
            </div>

            {/* Generate Button */}
            <button
                className={`${styles.generateBtn} ${!canGenerate ? styles.disabled : ''}`}
                onClick={handleGenerate}
                disabled={!canGenerate || state.isGenerating}
                id="webbuilder-generate-btn"
            >
                {state.isGenerating ? (
                    <><Loader2 size={18} className={styles.spin} /> جاري البناء...</>
                ) : (
                    <><Zap size={18} /> Build Website</>
                )}
            </button>

            {/* Bottom Actions */}
            {state.generatedHtml && (
                <div className={styles.bottomActions}>
                    <button className={styles.resetBtn} onClick={handleReset}>
                        <RotateCcw size={14} /> Reset
                    </button>
                    <button className={styles.exportBtn} onClick={handleExportHtml}>
                        <Download size={14} /> Export HTML
                    </button>
                </div>
            )}
        </ToolLayout>
    );
}
