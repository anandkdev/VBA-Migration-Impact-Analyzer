'use client'

import React, { useContext } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ViewerContext } from '@/components/main-viewer'
import { ModuleInspector } from '@/features/parser/module-inspector'

interface InspectorProps {
  activeSection: string
}

export function Inspector({ activeSection }: InspectorProps) {
  const { selectedModule } = useContext(ViewerContext)

  // Show module inspector for explorer section
  if (activeSection === 'explorer' && selectedModule) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="px-4 py-3 border-b border-border bg-card/50">
          <h3 className="text-sm font-semibold">Details</h3>
        </div>
        <div className="flex-1 overflow-hidden">
          <ModuleInspector module={selectedModule} selectedProcedure={null} />
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
            Select an item to view its properties
          </p>
        </div>
      </ScrollArea>
    </div>
  )
}
