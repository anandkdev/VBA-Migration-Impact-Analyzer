'use client'

import React, { useEffect, useState } from 'react'

interface CodeViewerProps {
  filePath: string
  fileId: string
}

export function CodeViewer({ filePath }: CodeViewerProps) {
  const [code] = useState<string>('')
  const [lineCount, setLineCount] = useState<number>(0)

  useEffect(() => {
    // In a real implementation, fetch the file content
    // For now, show placeholder
    const lines = code.split('\n').length
    setLineCount(lines)
  }, [code])

  return (
    <div className="h-full flex flex-col bg-background">
      {/* File Header */}
      <div className="border-b border-border bg-card/50 px-4 py-2 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{filePath}</p>
          <p className="text-xs text-muted-foreground">{lineCount} lines</p>
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        <div className="space-y-2 text-muted-foreground">
          <p>Code viewer would display syntax-highlighted content here</p>
          <p>Monaco Editor integration coming in Phase 2</p>
        </div>
      </div>
    </div>
  )
}
