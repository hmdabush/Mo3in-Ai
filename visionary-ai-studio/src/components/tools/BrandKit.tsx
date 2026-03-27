'use client';

import React, { useState } from 'react';
import { Brush, Plus, Copy, Check, Type, Palette, Image, Save, Trash2, Edit3 } from 'lucide-react';
import styles from './BrandKit.module.css';
import ToolGuide from '@/components/shared/ToolGuide';

const DEFAULT_COLORS = [
    { name: 'أساسي', hex: '#06B6D4' },
    { name: 'ثانوي', hex: '#8B5CF6' },
    { name: 'تمييز', hex: '#F59E0B' },
    { name: 'نجاح', hex: '#10B981' },
    { name: 'خطر', hex: '#EF4444' },
    { name: 'خلفية', hex: '#0F172A' },
];

const DEFAULT_FONTS = [
    { name: 'العناوين', font: 'Cairo', weight: '800', size: '32px', sample: 'عنوان رئيسي' },
    { name: 'النصوص', font: 'Cairo', weight: '400', size: '16px', sample: 'نص عادي للمحتوى والوصف' },
    { name: 'الأزرار', font: 'Plus Jakarta Sans', weight: '700', size: '14px', sample: 'Button Text' },
];

const BRAND_GUIDELINES = [
    { title: 'نبرة الصوت', desc: 'ودية، احترافية، مبتكرة', icon: '🗣️' },
    { title: 'الجمهور المستهدف', desc: 'رواد أعمال وأصحاب مشاريع عرب', icon: '🎯' },
    { title: 'القيم الأساسية', desc: 'الابتكار، الجودة، البساطة', icon: '💎' },
    { title: 'الشعار', desc: 'نص Mo3in AI مع رمز M', icon: '✨' },
];

export default function BrandKit() {
    const [colors, setColors] = useState(DEFAULT_COLORS);
    const [copiedColor, setCopiedColor] = useState<string | null>(null);
    const [brandName, setBrandName] = useState('Mo3in AI');
    const [brandSlogan, setBrandSlogan] = useState('منصة الذكاء الاصطناعي لإنشاء المحتوى');
    const [editingColor, setEditingColor] = useState<number | null>(null);

    const copyColor = (hex: string) => {
        navigator.clipboard.writeText(hex);
        setCopiedColor(hex);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    const updateColor = (index: number, hex: string) => {
        const updated = [...colors];
        updated[index] = { ...updated[index], hex };
        setColors(updated);
    };

    const addColor = () => {
        setColors([...colors, { name: `لون ${colors.length + 1}`, hex: '#6366F1' }]);
    };

    return (
        <div className={styles.layout}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Brush size={22} className={styles.headerIcon} />
                    <div>
                        <h1>هوية العلامة التجارية</h1>
                        <p>إدارة الألوان والخطوط والإرشادات البصرية</p>
                    </div>
                </div>
                <button className={styles.saveBtn}><Save size={14} /> حفظ التغييرات</button>
            </div>

            <ToolGuide
                    title="هوية العلامة"
                    description="أنشئ واحفظ هوية علامتك التجارية. حدد الألوان والخطوط والشعار لتطبيقها تلقائياً على جميع تصاميمك."
                    steps={[
                        'أضف ألوان علامتك التجارية',
                        'اختر الخطوط المناسبة لهويتك',
                        'ارفع شعار العلامة التجارية',
                        'احفظ الهوية لاستخدامها في باقي الأدوات',
                    ]}
                />

            <div className={styles.content}>
                {/* Brand Identity */}
                <div className={styles.section}>
                    <h2>🏷️ معلومات العلامة</h2>
                    <div className={styles.brandIdentity}>
                        <div className={styles.brandLogoArea}>
                            <div className={styles.logoPlaceholder}>
                                <span className={styles.logoLetter}>M</span>
                            </div>
                            <button className={styles.changeLogoBtn}><Image size={12} /> تغيير الشعار</button>
                        </div>
                        <div className={styles.brandFields}>
                            <div className={styles.field}>
                                <label>اسم العلامة</label>
                                <input value={brandName} onChange={e => setBrandName(e.target.value)} className={styles.input} />
                            </div>
                            <div className={styles.field}>
                                <label>الشعار النصي</label>
                                <input value={brandSlogan} onChange={e => setBrandSlogan(e.target.value)} className={styles.input} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Colors */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2><Palette size={16} /> لوحة الألوان</h2>
                        <button className={styles.addBtn} onClick={addColor}><Plus size={14} /> إضافة لون</button>
                    </div>
                    <div className={styles.colorsGrid}>
                        {colors.map((c, i) => (
                            <div key={i} className={styles.colorCard}>
                                <div className={styles.colorPreview} style={{ background: c.hex }}
                                    onClick={() => setEditingColor(editingColor === i ? null : i)}>
                                    {editingColor === i && (
                                        <input type="color" value={c.hex} className={styles.colorPicker}
                                            onChange={e => updateColor(i, e.target.value)} />
                                    )}
                                </div>
                                <div className={styles.colorInfo}>
                                    <span className={styles.colorName}>{c.name}</span>
                                    <button className={styles.colorHex} onClick={() => copyColor(c.hex)}>
                                        {copiedColor === c.hex ? <><Check size={10} /> تم</> : <><Copy size={10} /> {c.hex}</>}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Typography */}
                <div className={styles.section}>
                    <h2><Type size={16} /> الخطوط والطباعة</h2>
                    <div className={styles.fontsList}>
                        {DEFAULT_FONTS.map((f, i) => (
                            <div key={i} className={styles.fontCard}>
                                <div className={styles.fontInfo}>
                                    <span className={styles.fontLabel}>{f.name}</span>
                                    <span className={styles.fontMeta}>{f.font} · {f.weight} · {f.size}</span>
                                </div>
                                <div className={styles.fontSample} style={{ fontFamily: f.font, fontWeight: f.weight, fontSize: f.size }}>
                                    {f.sample}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Brand Guidelines */}
                <div className={styles.section}>
                    <h2>📋 إرشادات العلامة</h2>
                    <div className={styles.guidelinesGrid}>
                        {BRAND_GUIDELINES.map((g, i) => (
                            <div key={i} className={styles.guidelineCard}>
                                <span className={styles.guidelineIcon}>{g.icon}</span>
                                <div>
                                    <span className={styles.guidelineTitle}>{g.title}</span>
                                    <span className={styles.guidelineDesc}>{g.desc}</span>
                                </div>
                                <button className={styles.editBtn}><Edit3 size={12} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
