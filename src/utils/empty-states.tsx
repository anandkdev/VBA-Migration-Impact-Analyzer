import React from 'react'
import { FileX, BarChart3, Search, Network, Inbox } from 'lucide-react'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      {Icon && <div className="mb-4 text-muted-foreground">{Icon}</div>}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export const EmptyStates = {
  noProject: {
    icon: <FileX className="w-12 h-12" />,
    title: 'No Project Imported',
    description: 'Import a VBA project folder to get started analyzing code.',
  },
  noResults: {
    icon: <Search className="w-12 h-12" />,
    title: 'No Results Found',
    description: 'Try adjusting your search criteria or filters.',
  },
  noAnalysis: {
    icon: <BarChart3 className="w-12 h-12" />,
    title: 'No Analysis Results',
    description: 'Run an impact analysis to see results.',
  },
  noDependencies: {
    icon: <Network className="w-12 h-12" />,
    title: 'No Dependencies Found',
    description: 'No procedure calls detected in this project.',
  },
  noData: {
    icon: <Inbox className="w-12 h-12" />,
    title: 'No Data Available',
    description: 'Start by importing a project or running an analysis.',
  },
}
