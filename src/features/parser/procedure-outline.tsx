'use client'

import React from 'react'
import { VBAModule, Procedure } from '@/types/index'
import { Zap, Square, Gift, GitBranch } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ProcedureOutlineProps {
  module: VBAModule | null
  onSelectProcedure?: (procedure: Procedure) => void
  selectedProcedureName?: string
}

function getProcedureIcon(type: string) {
  switch (type) {
    case 'Function':
      return <Zap className="w-4 h-4 text-blue-500" />
    case 'Sub':
      return <Square className="w-4 h-4 text-green-500" />
    case 'PropertyGet':
      return <Gift className="w-4 h-4 text-purple-500" />
    case 'PropertySet':
    case 'PropertyLet':
      return <GitBranch className="w-4 h-4 text-orange-500" />
    default:
      return <Square className="w-4 h-4 text-gray-500" />
  }
}

export function ProcedureOutline({
  module,
  onSelectProcedure,
  selectedProcedureName,
}: ProcedureOutlineProps) {
  if (!module || module.procedures.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        <p>No procedures found</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-1">
        {module.procedures.map((proc) => (
          <button
            key={proc.id}
            onClick={() => onSelectProcedure?.(proc)}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm hover:bg-accent text-left',
              selectedProcedureName === proc.name &&
                'bg-accent text-accent-foreground'
            )}
            title={`Line ${proc.startLine}: ${proc.type} ${proc.name}`}
          >
            {getProcedureIcon(proc.type)}
            <span className="flex-1 truncate">{proc.name}</span>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {proc.startLine}
            </span>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}
