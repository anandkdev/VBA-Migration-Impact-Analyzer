'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Dashboard } from '@/features/dashboard/dashboard'

interface StatisticsOverlayProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StatisticsOverlay({ open, onOpenChange }: StatisticsOverlayProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Project Statistics</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto max-h-[calc(80vh-120px)]">
          <Dashboard />
        </div>
      </DialogContent>
    </Dialog>
  )
}
