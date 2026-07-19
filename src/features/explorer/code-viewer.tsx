'use client'

import React, { useMemo } from 'react'
import { VBAFile } from '@/types/index'
import { getFileTypeIcon, getFileTypeDisplayName } from '@/features/import/import-service'
import { ScrollArea } from '@/components/ui/scroll-area'

interface CodeViewerProps {
  file: VBAFile | null
}

export function CodeViewer({ file }: CodeViewerProps) {
  const lines = useMemo(
    () => (file ? file.content.split('\n') : []),
    [file]
  )

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <p className="text-sm mb-2">Select a file to view its contents</p>
          <p className="text-xs">Click on a file in the explorer</p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="h-full flex flex-col bg-background">
        {/* File Header */}
        <div className="sticky top-0 border-b border-border bg-card/50 backdrop-blur px-4 py-3 z-10">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getFileTypeIcon(file.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {file.path}
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              {lines.length} lines
            </div>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-hidden">
          <pre className="p-4 text-xs font-mono text-foreground">
            {lines.map((line, index) => (
              <div key={index} className="flex">
                <div className="mr-4 text-muted-foreground select-none sticky left-0 w-12 text-right pr-2">
                  {index + 1}
                </div>
                <code className="flex-1 break-words whitespace-pre-wrap">
                  {line}
                </code>
              </div>
            ))}
          </pre>
        </div>

        {/* File Footer */}
        <div className="border-t border-border bg-card/50 px-4 py-2 text-xs text-muted-foreground">
          <p>
            {getFileTypeDisplayName(file.type)} • {file.content.length} bytes
          </p>
        </div>
      </div>
    </ScrollArea>
  )
}
