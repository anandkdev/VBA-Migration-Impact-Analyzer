'use client'

import React from 'react'

interface ImageViewerProps {
  fileId: string
}

export function ImageViewer({}: ImageViewerProps) {
  return (
    <div className="h-full flex items-center justify-center bg-muted/50">
      <div className="text-center">
        <div className="text-4xl mb-2">🖼️</div>
        <p className="text-sm text-muted-foreground">Image viewer coming soon</p>
      </div>
    </div>
  )
}
