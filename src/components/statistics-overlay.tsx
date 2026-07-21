'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useLayoutStore } from '@/store/layout-store'
import { Dashboard } from '@/features/dashboard/dashboard'

export function StatisticsOverlay() {
  const { statisticsOpen, setStatisticsOpen } = useLayoutStore()

  return (
    <Dialog open={statisticsOpen} onOpenChange={setStatisticsOpen}>
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
