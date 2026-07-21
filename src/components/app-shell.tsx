'use client'

import React, { useState } from 'react'
import { useModeStore } from '@/store/mode-store'
import { Toolbar } from '@/components/toolbar'
import { ExplorerMode } from '@/components/modes/explorer-mode'
import { SearchMode } from '@/components/modes/search-mode'
import { StatisticsOverlay } from '@/components/statistics-overlay'
import { SettingsOverlay } from '@/components/settings-overlay'

export function AppShell() {
  const currentMode = useModeStore((state) => state.currentMode)
  const [statisticsOpen, setStatisticsOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Top Toolbar */}
      <Toolbar
        onStatisticsOpen={() => setStatisticsOpen(true)}
        onSettingsOpen={() => setSettingsOpen(true)}
      />

      {/* Main Workspace: Mode-based content */}
      {currentMode === 'explorer' && <ExplorerMode />}
      {currentMode === 'search' && <SearchMode />}

      {/* Overlays */}
      {statisticsOpen && (
        <StatisticsOverlay open={statisticsOpen} onOpenChange={setStatisticsOpen} />
      )}
      {settingsOpen && (
        <SettingsOverlay open={settingsOpen} onOpenChange={setSettingsOpen} />
      )}
    </div>
  )
}
