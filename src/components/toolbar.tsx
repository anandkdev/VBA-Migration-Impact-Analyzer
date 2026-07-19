'use client'

import React from 'react'
import { Settings, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { Button } from '@/components/ui/button'

interface ToolbarProps {
  activeSection: string
}

const SECTION_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  explorer: 'Project Explorer',
  search: 'Search',
  analysis: 'Impact Analysis',
  graph: 'Dependency Graph',
  reports: 'Reports',
  settings: 'Settings',
}

export function Toolbar({ activeSection }: ToolbarProps) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="h-12 border-b border-border bg-card flex items-center justify-between px-4 gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded bg-primary text-primary-foreground font-bold text-sm">
          VBA
        </div>
        <h1 className="text-lg font-semibold tracking-tight">
          {SECTION_TITLES[activeSection] || 'VBA Migration Impact Analyzer'}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="gap-2"
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
          className="gap-2"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
