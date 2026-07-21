'use client'

import React from 'react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import { ProjectExplorer } from '@/features/explorer/project-explorer'
import { SmartViewer } from '@/features/viewer/smart-viewer'

export function ExplorerMode() {
  return (
    <div className="flex-1 overflow-hidden">
      <PanelGroup direction="horizontal" className="h-full">
        {/* Project Explorer */}
        <Panel defaultSize={25} minSize={15} maxSize={50}>
          <div className="h-full overflow-auto">
            <ProjectExplorer />
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />

        {/* Smart Viewer */}
        <Panel defaultSize={75} minSize={40}>
          <SmartViewer />
        </Panel>
      </PanelGroup>
    </div>
  )
}
