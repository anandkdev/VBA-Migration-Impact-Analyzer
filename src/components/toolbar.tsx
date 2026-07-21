'use client'

import React from 'react'
import {
  Search,
  Settings2,
  BarChart3,
  FileText,
  Moon,
  Sun,
  HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'
import { useLayoutStore } from '@/store/layout-store'
import { FiltersPopover } from '@/features/filters/filters-popover'
import { ImportDialog } from '@/features/import/import-dialog'

export function Toolbar() {
  const { isDark, toggleTheme } = useTheme()
  const {
    setActiveBottomTab,
    setBottomPanelOpen,
    setStatisticsOpen,
    setSettingsOpen,
    setHelpOpen,
  } = useLayoutStore()

  return (
    <div className="h-12 border-b border-border bg-card flex items-center justify-between px-4 gap-3">
      {/* Left: Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded bg-primary text-primary-foreground font-bold text-sm">
          VBA
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold leading-none">VBA Project Studio</h1>
          <p className="text-xs text-muted-foreground">Analyze • Understand • Migrate • Refactor</p>
        </div>
      </div>

      {/* Center: Action Buttons */}
      <div className="flex items-center gap-1">
        <ImportDialog />

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setActiveBottomTab('search')
            setBottomPanelOpen(true)
          }}
          className="gap-2"
          title="Open Search (Ctrl+F)"
        >
          <Search className="w-4 h-4" />
          Search
        </Button>

        <FiltersPopover />

        <Button
          variant="outline"
          size="sm"
          onClick={() => setStatisticsOpen(true)}
          className="gap-2"
          title="Project Statistics"
        >
          <BarChart3 className="w-4 h-4" />
          Statistics
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setActiveBottomTab('reports')
            setBottomPanelOpen(true)
          }}
          className="gap-2"
          title="Open Reports"
        >
          <FileText className="w-4 h-4" />
          Reports
        </Button>
      </div>

      {/* Right: Theme, Settings, Help */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-9 h-9 p-0"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSettingsOpen(true)}
          className="w-9 h-9 p-0"
          title="Settings"
        >
          <Settings2 className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setHelpOpen(true)}
          className="w-9 h-9 p-0"
          title="Help"
        >
          <HelpCircle className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
