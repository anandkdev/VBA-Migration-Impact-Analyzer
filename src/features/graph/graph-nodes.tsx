'use client'

import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Zap, Boxes, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProcedureNodeData {
  label: string
  type: 'module' | 'procedure' | 'external'
  moduleName?: string
  procedureName?: string
  scope?: string
  variables?: number
  calls?: number
}

export function ProcedureNode(
  props: NodeProps<ProcedureNodeData>
) {
  const { data, selected } = props
  const isPrivate = data.scope === 'Private'

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg border-2 bg-card cursor-pointer transition-all',
        'hover:shadow-lg hover:border-primary',
        selected
          ? 'border-primary shadow-lg bg-primary/5'
          : 'border-border'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-4 h-4 text-blue-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{data.label}</p>
          {data.moduleName && (
            <p className="text-xs text-muted-foreground truncate">
              {data.moduleName}
            </p>
          )}
        </div>
        {isPrivate && (
          <Lock className="w-3 h-3 text-yellow-500 flex-shrink-0" />
        )}
      </div>

      {/* Stats */}
      {data.variables !== undefined && (
        <div className="text-xs text-muted-foreground space-y-0.5">
          <p>Vars: {data.variables} | Calls: {data.calls || 0}</p>
        </div>
      )}

      {/* Handles */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

interface ModuleNodeData {
  label: string
  type: 'module' | 'procedure' | 'external'
  variables?: number
}

export function ModuleNode(props: NodeProps<ModuleNodeData>) {
  const { data, selected } = props
  return (
    <div
      className={cn(
        'px-4 py-2 rounded-lg border-2 bg-card cursor-pointer transition-all',
        'hover:shadow-lg hover:border-primary',
        selected
          ? 'border-primary shadow-lg bg-primary/5'
          : 'border-border'
      )}
    >
      <div className="flex items-center gap-2">
        <Boxes className="w-4 h-4 text-indigo-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{data.label}</p>
          {data.variables !== undefined && (
            <p className="text-xs text-muted-foreground">
              {data.variables} vars
            </p>
          )}
        </div>
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export const nodeTypes = {
  procedure: ProcedureNode,
  module: ModuleNode,
}
