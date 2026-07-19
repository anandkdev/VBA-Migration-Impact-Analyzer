'use client'

import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface InspectorProps {
  activeSection: string
}

export function Inspector({}: InspectorProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold">Properties</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <p className="text-xs text-muted-foreground">
            Select an item to view its properties
          </p>
        </div>
      </ScrollArea>
    </div>
  )
}
