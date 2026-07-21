'use client'

import React from 'react'

interface TableViewerProps {
  fileId: string
}

export function TableViewer({}: TableViewerProps) {
  return (
    <div className="h-full flex flex-col bg-background p-4">
      <h3 className="text-sm font-semibold mb-4">Table Preview</h3>
      <div className="text-xs text-muted-foreground">
        CSV table viewer coming soon
      </div>
    </div>
  )
}
