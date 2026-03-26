'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import {
    Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles,
    Crown, Check, Star, Zap, Shield, AlertCircle, User,
} from 'lucide-react';
import styles from './AuthPage.module.css';

type AuthView = 'login' | 'register' | 'pricing';

const PLANS = [
    {
        id: 'free',
        name: 'مجاني',
        nameEn: 'Free',
        price: '0',
        period: '/شهرياً',
        color: '#64748B',
        gradient: 'linear-gradient(135deg, #64748B, #475569)',
        icon: Star,
        popular: false,
        features: [
            '50 عملية توليد / شهر',
            '3 مشاريع',
            'Creator Studio',
            'Prompt Engineer',
            'دعم عبر البريد',
        ],
        limitations: [
            'بدون نشر مباشر',
            'بدون Web Builder',
            'بدون تعليق صوتي',
        ],
    },
    {
        id: 'pro',
        name: 'احترافي',
        nameEn: 'Pro',
        price: '29',
        period: '/شهرياً',
        color: '#8B5CF6',
        gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
        icon: Zap,
        popular: true,
        features: [
            '500 عملية توليد / شهر',
            '20 مشروع',
            'جميع الأدوات الإبداعية',
            'Social Publisher (3 حسابات)',
            'Web Builder',
            'Voice Over',
            'Video Studio',
            'دعم أولوية',
        ],
        limitations: [],
    },
    {
        id: 'enterprise',
        name: 'المؤسسات',
        nameEn: 'Enterprise',
        price: '99',
        period: '/شهرياً',
        color: '#F59E0B',
        gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
        icon: Crown,
        popular: false,
        features: [
            'عمليات غير محدودة',
            'مشاريع غير محدودة',
            'جميع الأدوات',
            'Social Publisher (غير محدود)',
            'API Access',
            'White Label',
            'فريق عمل (10 مقاعد)',
            'مدير حساب مخصص',
            'دعم 24/7',
        ],
        limitations: [],
    },
];

export default function AuthPage() {
    const { signIn, signUp, signInWithGoogle } = useAuth();
    const [view, setView] = useState<AuthView>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [selectedPlan, setSelectedPlan] = useState('pro');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        try {
            if (view === 'login') {
                const { error } = await signIn(email, password);
                if (error) setError(error);
            } else {
                const { error } = await signUp(email, password, name);
                if (error) {
                    setError(error);
                } else {
                    setSuccessMessage('تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتأكيد الحساب.');
                }
            }
        } catch {
            setError('حدث خطأ غير متوقع. حاول مرة أخرى.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        const { error } = await signInWithGoogle();
        if (error) setError(error);
    };

    if (view === 'pricing') {
        return (
            <div className={styles.pricingPage}>
                <div className={styles.pricingHeader}>
                    <div className={styles.pricingLogo}>
                        <div className={styles.logoMark}>M</div>
                        <span>Mo3in<span className={styles.ai}>AI</span></span>
                    </div>
                    <h1>اختر خطتك المناسبة</h1>
                    <p>ابدأ مجاناً وترقّى حسب احتياجاتك</p>
                </div>

                <div className={styles.plansGrid}>
                    {PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            className={`${styles.planCard} ${selectedPlan === plan.id ? styles.planCardActive : ''} ${plan.popular ? styles.planCardPopular : ''}`}
                            onClick={() => setSelectedPlan(plan.id)}
                        >
                            {plan.popular && <div className={styles.popularBadge}>الأكثر شعبية</div>}
                            <div className={styles.planTop}>
                                <div className={styles.planIcon} style={{ background: plan.gradient }}>
                                    <plan.icon size={22} />
                                </div>
                                <h3>{plan.name}</h3>
                                <span className={styles.planNameEn}>{plan.nameEn}</span>
                            </div>
                            <div className={styles.planPrice}>
                                <span className={styles.currency}>$</span>
                                <span className={styles.amount}>{plan.price}</span>
                                <span className={styles.period}>{plan.period}</span>
                            </div>
                            <div className={styles.planFeatures}>
                                {plan.features.map((f, i) => (
                                    <div key={i} className={styles.featureItem}>
                                        <Check size={14} className={styles.featureCheck} />
                                        <span>{f}</span>
                                    </div>
                                ))}
                                {plan.limitations.map((l, i) => (
                                    <div key={`l-${i}`} className={`${styles.featureItem} ${styles.featureDisabled}`}>
                                        <span className={styles.featureX}>✕</span>
                                        <span>{l}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                className={styles.planBtn}
                                style={{ background: selectedPlan === plan.id ? plan.gradient : undefined }}
                                onClick={(e) => { e.stopPropagation(); setView('register'); }}
                            >
                                {plan.id === 'free' ? 'ابدأ مجاناً' : 'اشترك الآن'}
                            </button>
                        </div>
                    ))}
                </div>

                <button className={styles.backBtn} onClick={() => setView('login')}>
                    لدي حساب بالفعل ← تسجيل الدخول
                </button>
            </div>
        );
    }

    return (
        <div className={styles.authPage}>
            {/* Left Panel - Form */}
            <div className={styles.formPanel}>
                <div className={styles.formContainer}>
                    <div className={styles.formLogo}>
                        <div className={styles.logoMark}>M</div>
                        <span>Mo3in<span className={styles.ai}>AI</span></span>
                    </div>

                    <div className={styles.formHeader}>
                        <h1>{view === 'login' ? 'مرحباً بعودتك 👋' : 'إنشاء حساب جديد ✨'}</h1>
                        <p>{view === 'login' ? 'سجل دخولك للوصول إلى أدواتك الذكية' : 'ابدأ رحلتك مع الذكاء الاصطناعي'}</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className={styles.errorMsg}>
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {successMessage && (
                        <div className={styles.successMsg}>
                            <Check size={16} />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    <form className={styles.form} onSubmit={handleSubmit}>
                        {view === 'register' && (
                            <div className={styles.field}>
                                <label>الاسم الكامل</label>
                                <div className={styles.inputWrap}>
                                    <User size={16} className={styles.inputIcon} />
                                    <input
                                        type="text"
                                        placeholder="أدخل اسمك"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className={styles.field}>
                            <label>البريد الإلكتروني</label>
                            <div className={styles.inputWrap}>
                                <Mail size={16} className={styles.inputIcon} />
                                <input
                                    type="email"
                                    placeholder="example@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label>كلمة المرور</label>
                            <div className={styles.inputWrap}>
                                <Lock size={16} className={styles.inputIcon} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className={styles.eyeBtn}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {view === 'login' && (
                            <div className={styles.forgotRow}>
                                <button type="button" className={styles.forgotBtn}>نسيت كلمة المرور؟</button>
                            </div>
                        )}

                        <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                            {isLoading ? (
                                <div className={styles.spinner} />
                            ) : (
                                <>
                                    {view === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className={styles.divider}>
                        <span>أو</span>
                    </div>

                    <button className={styles.socialBtn} onClick={handleGoogleLogin}>
                        <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        الدخول بحساب Google
                    </button>

                    <div className={styles.switchAuth}>
                        {view === 'login' ? (
                            <p>ليس لديك حساب؟ <button onClick={() => { setView('register'); setError(null); setSuccessMessage(null); }}>إنشاء حساب</button></p>
                        ) : (
                            <p>لديك حساب بالفعل؟ <button onClick={() => { setView('login'); setError(null); setSuccessMessage(null); }}>تسجيل الدخول</button></p>
                        )}
                        <button className={styles.pricingLink} onClick={() => setView('pricing')}>
                            <Crown size={12} /> عرض خطط الاشتراك
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Panel - Branding */}
            <div className={styles.brandPanel}>
                <div className={styles.brandContent}>
                    <Sparkles size={40} className={styles.brandIcon} />
                    <h2>منصة الذكاء الاصطناعي<br />لإنشاء المحتوى</h2>
                    <p>16 أداة ذكية في منصة واحدة</p>

                    <div className={styles.brandFeatures}>
                        <div className={styles.brandFeature}>
                            <div className={styles.brandFeatureIcon}><Sparkles size={16} /></div>
                            <span>تصميم صور احترافية بالذكاء الاصطناعي</span>
                        </div>
                        <div className={styles.brandFeature}>
                            <div className={styles.brandFeatureIcon}><Zap size={16} /></div>
                            <span>نشر مباشر على جميع المنصات</span>
                        </div>
                        <div className={styles.brandFeature}>
                            <div className={styles.brandFeatureIcon}><Shield size={16} /></div>
                            <span>بناء مواقع كاملة بـ Claude Opus</span>
                        </div>
                    </div>

                    <div className={styles.brandStats}>
                        <div><strong>+5000</strong><span>مستخدم نشط</span></div>
                        <div><strong>+100K</strong><span>محتوى مولّد</span></div>
                        <div><strong>4.9★</strong><span>تقييم</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
