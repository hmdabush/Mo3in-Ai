'use client';

import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

interface ToolGuideProps {
    title: string;
    description: string;
    steps: string[];
}

export default function ToolGuide({ title, description, steps }: ToolGuideProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{
            margin: '0 0 12px 0',
            padding: '10px 12px',
            background: 'rgba(139, 92, 246, 0.08)',
            borderRadius: '10px',
            border: '1px solid rgba(139, 92, 246, 0.15)',
            direction: 'rtl',
        }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: '#c4b5fd',
                    fontSize: '12px',
                    fontWeight: 600,
                }}
            >
                <Info size={14} style={{ color: '#8B5CF6', flexShrink: 0 }} />
                <span style={{ flex: 1, textAlign: 'right' }}>كيف تستخدم {title}؟</span>
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {isOpen && (
                <div style={{ marginTop: '10px' }}>
                    <p style={{
                        fontSize: '11px',
                        color: '#a1a1aa',
                        lineHeight: 1.7,
                        margin: '0 0 8px 0',
                    }}>
                        {description}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {steps.map((step, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '6px',
                                fontSize: '11px',
                                color: '#a1a1aa',
                                lineHeight: 1.6,
                            }}>
                                <span style={{
                                    background: '#8B5CF6',
                                    color: '#fff',
                                    borderRadius: '50%',
                                    width: '16px',
                                    height: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '9px',
                                    fontWeight: 700,
                                    flexShrink: 0,
                                    marginTop: '2px',
                                }}>
                                    {i + 1}
                                </span>
                                <span>{step}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
