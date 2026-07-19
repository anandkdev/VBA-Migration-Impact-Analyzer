'use client'

import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

export function DependencyGraph() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Dependency Graph</h2>
        <p className="text-muted-foreground">
          Dependency graph visualization will be available here
        </p>
      </div>
    </ScrollArea>
  )
}
