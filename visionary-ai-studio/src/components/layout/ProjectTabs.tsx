'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Plus, X, FolderOpen } from 'lucide-react';
import styles from './ProjectTabs.module.css';

export default function ProjectTabs() {
  const { projects, activeProjectId, setActiveProject, addProject, removeProject } = useAppStore();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  return (
    <div className={styles.bar}>
      <div className={styles.container}>
        {projects.map((project) => {
          const isActive = project.id === activeProjectId;
          const isHovered = project.id === hoveredTab;
          return (
            <button
              key={project.id}
              id={`project-tab-${project.id}`}
              className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
              onClick={() => setActiveProject(project.id)}
              onMouseEnter={() => setHoveredTab(project.id)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              <FolderOpen size={13} className={isActive ? styles.tabActiveIcon : undefined} />
              <span>{project.name}</span>
              {projects.length > 1 && (isActive || isHovered) && (
                <button
                  className={styles.close}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeProject(project.id);
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </button>
          );
        })}
        <button
          className={`${styles.tab} ${styles.addTab}`}
          onClick={addProject}
          id="add-project-tab"
          title="Add new project"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

