'use client'

import React, { useState } from 'react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import { useProjectStore } from '@/store/project-store'
import { FileTree } from '@/features/explorer/file-tree'
import { CodeViewer } from '@/features/explorer/code-viewer'
import { VBAFile } from '@/types/index'

export function ProjectExplorer() {
  const { files } = useProjectStore()
  const [selectedFile, setSelectedFile] = useState<VBAFile | null>(null)

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {files.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="text-sm mb-2">No project imported</p>
            <p className="text-xs">Use the "Import Project" button in the sidebar</p>
          </div>
        </div>
      ) : (
        <PanelGroup direction="horizontal" className="flex-1">
          {/* File Tree */}
          <Panel defaultSize={30} minSize={20} maxSize={50}>
            <div className="h-full flex flex-col border-r border-border">
              <div className="px-4 py-3 border-b border-border bg-card/50">
                <h3 className="text-sm font-semibold">Files ({files.length})</h3>
              </div>
              <div className="flex-1 overflow-hidden">
                <FileTree
                  files={files}
                  onSelectFile={setSelectedFile}
                  selectedFileId={selectedFile?.id}
                />
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />

          {/* Code Viewer */}
          <Panel defaultSize={70} minSize={50}>
            <CodeViewer file={selectedFile} />
          </Panel>
        </PanelGroup>
      )}
    </div>
  )
}
