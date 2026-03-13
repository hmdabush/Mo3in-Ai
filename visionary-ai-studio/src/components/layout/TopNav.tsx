'use client';

import React from 'react';
import { useAppStore, TOOLS } from '@/store/useAppStore';
import {
  Sparkles, Film, BarChart3, Camera, Palette,
  Target, Megaphone, Wand2, Mic, Video,
} from 'lucide-react';
import styles from './TopNav.module.css';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Sparkles, Film, BarChart3, Camera, Palette, Target, Megaphone, Wand2, Mic, Video,
};

export default function TopNav() {
  const { activeTool, setActiveTool } = useAppStore();

  return (
    <nav className={styles.topNav}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <span className={styles.logoLetter}>M</span>
        </div>
        <span className={styles.logoText}>
          Mo3in<span className={styles.logoAi}>AI</span>
        </span>
      </div>

      <div className={styles.tools}>
        {TOOLS.map((tool) => {
          const IconComponent = iconMap[tool.icon];
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              id={`nav-tool-${tool.id}`}
              className={`${styles.toolTab} ${isActive ? styles.toolTabActive : ''}`}
              onClick={() => setActiveTool(tool.id)}
              title={tool.nameAr}
            >
              <IconComponent size={15} className={isActive ? styles.toolTabActiveIcon : undefined} />
              <span className={styles.toolTabLabel}>{tool.name}</span>
              {isActive && <div className={styles.toolTabIndicator} />}
            </button>
          );
        })}
      </div>

      <div className={styles.right}>
        <button className={styles.apiBtn}>
          <span className={styles.apiDot} />
          API Connected
        </button>
      </div>
    </nav>
  );
}

