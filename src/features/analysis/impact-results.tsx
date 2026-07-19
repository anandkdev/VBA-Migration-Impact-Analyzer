'use client'

import React from 'react'
import { ImpactResult, getImpactStats } from '@/features/analysis/impact-service'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImpactResultsProps {
  results: ImpactResult[]
  isLoading?: boolean
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case 'High':
      return <AlertTriangle className="w-5 h-5 text-red-500" />
    case 'Medium':
      return <AlertCircle className="w-5 h-5 text-yellow-500" />
    case 'Low':
      return <CheckCircle2 className="w-5 h-5 text-green-500" />
    default:
      return <AlertCircle className="w-5 h-5" />
  }
}


function getSeverityBadgeColor(severity: string): string {
  switch (severity) {
    case 'High':
      return 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50'
    case 'Medium':
      return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/50'
    case 'Low':
      return 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50'
    default:
      return 'bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/50'
  }
}

export function ImpactResults({ results, isLoading }: ImpactResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p className="text-sm">Analyzing impact...</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <p className="text-sm mb-1">No impact found</p>
          <p className="text-xs">Enter a field name to analyze impact</p>
        </div>
      </div>
    )
  }

  const stats = getImpactStats(results)

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* Statistics */}
        <div className="grid grid-cols-4 gap-2">
          <div className="p-3 rounded border border-border bg-card">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className={cn(
            'p-3 rounded border',
            stats.high > 0 ? 'bg-red-500/10 border-red-500/50' : 'bg-card border-border'
          )}>
            <p className="text-xs text-muted-foreground">High</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.high}
            </p>
          </div>
          <div className={cn(
            'p-3 rounded border',
            stats.medium > 0 ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-card border-border'
          )}>
            <p className="text-xs text-muted-foreground">Medium</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.medium}
            </p>
          </div>
          <div className={cn(
            'p-3 rounded border',
            stats.low > 0 ? 'bg-green-500/10 border-green-500/50' : 'bg-card border-border'
          )}>
            <p className="text-xs text-muted-foreground">Low</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.low}
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {results.map((result) => (
            <div
              key={result.id}
              className="p-4 rounded border border-border bg-card hover:bg-accent/50 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                {getSeverityIcon(result.severity)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm truncate">
                      {result.itemName}
                    </p>
                    <span className={cn(
                      'inline-block px-2 py-0.5 rounded text-xs font-medium border',
                      getSeverityBadgeColor(result.severity)
                    )}>
                      {result.severity}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {result.matchType} • {result.itemType}
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div className="mb-3 pl-9">
                <p className="text-xs font-semibold text-muted-foreground mb-1">
                  Reason:
                </p>
                <p className="text-sm">{result.reason}</p>
              </div>

              {/* Recommendation */}
              <div className="mb-3 pl-9">
                <p className="text-xs font-semibold text-muted-foreground mb-1">
                  Recommendation:
                </p>
                <p className="text-sm">{result.recommendation}</p>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-3 pl-9 text-xs">
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-mono">
                    {result.fileName}
                    {result.moduleName && ` • ${result.moduleName}`}
                    {result.procedureName && ` • ${result.procedureName}`}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Line</p>
                  <p className="font-mono">{result.lineNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Business Area</p>
                  <p>{result.businessArea}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Technical Area</p>
                  <p>{result.technicalArea}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
