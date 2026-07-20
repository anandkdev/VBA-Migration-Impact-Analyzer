'use client'

import React, { useState } from 'react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import { FileTreeSkeleton } from '@/components/loaders/skeleton-loader'
import { useProjectStore } from '@/store/project-store'
import { FileTree } from '@/features/explorer/file-tree'
import { CodeViewer } from '@/features/explorer/code-viewer'

export function ProjectExplorer() {
  const { files, activeFileId, setActiveFile } = useProjectStore()
  const [isLoadingTree, setIsLoadingTree] = useState(false)

  // Simulate file tree loading
  React.useEffect(() => {
    if (files.length > 0) {
      setIsLoadingTree(true)
      const timer = setTimeout(() => setIsLoadingTree(false), 300)
      return () => clearTimeout(timer)
    }
  }, [files])

  // Get the selected file from the store
  const selectedFile = activeFileId ? files.find((f) => f.id === activeFileId) || null : null

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
                {isLoadingTree ? (
                  <FileTreeSkeleton />
                ) : (
                  <FileTree
                    files={files}
                    onSelectFile={(file) => setActiveFile(file.id)}
                    selectedFileId={activeFileId || undefined}
                  />
                )}
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
