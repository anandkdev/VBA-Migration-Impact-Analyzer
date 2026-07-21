'use client'

import React from 'react'
import {
  Search,
  Settings2,
  Zap,
  GitGraph,
  ArrowRightLeft,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLayoutStore } from '@/store/layout-store'
import { FileSearchView } from '@/features/search/file-search-view'
import { Inspector } from '@/components/inspector'
import { ImpactAnalysis } from '@/features/analysis/impact-analysis'
import { DependencyGraph } from '@/features/graph/dependency-graph'
import { MigrationView } from '@/features/migration/migration-view'
import { ReportsView } from '@/features/reports/reports-view'

const BOTTOM_TABS = [
  { id: 'search', label: 'Search', icon: Search },
  { id: 'inspector', label: 'Inspector', icon: Settings2 },
  { id: 'impact', label: 'Impact', icon: Zap },
  { id: 'dependencies', label: 'Dependencies', icon: GitGraph },
  { id: 'migration', label: 'Migration', icon: ArrowRightLeft },
  { id: 'reports', label: 'Reports', icon: FileText },
] as const

export function BottomPanel() {
  const { activeBottomTab, setActiveBottomTab, bottomPanelOpen, setBottomPanelOpen } =
    useLayoutStore()

  const renderTabContent = () => {
    switch (activeBottomTab) {
      case 'search':
        return <FileSearchView />
      case 'inspector':
        return <Inspector />
      case 'impact':
        return <ImpactAnalysis />
      case 'dependencies':
        return <DependencyGraph />
      case 'migration':
        return <MigrationView />
      case 'reports':
        return <ReportsView />
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col bg-background border-t border-border">
      {/* Tab Strip */}
      <div className="flex items-center gap-1 px-2 py-2 bg-card/50 border-b border-border">
        {BOTTOM_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeBottomTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveBottomTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Collapse/Expand Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setBottomPanelOpen(!bottomPanelOpen)}
          className="h-6 w-6 p-0"
          title={bottomPanelOpen ? 'Collapse' : 'Expand'}
        >
          {bottomPanelOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Tab Content */}
      {bottomPanelOpen && <div className="flex-1 overflow-hidden">{renderTabContent()}</div>}
    </div>
  )
}
