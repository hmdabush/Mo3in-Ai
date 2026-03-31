'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
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

export default function AppShell() {
    const activeTool = useAppStore((s) => s.activeTool);

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

