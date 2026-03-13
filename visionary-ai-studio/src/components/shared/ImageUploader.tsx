'use client';

import React, { useCallback, useRef, useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import styles from './ImageUploader.module.css';

interface ImageUploaderProps {
  label: string;
  image: { url: string; name: string } | null;
  onUpload: (file: File, url: string) => void;
  onRemove: () => void;
  compact?: boolean;
}

export default function ImageUploader({ label, image, onUpload, onRemove, compact = false }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    onUpload(file, url);
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className={styles.wrapper}>
      <label className="label">{label}</label>

      {image ? (
        <div className={`${styles.zone} ${styles.hasImage} ${compact ? styles.compact : ''}`}>
          <img src={image.url} alt={image.name} className={styles.img} />
          <button className={styles.removeBtn} onClick={onRemove}>
            <X size={14} />
          </button>
          <div className={styles.imgName}>{image.name}</div>
        </div>
      ) : (
        <div
          className={`${styles.zone} ${isDragging ? styles.dragging : ''} ${compact ? styles.compact : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
        >
          <div className={styles.iconWrap}>
            {isDragging ? <ImageIcon size={28} /> : <Upload size={28} />}
          </div>
          <p className={styles.text}>
            {isDragging ? 'Drop image here' : 'Click or drag to upload'}
          </p>
          <p className={styles.hint}>PNG, JPG, WEBP up to 10MB</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
        style={{ display: 'none' }}
      />
    </div>
  );
}

