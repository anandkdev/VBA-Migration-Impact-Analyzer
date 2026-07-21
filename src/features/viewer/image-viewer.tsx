'use client'

import React, { useState } from 'react'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { VBAFile } from '@/types/index'
import { Button } from '@/components/ui/button'

interface ImageViewerProps {
  file: VBAFile | null
}

export function ImageViewer({ file }: ImageViewerProps) {
  const [zoom, setZoom] = useState(100)

  if (!file || !file.blobUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-card text-muted-foreground">
        <p className="text-sm">Select an image file to view</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setZoom(Math.max(10, zoom - 10))}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-sm text-muted-foreground min-w-12">{zoom}%</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setZoom(Math.min(400, zoom + 10))}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <button
          onClick={() => setZoom(100)}
          className="px-2 py-1 text-sm rounded hover:bg-muted"
        >
          Reset
        </button>
      </div>

      {/* Image Container */}
      <div className="flex-1 flex items-center justify-center overflow-auto bg-muted/20">
        <img
          src={file.blobUrl}
          alt={file.name}
          style={{ width: `${zoom}%`, height: 'auto' }}
          className="object-contain"
        />
      </div>
    </div>
  )
}
