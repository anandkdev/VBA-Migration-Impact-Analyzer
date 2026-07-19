'use client'

import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

export function ProjectExplorer() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Project Explorer</h2>
        <p className="text-muted-foreground">
          Import a project to see its structure here
        </p>
      </div>
    </ScrollArea>
  )
}
