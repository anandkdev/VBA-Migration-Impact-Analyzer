'use client'

import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

export function ReportsView() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Reports</h2>
        <p className="text-muted-foreground">
          Reports will be available here
        </p>
      </div>
    </ScrollArea>
  )
}
