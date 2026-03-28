'use client';

import React, { useRef, useState, useMemo, useCallback } from 'react';
import {
    Palette, Plus, X, Download, RotateCcw, Type, Layers, Crop,
    ZoomIn, ZoomOut, FlipHorizontal, FlipVertical, Undo2, Redo2,
    Image as ImageIcon, Droplets, Contrast,
} from 'lucide-react';
import styles from './EditPro.module.css';
import ToolLayout from '@/components/shared/ToolLayout';

interface SlotImage { id: string; url: string; name: string; }
interface TextOverlay { id: string; text: string; x: number; y: number; fontSize: number; color: string; }

const FILTERS = [
    { value: 'none', label: 'Original' },
    { value: 'warm', label: 'Warm Sun' },
    { value: 'cold', label: 'Ice Cold' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'dramatic', label: 'Dramatic' },
    { value: 'bw', label: 'B&W' },
    { value: 'cinema', label: 'Cinema' },
    { value: 'neon', label: 'Neon Pop' },
    { value: 'matte', label: 'Matte' },
    { value: 'sunset', label: 'Sunset' },
    { value: 'ocean', label: 'Ocean' },
    { value: 'forest', label: 'Forest' },
];

const FILTER_CSS: Record<string, string> = {
    none: 'none',
    warm: 'sepia(0.3) saturate(1.4) brightness(1.05)',
    cold: 'saturate(0.8) brightness(1.1) hue-rotate(10deg)',
    vintage: 'sepia(0.5) contrast(0.9) brightness(0.95)',
    dramatic: 'contrast(1.4) brightness(0.9) saturate(1.2)',
    bw: 'grayscale(1)',
    cinema: 'contrast(1.2) saturate(0.9) brightness(0.95) sepia(0.1)',
    neon: 'saturate(2) brightness(1.1) contrast(1.1)',
    matte: 'contrast(0.85) brightness(1.08) saturate(0.9)',
    sunset: 'sepia(0.2) saturate(1.5) brightness(1.05) hue-rotate(-10deg)',
    ocean: 'saturate(1.2) hue-rotate(20deg) brightness(1.05)',
    forest: 'saturate(1.3) hue-rotate(40deg) brightness(0.95)',
};

const CROP_RATIOS = [
    { value: 'free', label: 'Free' },
    { value: '1:1', label: '1:1' },
    { value: '4:3', label: '4:3' },
    { value: '16:9', label: '16:9' },
    { value: '9:16', label: '9:16' },
];

const EXPORT_FORMATS = [
    { value: 'png', label: 'PNG' },
    { value: 'jpg', label: 'JPG' },
    { value: 'webp', label: 'WebP' },
];

export default function EditPro() {
    const [images, setImages] = useState<SlotImage[]>([]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [filter, setFilter] = useState('none');
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [sharpness, setSharpness] = useState(0);
    const [blur, setBlur] = useState(0);
    const [hueRotate, setHueRotate] = useState(0);
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(100);
    const [activePanel, setActivePanel] = useState<'filters' | 'adjust' | 'crop' | 'text' | 'export'>('filters');
    const [cropRatio, setCropRatio] = useState('free');
    const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
    const [exportFormat, setExportFormat] = useState('png');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIdx, setHistoryIdx] = useState(-1);
    const fileRef = useRef<HTMLInputElement>(null);

    const addImage = (file: File) => {
        const url = URL.createObjectURL(file);
        setImages((prev) => [...prev, { id: crypto.randomUUID(), url, name: file.name }]);
        setActiveIdx(images.length);
    };

    const removeImage = (idx: number) => {
        setImages((prev) => prev.filter((_, i) => i !== idx));
        if (activeIdx >= images.length - 1) setActiveIdx(Math.max(0, images.length - 2));
    };

    const activeImage = images[activeIdx] || null;

    const filterStyle = useMemo(() => {
        const parts: string[] = [];
        if (filter !== 'none') parts.push(FILTER_CSS[filter]);
        if (brightness !== 100) parts.push(`brightness(${brightness / 100})`);
        if (contrast !== 100) parts.push(`contrast(${contrast / 100})`);
        if (saturation !== 100) parts.push(`saturate(${saturation / 100})`);
        if (blur > 0) parts.push(`blur(${blur}px)`);
        if (hueRotate !== 0) parts.push(`hue-rotate(${hueRotate}deg)`);
        return parts.length ? parts.join(' ') : 'none';
    }, [filter, brightness, contrast, saturation, blur, hueRotate]);

    const transformStyle = useMemo(() => {
        const parts: string[] = [];
        parts.push(`scale(${zoom / 100})`);
        if (flipH) parts.push('scaleX(-1)');
        if (flipV) parts.push('scaleY(-1)');
        if (rotation !== 0) parts.push(`rotate(${rotation}deg)`);
        return parts.join(' ');
    }, [zoom, flipH, flipV, rotation]);

    const resetAll = useCallback(() => {
        setFilter('none');
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setSharpness(0);
        setBlur(0);
        setHueRotate(0);
        setFlipH(false);
        setFlipV(false);
        setRotation(0);
        setZoom(100);
        setTextOverlays([]);
    }, []);

    const handleExport = useCallback(() => {
        if (!activeImage) return;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            if (ctx) {
                ctx.filter = filterStyle === 'none' ? '' : filterStyle;
                ctx.drawImage(img, 0, 0);
            }
            const mimeType = exportFormat === 'png' ? 'image/png' : exportFormat === 'webp' ? 'image/webp' : 'image/jpeg';
            const link = document.createElement('a');
            link.download = `mo3in-ai-edit.${exportFormat}`;
            link.href = canvas.toDataURL(mimeType, 0.95);
            link.click();
        };
        img.src = activeImage.url;
    }, [activeImage, filterStyle, exportFormat]);

    const addTextOverlay = useCallback(() => {
        setTextOverlays(prev => [...prev, {
            id: crypto.randomUUID(),
            text: 'Your Text',
            x: 50,
            y: 50,
            fontSize: 24,
            color: '#ffffff',
        }]);
    }, []);

    const removeTextOverlay = useCallback((id: string) => {
        setTextOverlays(prev => prev.filter(t => t.id !== id));
    }, []);

    const panels = [
        { key: 'filters', label: 'Filters', icon: <Droplets size={12} /> },
        { key: 'adjust', label: 'Adjust', icon: <Contrast size={12} /> },
        { key: 'crop', label: 'Crop', icon: <Crop size={12} /> },
        { key: 'text', label: 'Text', icon: <Type size={12} /> },
        { key: 'export', label: 'Export', icon: <Download size={12} /> },
    ];

    const outputContent = (
        <>
            <div className={styles.canvas}>
                {activeImage ? (
                    <div className={styles.canvasInner}>
                        <img
                            src={activeImage.url}
                            alt="Edit"
                            className={styles.canvasImage}
                            style={{ filter: filterStyle, transform: transformStyle }}
                        />
                        {textOverlays.map((overlay) => (
                            <div
                                key={overlay.id}
                                className={styles.canvasText}
                                style={{
                                    left: `${overlay.x}%`,
                                    top: `${overlay.y}%`,
                                    fontSize: `${overlay.fontSize}px`,
                                    color: overlay.color,
                                }}
                            >
                                {overlay.text}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.canvasEmpty}>
                        <div className={styles.canvasEmptyIcon}><Palette size={40} /></div>
                        <p>ارفع صورة للبدء في التعديل</p>
                    </div>
                )}
            </div>

            <div className={styles.bottomBar}>
                <button className={styles.bottomBtn} onClick={resetAll}><RotateCcw size={12} /> Reset All</button>
                <div className={styles.bottomCenter}>
                    <span className={styles.bottomInfo}>
                        {activeImage ? `${images.length} image${images.length > 1 ? 's' : ''} • ${filter !== 'none' ? FILTERS.find(f => f.value === filter)?.label : 'No filter'}` : 'No image loaded'}
                    </span>
                </div>
                <button className={`${styles.bottomBtn} ${styles.bottomBtnPrimary}`} onClick={handleExport} disabled={!activeImage}>
                    <Download size={12} /> Export
                </button>
            </div>
        </>
    );

    return (
        <>
            <ToolLayout
                icon={<Palette size={18} />}
                title="Edit PRO"
                titleAr="التحرير المتقدم"
                description="عدّل وحسّن صورك باحترافية. أضف فلاتر، أزل الخلفية، وعدّل الألوان بأدوات متقدمة."
                output={outputContent}
            >
                {/* Image Slots */}
                <div>
                    <label className="label">Image Slots</label>
                    <div className={styles.imageSlots}>
                        {images.map((img, i) => (
                            <div key={img.id} className={`${styles.slotItem} ${i === activeIdx ? styles.slotItemActive : ''}`} onClick={() => setActiveIdx(i)}>
                                <img src={img.url} alt={img.name} className={styles.slotThumb} />
                                <span className={styles.slotName}>{img.name}</span>
                                <button className={styles.slotRemove} onClick={(e) => { e.stopPropagation(); removeImage(i); }}><X size={12} /></button>
                            </div>
                        ))}
                        <button className={styles.slotBtn} onClick={() => fileRef.current?.click()}>
                            <Plus size={14} /> Add Base Photo
                        </button>
                    </div>
                </div>

                {/* Panel Tabs */}
                <div className={styles.panelTabs}>
                    {panels.map((p) => (
                        <button
                            key={p.key}
                            className={`${styles.panelTab} ${activePanel === p.key ? styles.panelTabActive : ''}`}
                            onClick={() => setActivePanel(p.key as typeof activePanel)}
                        >
                            {p.icon} {p.label}
                        </button>
                    ))}
                </div>

                {/* Filters Panel */}
                {activePanel === 'filters' && (
                    <div className={styles.toolSection}>
                        <div className={styles.toolSectionTitle}>Color Grading</div>
                        <div className={styles.filterGrid}>
                            {FILTERS.map((f) => (
                                <button key={f.value} className={`${styles.filterBtn} ${filter === f.value ? styles.filterBtnActive : ''}`} onClick={() => setFilter(f.value)}>
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Adjustments Panel */}
                {activePanel === 'adjust' && (
                    <div className={styles.toolSection}>
                        <div className={styles.toolSectionTitle}>Fine Adjustments</div>
                        <div className={styles.sliderGroup}>
                            <div className={styles.sliderRow}>
                                <span className={styles.sliderLabel}>Brightness</span>
                                <input type="range" min="50" max="150" value={brightness} onChange={(e) => setBrightness(+e.target.value)} className={styles.slider} />
                                <span className={styles.sliderVal}>{brightness}%</span>
                            </div>
                            <div className={styles.sliderRow}>
                                <span className={styles.sliderLabel}>Contrast</span>
                                <input type="range" min="50" max="150" value={contrast} onChange={(e) => setContrast(+e.target.value)} className={styles.slider} />
                                <span className={styles.sliderVal}>{contrast}%</span>
                            </div>
                            <div className={styles.sliderRow}>
                                <span className={styles.sliderLabel}>Saturation</span>
                                <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(+e.target.value)} className={styles.slider} />
                                <span className={styles.sliderVal}>{saturation}%</span>
                            </div>
                            <div className={styles.sliderRow}>
                                <span className={styles.sliderLabel}>Blur</span>
                                <input type="range" min="0" max="20" value={blur} onChange={(e) => setBlur(+e.target.value)} className={styles.slider} />
                                <span className={styles.sliderVal}>{blur}px</span>
                            </div>
                            <div className={styles.sliderRow}>
                                <span className={styles.sliderLabel}>Hue</span>
                                <input type="range" min="-180" max="180" value={hueRotate} onChange={(e) => setHueRotate(+e.target.value)} className={styles.slider} />
                                <span className={styles.sliderVal}>{hueRotate}°</span>
                            </div>
                        </div>

                        <div className={styles.transformRow}>
                            <button className={`${styles.transformBtn} ${flipH ? styles.transformBtnActive : ''}`} onClick={() => setFlipH(!flipH)}><FlipHorizontal size={14} /> Flip H</button>
                            <button className={`${styles.transformBtn} ${flipV ? styles.transformBtnActive : ''}`} onClick={() => setFlipV(!flipV)}><FlipVertical size={14} /> Flip V</button>
                            <button className={styles.transformBtn} onClick={() => setRotation((r) => (r + 90) % 360)}>
                                <RotateCcw size={14} /> Rotate
                            </button>
                        </div>

                        <div className={styles.sliderRow} style={{ marginTop: '8px' }}>
                            <span className={styles.sliderLabel}><ZoomIn size={12} /> Zoom</span>
                            <input type="range" min="50" max="200" value={zoom} onChange={(e) => setZoom(+e.target.value)} className={styles.slider} />
                            <span className={styles.sliderVal}>{zoom}%</span>
                        </div>
                    </div>
                )}

                {/* Crop Panel */}
                {activePanel === 'crop' && (
                    <div className={styles.toolSection}>
                        <div className={styles.toolSectionTitle}>Crop Ratio</div>
                        <div className={styles.cropGrid}>
                            {CROP_RATIOS.map((c) => (
                                <button
                                    key={c.value}
                                    className={`${styles.cropBtn} ${cropRatio === c.value ? styles.cropBtnActive : ''}`}
                                    onClick={() => setCropRatio(c.value)}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                        <p className={styles.cropHint}>Crop preview shown on canvas. Click Export to apply.</p>
                    </div>
                )}

                {/* Text Overlay Panel */}
                {activePanel === 'text' && (
                    <div className={styles.toolSection}>
                        <div className={styles.toolSectionTitle}>Text Overlays</div>
                        <button className={styles.addTextBtn} onClick={addTextOverlay}>
                            <Plus size={14} /> Add Text Layer
                        </button>
                        {textOverlays.map((overlay) => (
                            <div key={overlay.id} className={styles.textItem}>
                                <input
                                    className={styles.textInput}
                                    value={overlay.text}
                                    onChange={(e) => setTextOverlays(prev => prev.map(t => t.id === overlay.id ? { ...t, text: e.target.value } : t))}
                                    placeholder="Enter text..."
                                />
                                <div className={styles.textControls}>
                                    <input
                                        type="range" min="12" max="72"
                                        value={overlay.fontSize}
                                        onChange={(e) => setTextOverlays(prev => prev.map(t => t.id === overlay.id ? { ...t, fontSize: +e.target.value } : t))}
                                        className={styles.slider}
                                    />
                                    <span className={styles.sliderVal}>{overlay.fontSize}px</span>
                                    <input
                                        type="color"
                                        value={overlay.color}
                                        onChange={(e) => setTextOverlays(prev => prev.map(t => t.id === overlay.id ? { ...t, color: e.target.value } : t))}
                                        className={styles.colorPicker}
                                    />
                                    <button className={styles.textRemoveBtn} onClick={() => removeTextOverlay(overlay.id)}>
                                        <X size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Export Panel */}
                {activePanel === 'export' && (
                    <div className={styles.toolSection}>
                        <div className={styles.toolSectionTitle}>Export Settings</div>
                        <div className={styles.exportGrid}>
                            {EXPORT_FORMATS.map((f) => (
                                <button
                                    key={f.value}
                                    className={`${styles.exportBtn} ${exportFormat === f.value ? styles.exportBtnActive : ''}`}
                                    onClick={() => setExportFormat(f.value)}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                        <button className={styles.exportDownloadBtn} onClick={handleExport} disabled={!activeImage}>
                            <Download size={16} /> Export as {exportFormat.toUpperCase()}
                        </button>
                    </div>
                )}
            </ToolLayout>

            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) addImage(f); e.target.value = ''; }} />
        </>
    );
}
