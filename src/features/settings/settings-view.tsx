'use client'

import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

export function SettingsView() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <p className="text-muted-foreground">
          Settings will be available here
        </p>
      </div>
    </ScrollArea>
  )
}
