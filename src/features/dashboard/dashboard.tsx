'use client'

import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DashboardCard } from '@/features/dashboard/dashboard-card'
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

const STAT_CARDS: Array<{
  label: string
  value: string
  icon: typeof FileCode2
}> = [
  { label: 'Total Files', value: '0', icon: FileCode2 },
  { label: 'Modules', value: '0', icon: Boxes },
  { label: 'Classes', value: '0', icon: SquareCode },
  { label: 'UserForms', value: '0', icon: FileText },
  { label: 'Worksheets', value: '0', icon: Sheet },
  { label: 'Procedures', value: '0', icon: Zap },
  { label: 'Variables', value: '0', icon: Package },
  { label: 'Queries', value: '0', icon: Database },
  { label: 'Named Ranges', value: '0', icon: Grid3x3 },
  { label: 'Total References', value: '0', icon: Grid3x3 },
]

const IMPACT_CARDS: Array<{
  label: string
  value: string
  icon: typeof AlertTriangle
  variant: 'destructive' | 'warning' | 'success'
}> = [
  { label: 'High Impact', value: '0', icon: AlertTriangle, variant: 'destructive' },
  { label: 'Medium Impact', value: '0', icon: AlertCircle, variant: 'warning' },
  { label: 'Low Impact', value: '0', icon: CheckCircle2, variant: 'success' },
]

export function Dashboard() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Project Summary</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {STAT_CARDS.map((card) => (
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
