'use client'

import React from 'react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import { Toolbar } from '@/components/toolbar'
import { BottomPanel } from '@/components/bottom-panel'
import { StatisticsOverlay } from '@/components/statistics-overlay'
import { SettingsOverlay } from '@/components/settings-overlay'
import { HelpOverlay } from '@/components/help-overlay'
import { ProjectExplorer } from '@/features/explorer/project-explorer'
import { useLayoutStore } from '@/store/layout-store'

export function AppShell() {
  const { bottomPanelOpen, bottomPanelSize, setBottomPanelSize } = useLayoutStore()

  const handleBottomPanelResize = (size: number) => {
    setBottomPanelSize(size)
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Top Toolbar */}
      <Toolbar />

      {/* Main Workspace: Explorer + Viewer (always visible, never swapped) */}
      <PanelGroup direction="vertical" className="flex-1">
        {/* Main Content Panel */}
        <Panel defaultSize={bottomPanelOpen ? 70 : 100} minSize={40}>
          <ProjectExplorer />
        </Panel>

        {/* Resize Handle */}
        {bottomPanelOpen && (
          <>
            <PanelResizeHandle className="h-1 bg-border hover:bg-primary/50 transition-colors" />

            {/* Bottom Panel: Tabbed Workspace */}
            <Panel
              defaultSize={bottomPanelSize}
              minSize={15}
              maxSize={50}
              onResize={handleBottomPanelResize}
            >
              <BottomPanel />
            </Panel>
          </>
        )}
      </PanelGroup>

      {/* Overlays */}
      <StatisticsOverlay />
      <SettingsOverlay />
      <HelpOverlay />
    </div>
  )
}
