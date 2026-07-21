'use client'

import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DashboardCard } from '@/features/dashboard/dashboard-card'
import { useProjectStore } from '@/store/project-store'
import {
  FileCode2,
  Boxes,
  SquareCode,
  FileText,
  Sheet,
  Zap,
  Package,
  Database,
  Grid3x3,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Search,
} from 'lucide-react'

export function Dashboard() {
  const { files, projectName, stats: projectStats } = useProjectStore()

  const stats = projectStats || {
    totalModules: 0,
    largestModule: null,
    largestProcedure: null,
    unusedVariables: [],
    duplicateProcedures: [],
    workbookEvents: 0,
    worksheetEvents: 0,
    sqlReferences: 0,
    totalFiles: 0,
    totalProcedures: 0,
    totalVariables: 0,
    totalConstants: 0,
    totalEnums: 0,
    totalTypes: 0,
  }

  const statCards: Array<{
    label: string
    value: string | number
    icon: typeof FileCode2
  }> = [
    { label: 'Total Files', value: stats.totalFiles || files.length, icon: FileCode2 },
    { label: 'Modules', value: stats.totalModules, icon: Boxes },
    { label: 'Procedures', value: stats.totalProcedures, icon: Zap },
    { label: 'Variables', value: stats.totalVariables, icon: Package },
    { label: 'Constants', value: stats.totalConstants, icon: SquareCode },
    { label: 'Enums', value: stats.totalEnums, icon: Grid3x3 },
    { label: 'Types', value: stats.totalTypes, icon: FileText },
    { label: 'SQL Queries', value: stats.sqlReferences, icon: Database },
    { label: 'Workbook Events', value: stats.workbookEvents, icon: Sheet },
    { label: 'Worksheet Events', value: stats.worksheetEvents, icon: Grid3x3 },
  ]

  const IMPACT_CARDS: Array<{
    label: string
    value: string
    icon: typeof AlertTriangle
    variant: 'destructive' | 'warning' | 'success'
  }> = [
    { label: 'Unused Variables', value: stats.unusedVariables.length.toString(), icon: AlertTriangle, variant: 'warning' },
    { label: 'Duplicate Procedures', value: stats.duplicateProcedures.length.toString(), icon: AlertCircle, variant: 'warning' },
    { label: 'Largest Procedure', value: stats.largestProcedure?.lines.toString() || '0', icon: CheckCircle2, variant: 'success' },
  ]
  return (
    <ScrollArea className="h-full w-full">
      <div className="p-6 space-y-6">
        {/* Project Header */}
        <div>
          {projectName && (
            <div className="mb-6 pb-4 border-b border-border">
              <h2 className="text-2xl font-bold">{projectName}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {files.length} file{files.length !== 1 ? 's' : ''} imported
              </p>
            </div>
          )}

          <h3 className="text-lg font-semibold mb-4">Project Summary</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {statCards.map((card) => (
              <DashboardCard key={card.label} {...card} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Impact Assessment</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {IMPACT_CARDS.map((card) => (
              <DashboardCard key={card.label} {...card} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-border">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Recent Search
            </h3>
            <p className="text-sm text-muted-foreground">No recent searches</p>
          </div>

          <div className="p-4 rounded-lg border border-border">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Import a VBA project</li>
              <li>• Analyze impact of field migrations</li>
              <li>• View dependency graph</li>
            </ul>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
