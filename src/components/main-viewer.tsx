'use client'

import React, { createContext, useState } from 'react'
import { VBAModule } from '@/types/index'
import { Dashboard } from '@/features/dashboard/dashboard'
import { ProjectExplorer } from '@/features/explorer/project-explorer'
import { SearchView } from '@/features/search/search-view'
import { ImpactAnalysis } from '@/features/analysis/impact-analysis'
import { DependencyGraph } from '@/features/graph/dependency-graph'
import { ReportsView } from '@/features/reports/reports-view'
import { SettingsView } from '@/features/settings/settings-view'
import { HelpView } from '@/features/help/help-view'
import { EmptyState } from '@/components/empty-state'

export const ViewerContext = createContext<{
  selectedModule: VBAModule | null
  setSelectedModule: (module: VBAModule | null) => void
}>({
  selectedModule: null,
  setSelectedModule: () => {},
})

interface MainViewerProps {
  activeSection: string
}

export function MainViewer({ activeSection }: MainViewerProps) {
  const [selectedModule, setSelectedModule] = useState<VBAModule | null>(null)

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />
      case 'explorer':
        return <ProjectExplorer />
      case 'search':
        return <SearchView />
      case 'analysis':
        return <ImpactAnalysis />
      case 'graph':
        return <DependencyGraph />
      case 'reports':
        return <ReportsView />
      case 'settings':
        return <SettingsView />
      case 'help':
        return <HelpView />
      default:
        return <EmptyState />
    }
  }

  return (
    <ViewerContext.Provider value={{ selectedModule, setSelectedModule }}>
      <div className="w-full h-full overflow-hidden flex flex-col">
        {renderContent()}
      </div>
    </ViewerContext.Provider>
  )
}
