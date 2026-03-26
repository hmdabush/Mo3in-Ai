'use client';

import React, { useState } from 'react';
import { useAppStore, ToolId } from '@/store/useAppStore';
import {
    LayoutGrid, Search, Star, Download, Eye, Sparkles,
    X, ExternalLink, Copy, Check, Filter, Heart,
} from 'lucide-react';
import styles from './Templates.module.css';

const CATEGORIES = ['الكل', 'سوشيال ميديا', 'إعلانات', 'بطاقات أعمال', 'قوائم طعام', 'عروض تقديمية', 'قصص'];

interface Template {
    id: number;
    name: string;
    category: string;
    color: string;
    downloads: number;
    rating: number;
    size: string;
    gradient: string;
    description: string;
    tags: string[];
}

const TEMPLATES: Template[] = [
    { id: 1, name: 'بوست إنستغرام عصري', category: 'سوشيال ميديا', color: '#E4405F', downloads: 1240, rating: 4.9, size: '1080x1080', gradient: 'linear-gradient(135deg, #E4405F, #C13584)', description: 'تصميم عصري لبوستات إنستغرام مع تأثيرات بصرية جذابة', tags: ['إنستغرام', 'عصري'] },
    { id: 2, name: 'إعلان فيسبوك احترافي', category: 'إعلانات', color: '#1877F2', downloads: 890, rating: 4.7, size: '1200x628', gradient: 'linear-gradient(135deg, #1877F2, #0D47A1)', description: 'قالب إعلان مُحسّن لمنصة فيسبوك بأبعاد مثالية', tags: ['فيسبوك', 'إعلان'] },
    { id: 3, name: 'ستوري إنستغرام', category: 'قصص', color: '#8B5CF6', downloads: 2100, rating: 4.8, size: '1080x1920', gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', description: 'قالب ستوري متحرك لإنستغرام مع أنماط إبداعية', tags: ['ستوري', 'إنستغرام'] },
    { id: 4, name: 'بطاقة أعمال فاخرة', category: 'بطاقات أعمال', color: '#F59E0B', downloads: 670, rating: 4.6, size: '3.5x2 in', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)', description: 'بطاقة أعمال بتصميم فاخر مع لمسات ذهبية', tags: ['بطاقة', 'فاخر'] },
    { id: 5, name: 'قائمة مطعم عربي', category: 'قوائم طعام', color: '#10B981', downloads: 430, rating: 4.5, size: 'A4', gradient: 'linear-gradient(135deg, #10B981, #059669)', description: 'قائمة طعام بتصميم عربي أصيل ومساحة للصور', tags: ['مطعم', 'عربي'] },
    { id: 6, name: 'عرض تقديمي شركة', category: 'عروض تقديمية', color: '#06B6D4', downloads: 1560, rating: 4.9, size: '16:9', gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)', description: 'عرض تقديمي احترافي لعروض الشركات والمشاريع', tags: ['عرض', 'شركة'] },
    { id: 7, name: 'بوست تيك توك', category: 'سوشيال ميديا', color: '#00F2EA', downloads: 980, rating: 4.4, size: '1080x1920', gradient: 'linear-gradient(135deg, #00F2EA, #FF0050)', description: 'قالب مثالي لمحتوى تيك توك بألوان نابضة', tags: ['تيك توك', 'فيديو'] },
    { id: 8, name: 'إعلان جوجل بانر', category: 'إعلانات', color: '#EA4335', downloads: 540, rating: 4.3, size: '728x90', gradient: 'linear-gradient(135deg, #EA4335, #FBBC05)', description: 'بانر إعلاني لشبكة جوجل الإعلانية', tags: ['جوجل', 'بانر'] },
    { id: 9, name: 'ستوري عرض خاص', category: 'قصص', color: '#EC4899', downloads: 1890, rating: 4.8, size: '1080x1920', gradient: 'linear-gradient(135deg, #EC4899, #BE185D)', description: 'ستوري عرض خاص مع عداد تنازلي وتأثيرات', tags: ['عرض', 'خاص'] },
    { id: 10, name: 'بوست تويتر', category: 'سوشيال ميديا', color: '#1DA1F2', downloads: 720, rating: 4.5, size: '1600x900', gradient: 'linear-gradient(135deg, #1DA1F2, #0D8ECF)', description: 'قالب بوست X/Twitter بأبعاد محسنة للتفاعل', tags: ['تويتر', 'بوست'] },
    { id: 11, name: 'فلاير عرض رمضان', category: 'إعلانات', color: '#7C3AED', downloads: 2340, rating: 5.0, size: 'A5', gradient: 'linear-gradient(135deg, #7C3AED, #4C1D95)', description: 'فلاير رمضاني بزخارف إسلامية وألوان دافئة', tags: ['رمضان', 'فلاير'] },
    { id: 12, name: 'بطاقة دعوة فاخرة', category: 'بطاقات أعمال', color: '#D4AF37', downloads: 310, rating: 4.7, size: '5x7 in', gradient: 'linear-gradient(135deg, #D4AF37, #996515)', description: 'بطاقة دعوة أنيقة للمناسبات والفعاليات', tags: ['دعوة', 'فاخر'] },
];

export default function Templates() {
    const [activeCategory, setActiveCategory] = useState('الكل');
    const [search, setSearch] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [favorites, setFavorites] = useState<Set<number>>(new Set());
    const setActiveTool = useAppStore(s => s.setActiveTool);

    const filtered = TEMPLATES.filter(t => {
        const matchCat = activeCategory === 'الكل' || t.category === activeCategory;
        const matchSearch = !search || t.name.includes(search) || t.category.includes(search) || t.tags.some(tag => tag.includes(search));
        return matchCat && matchSearch;
    });

    const toggleFavorite = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setFavorites(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const getCategoryCount = (cat: string) => {
        if (cat === 'الكل') return TEMPLATES.length;
        return TEMPLATES.filter(t => t.category === cat).length;
    };

    return (
        <div className={styles.layout}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <LayoutGrid size={22} className={styles.headerIcon} />
                    <div>
                        <h1>مكتبة القوالب</h1>
                        <p>قوالب جاهزة لجميع احتياجاتك التسويقية</p>
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <div className={styles.searchWrap}>
                        <Search size={16} />
                        <input placeholder="ابحث عن قالب..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <span className={styles.resultCount}>{filtered.length} قالب</span>
                </div>
            </div>

            <div className={styles.categories}>
                {CATEGORIES.map(cat => (
                    <button key={cat}
                        className={`${styles.catBtn} ${activeCategory === cat ? styles.catBtnActive : ''}`}
                        onClick={() => setActiveCategory(cat)}>
                        {cat}
                        <span className={styles.catCount}>{getCategoryCount(cat)}</span>
                    </button>
                ))}
            </div>

            <div className={styles.content}>
                <div className={styles.grid}>
                    {filtered.map((t) => (
                        <div key={t.id} className={styles.templateCard} onClick={() => setSelectedTemplate(t)}>
                            <div className={styles.templatePreview} style={{ background: t.gradient }}>
                                <div className={styles.templateOverlay}>
                                    <button className={styles.previewBtn}>
                                        <Eye size={14} /> معاينة
                                    </button>
                                    <button className={styles.useBtn} onClick={(e) => { e.stopPropagation(); setActiveTool('creator-studio' as ToolId); }}>
                                        <Sparkles size={14} /> استخدام
                                    </button>
                                </div>
                                <span className={styles.templateSize}>{t.size}</span>
                                <button
                                    className={`${styles.favBtn} ${favorites.has(t.id) ? styles.favBtnActive : ''}`}
                                    onClick={(e) => toggleFavorite(t.id, e)}
                                >
                                    <Heart size={14} />
                                </button>
                            </div>
                            <div className={styles.templateInfo}>
                                <h4>{t.name}</h4>
                                <span className={styles.templateCat}>{t.category}</span>
                                <div className={styles.templateMeta}>
                                    <span><Star size={11} /> {t.rating}</span>
                                    <span><Download size={11} /> {t.downloads.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className={styles.empty}>
                        <LayoutGrid size={48} />
                        <h3>لا توجد قوالب</h3>
                        <p>جرب البحث بكلمات مختلفة أو اختر فئة أخرى</p>
                    </div>
                )}
            </div>

            {/* Template Detail Modal */}
            {selectedTemplate && (
                <div className={styles.modalBackdrop} onClick={() => setSelectedTemplate(null)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={() => setSelectedTemplate(null)}>
                            <X size={18} />
                        </button>
                        <div className={styles.modalPreview} style={{ background: selectedTemplate.gradient }}>
                            <div className={styles.modalPreviewContent}>
                                <span className={styles.modalSize}>{selectedTemplate.size}</span>
                            </div>
                        </div>
                        <div className={styles.modalInfo}>
                            <h2>{selectedTemplate.name}</h2>
                            <p className={styles.modalDesc}>{selectedTemplate.description}</p>
                            <div className={styles.modalMeta}>
                                <span className={styles.modalCat}>{selectedTemplate.category}</span>
                                <span><Star size={12} /> {selectedTemplate.rating}</span>
                                <span><Download size={12} /> {selectedTemplate.downloads.toLocaleString()} تحميل</span>
                            </div>
                            <div className={styles.modalTags}>
                                {selectedTemplate.tags.map(tag => (
                                    <span key={tag} className={styles.tag}>#{tag}</span>
                                ))}
                            </div>
                            <div className={styles.modalActions}>
                                <button className={styles.modalPrimary} onClick={() => { setActiveTool('creator-studio'); setSelectedTemplate(null); }}>
                                    <Sparkles size={16} /> استخدام القالب
                                </button>
                                <button className={styles.modalSecondary}>
                                    <Download size={16} /> تحميل
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
