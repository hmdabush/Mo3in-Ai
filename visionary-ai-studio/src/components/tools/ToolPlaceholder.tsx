'use client';

import React from 'react';
import { ToolId } from '@/store/useAppStore';
import { Film, BarChart3, Camera, Palette, Target, Megaphone, Wand2, Mic } from 'lucide-react';
import styles from './ToolPlaceholder.module.css';

const toolMeta: Record<string, { name: string; nameAr: string; icon: React.ReactNode; description: string }> = {
  storyboard: { name: 'Storyboard', nameAr: 'اللوحة السينمائية', icon: <Film size={48} />, description: 'Generate sequential video/ad scenes based on a script.' },
  marketing: { name: 'Marketing Engine', nameAr: 'المحرك الاستراتيجي', icon: <BarChart3 size={48} />, description: 'Comprehensive brand analysis and GTM strategy.' },
  photoshoot: { name: 'Photoshoot', nameAr: 'جلسة التصوير', icon: <Camera size={48} />, description: 'Generate specific camera angles and use-case shots.' },
  'edit-pro': { name: 'Edit PRO', nameAr: 'التحرير المتقدم', icon: <Palette size={48} />, description: 'Post-processing and graphic design on generated assets.' },
  plan: { name: 'Plan', nameAr: 'مخطط الحملات الاستراتيجية', icon: <Target size={48} />, description: 'Localized and culturally relevant campaign generation.' },
  campaign: { name: 'Campaign', nameAr: 'حملات السوشيال ميديا', icon: <Megaphone size={48} />, description: 'Generate a cohesive 6-post social media funnel.' },
  prompt: { name: 'Prompt Engineer', nameAr: 'هندسة الأوامر', icon: <Wand2 size={48} />, description: 'Reverse-engineer images into high-quality AI prompts.' },
  voiceover: { name: 'Voice Over', nameAr: 'التعليق الصوتي', icon: <Mic size={48} />, description: 'Text-to-speech for ad scripts.' },
};

export default function ToolPlaceholder({ toolId }: { toolId: ToolId }) {
  const meta = toolMeta[toolId];
  if (!meta) return null;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>{meta.icon}</div>
        <h2 className={styles.title}>{meta.name}</h2>
        <p className={styles.subtitle}>{meta.nameAr}</p>
        <p className={styles.desc}>{meta.description}</p>
        <div className={styles.badge}>
          <span className={styles.dot} />
          Coming Next
        </div>
      </div>
    </div>
  );
}

