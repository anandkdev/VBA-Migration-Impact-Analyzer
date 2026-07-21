'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useLayoutStore } from '@/store/layout-store'
import { HelpView } from '@/features/help/help-view'

export function HelpOverlay() {
  const { helpOpen, setHelpOpen } = useLayoutStore()

  return (
    <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Help</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto max-h-[calc(80vh-120px)]">
          <HelpView />
        </div>
      </DialogContent>
    </Dialog>
  )
}
