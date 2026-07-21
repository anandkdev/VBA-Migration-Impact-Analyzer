'use client'

import React from 'react'
import { VBAFile } from '@/types/index'

interface PDFViewerProps {
  file: VBAFile | null
}

export function PDFViewer({ file }: PDFViewerProps) {
  if (!file || !file.blobUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-card text-muted-foreground">
        <p className="text-sm">Select a PDF file to view</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col bg-background">
      <iframe
        src={`${file.blobUrl}#toolbar=1&navpanes=0&scrollbar=1`}
        className="w-full h-full border-0"
        title={file.name}
      />
    </div>
  )
}
