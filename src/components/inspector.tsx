'use client'

import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useProjectStore } from '@/store/project-store'
import { ModuleInspector } from '@/features/parser/module-inspector'

interface InspectorProps {
  _activeSection?: string
}

export function Inspector({}: InspectorProps) {
  const { selectedModule, selectedProcedure } = useProjectStore()

  if (selectedModule) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="px-4 py-3 border-b border-border bg-card/50">
          <h3 className="text-sm font-semibold">Details</h3>
        </div>
        <div className="flex-1 overflow-hidden">
          <ModuleInspector module={selectedModule} selectedProcedure={selectedProcedure} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-4 py-3 border-b border-border bg-card/50">
        <h3 className="text-sm font-semibold">Properties</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <p className="text-xs text-muted-foreground">
            Select a file in the explorer to view its properties
          </p>
        </div>
      </ScrollArea>
    </div>
  )
}
