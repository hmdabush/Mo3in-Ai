'use client';

import React, { useEffect } from 'react';
import { useAppStore, TOOLS, type ToolId } from '@/store/useAppStore';
import TopNav from '@/components/layout/TopNav';
import ProjectTabs from '@/components/layout/ProjectTabs';
import CreatorStudio from '@/components/tools/CreatorStudio';
import Storyboard from '@/components/tools/Storyboard';
import Marketing from '@/components/tools/Marketing';
import Photoshoot from '@/components/tools/Photoshoot';
import EditPro from '@/components/tools/EditPro';
import Plan from '@/components/tools/Plan';
import Campaign from '@/components/tools/Campaign';
import PromptEngineer from '@/components/tools/PromptEngineer';
import VoiceOver from '@/components/tools/VoiceOver';
import VideoStudio from '@/components/tools/VideoStudio';
import WebBuilder from '@/components/tools/WebBuilder';
import SocialPublisher from '@/components/tools/SocialPublisher';
import Dashboard from '@/components/tools/Dashboard';
import Analytics from '@/components/tools/Analytics';
import Templates from '@/components/tools/Templates';
import BrandKit from '@/components/tools/BrandKit';
import UGCCreator from '@/components/tools/UGCCreator';

const VALID_TOOLS = new Set(['dashboard', ...TOOLS.map(t => t.id)]);

export default function AppShell() {
    const activeTool = useAppStore((s) => s.activeTool);
    const setActiveTool = useAppStore((s) => s.setActiveTool);

    // Sync URL hash → active tool on load and hash change
    useEffect(() => {
        const readHash = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash && VALID_TOOLS.has(hash)) {
                setActiveTool(hash as ToolId);
            }
        };
        readHash();
        window.addEventListener('hashchange', readHash);
        return () => window.removeEventListener('hashchange', readHash);
    }, [setActiveTool]);

    // Sync active tool → URL hash
    useEffect(() => {
        const hash = activeTool === 'dashboard' ? '' : activeTool;
        const currentHash = window.location.hash.replace('#', '');
        if (currentHash !== hash) {
            window.history.replaceState(null, '', hash ? `#${hash}` : window.location.pathname);
        }
    }, [activeTool]);

    const renderTool = () => {
        switch (activeTool) {
            case 'dashboard': return <Dashboard />;
            case 'creator-studio': return <CreatorStudio />;
            case 'storyboard': return <Storyboard />;
            case 'marketing': return <Marketing />;
            case 'photoshoot': return <Photoshoot />;
            case 'edit-pro': return <EditPro />;
            case 'plan': return <Plan />;
            case 'campaign': return <Campaign />;
            case 'prompt': return <PromptEngineer />;
            case 'voiceover': return <VoiceOver />;
            case 'video-studio': return <VideoStudio />;
            case 'web-builder': return <WebBuilder />;
            case 'social-publisher': return <SocialPublisher />;
            case 'analytics': return <Analytics />;
            case 'templates': return <Templates />;
            case 'brand-kit': return <BrandKit />;
            case 'ugc': return <UGCCreator />;
            default: return <Dashboard />;
        }
    };

    return (
        <div className="app-shell">
            <TopNav />
            <ProjectTabs />
            <div key={activeTool}>
                {renderTool()}
            </div>
        </div>
    );
}

