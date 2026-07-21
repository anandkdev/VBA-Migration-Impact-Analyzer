'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useLayoutStore } from '@/store/layout-store'
import { SettingsView } from '@/features/settings/settings-view'

export function SettingsOverlay() {
  const { settingsOpen, setSettingsOpen } = useLayoutStore()

  return (
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto max-h-[calc(80vh-120px)]">
          <SettingsView />
        </div>
      </DialogContent>
    </Dialog>
  )
}
