'use client'

import React from 'react'
import { Search, Settings2, BarChart3, Moon, Sun, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'
import { useModeStore } from '@/store/mode-store'
import { ImportDialog } from '@/features/import/import-dialog'
import { FiltersPopover } from '@/features/filters/filters-popover'

interface ToolbarProps {
  onSettingsOpen?: () => void
  onStatisticsOpen?: () => void
}

export function Toolbar({ onSettingsOpen, onStatisticsOpen }: ToolbarProps) {
  const { isDark, toggleTheme } = useTheme()
  const { currentMode, setMode } = useModeStore()

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
          variant={currentMode === 'explorer' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('explorer')}
          className="gap-2"
          title="Explorer Mode (browse and analyze)"
        >
          <Menu className="w-4 h-4" />
          Explorer
        </Button>

        <Button
          variant={currentMode === 'search' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('search')}
          className="gap-2"
          title="Search Mode (search and export)"
        >
          <Search className="w-4 h-4" />
          Search
        </Button>

        <FiltersPopover />

        <Button
          variant="outline"
          size="sm"
          onClick={onStatisticsOpen}
          className="gap-2"
          title="Project Statistics"
        >
          <BarChart3 className="w-4 h-4" />
          Statistics
        </Button>
      </div>

      {/* Right: Theme, Settings, Sidebar Toggle */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-9 h-9 p-0"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onSettingsOpen}
          className="w-9 h-9 p-0"
          title="Settings"
        >
          <Settings2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
