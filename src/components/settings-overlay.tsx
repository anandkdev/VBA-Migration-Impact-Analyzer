'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SettingsView } from '@/features/settings/settings-view'

interface SettingsOverlayProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsOverlay({ open, onOpenChange }: SettingsOverlayProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
