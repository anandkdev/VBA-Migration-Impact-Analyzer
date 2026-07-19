'use client'

import React from 'react'
import { Dashboard } from '@/features/dashboard/dashboard'
import { ProjectExplorer } from '@/features/explorer/project-explorer'
import { SearchView } from '@/features/search/search-view'
import { ImpactAnalysis } from '@/features/analysis/impact-analysis'
import { DependencyGraph } from '@/features/graph/dependency-graph'
import { ReportsView } from '@/features/reports/reports-view'
import { SettingsView } from '@/features/settings/settings-view'
import { EmptyState } from '@/components/empty-state'

interface MainViewerProps {
  activeSection: string
}

export function MainViewer({ activeSection }: MainViewerProps) {
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
      default:
        return <EmptyState />
    }
  }

  return (
    <div className="w-full h-full overflow-hidden flex flex-col">
      {renderContent()}
    </div>
  )
}
