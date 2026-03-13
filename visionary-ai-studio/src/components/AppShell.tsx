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

export default function AppShell() {
    const activeTool = useAppStore((s) => s.activeTool);

    const renderTool = () => {
        switch (activeTool) {
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
            default: return <CreatorStudio />;
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

