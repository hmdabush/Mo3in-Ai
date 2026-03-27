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
}

export default function ToolLayout({ icon, title, titleAr, description, children, output }: ToolLayoutProps) {
    return (
        <div className={styles.container}>
            <div className={styles.controlsSection}>
                <div className={styles.header}>
                    <div className={styles.headerIcon}>{icon}</div>
                    <div>
                        <h2 className={styles.title}>{title}</h2>
                        <p className={styles.titleAr}>{titleAr}</p>
                    </div>
                </div>
                <p className={styles.description}>{description}</p>
                <div className={styles.controls}>
                    {children}
                </div>
            </div>
            {output && (
                <div className={styles.outputSection}>
                    {output}
                </div>
            )}
        </div>
    );
}
