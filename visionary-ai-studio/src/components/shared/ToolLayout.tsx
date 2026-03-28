'use client';

import React from 'react';
import styles from './ToolLayout.module.css';

interface ToolLayoutProps {
    icon: React.ReactNode;
    title: string;
    titleAr: string;
    description: string;
    children: React.ReactNode;
    output?: React.ReactNode;
    /** Use wide layout for tools with lots of controls */
    wide?: boolean;
}

export default function ToolLayout({ icon, title, titleAr, description, children, output, wide }: ToolLayoutProps) {
    const hasOutput = !!output;

    return (
        <div className={styles.page}>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <div className={styles.topBarInner}>
                    <div className={styles.toolBadge}>
                        <div className={styles.toolIcon}>{icon}</div>
                        <div className={styles.toolInfo}>
                            <span className={styles.toolTitle}>{titleAr}</span>
                            <span className={styles.toolTitleEn}>{title}</span>
                        </div>
                    </div>
                    <p className={styles.toolDesc}>{description}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.main}>
                <div className={`${styles.controls} ${wide ? styles.controlsWide : ''}`}>
                    {children}
                </div>

                {hasOutput && (
                    <div className={styles.output}>
                        {output}
                    </div>
                )}
            </div>
        </div>
    );
}
