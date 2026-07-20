'use client'

import React, { useMemo, useState } from 'react'
import { X, GitGraph } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useProjectStore } from '@/store/project-store'
import { cn } from '@/lib/utils'

interface FileDependencyPanelProps {
  fileName: string | null
  onClose: () => void
}

export function FileDependencyPanel({ fileName, onClose }: FileDependencyPanelProps) {
  const { modules } = useProjectStore()

  // Find which module this file belongs to and its dependencies
  const dependencies = useMemo(() => {
    if (!fileName) return { dependsOn: [], dependedBy: [] }

    // Find the module by file name
    const module = modules.find((m) =>
      m.name.toLowerCase() === fileName.replace('.bas', '').toLowerCase() ||
      m.name.toLowerCase() === fileName.toLowerCase()
    )

    if (!module) return { dependsOn: [], dependedBy: [] }

    const dependsOn: { type: string; name: string; procedures: string[] }[] = []
    const dependedBy: { type: string; name: string; procedures: string[] }[] = []

    // Find modules that this module depends on (calls)
    const calledModules = new Set<string>()
    module.procedures.forEach((proc) => {
      proc.calls.forEach((call) => {
        // Extract module name from call pattern (e.g., "ModuleName.ProcedureName")
        const parts = call.split('.')
        if (parts.length >= 2) {
          const moduleName = parts[0].trim()
          calledModules.add(moduleName)
        }
      })
    })

    // Add dependencies with their procedures
    calledModules.forEach((depName) => {
      const depModule = modules.find((m) => m.name === depName)
      if (depModule) {
        const procedures: string[] = []
        module.procedures.forEach((proc) => {
          proc.calls.forEach((call) => {
            if (call.includes(`${depName}.`)) {
              const procName = call.split('.')[1]?.split('(')[0]?.trim()
              if (procName && !procedures.includes(procName)) {
                procedures.push(procName)
              }
            }
          })
        })
        dependsOn.push({
          type: 'module',
          name: depName,
          procedures,
        })
      }
    })

    // Find modules that depend on this module (are called by)
    modules.forEach((otherModule) => {
      if (otherModule.id === module.id) return

      const callsProcedures: string[] = []
      otherModule.procedures.forEach((proc) => {
        proc.calls.forEach((call) => {
          if (call.includes(`${module.name}.`)) {
            const procName = call.split('.')[1]?.split('(')[0]?.trim()
            if (procName && !callsProcedures.includes(procName)) {
              callsProcedures.push(procName)
            }
          }
        })
      })

      if (callsProcedures.length > 0) {
        dependedBy.push({
          type: 'module',
          name: otherModule.name,
          procedures: callsProcedures,
        })
      }
    })

    return { dependsOn, dependedBy }
  }, [fileName, modules])

  if (!fileName) {
    return (
      <div className="flex flex-col h-full bg-background border-l border-border">
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <GitGraph className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Click the dependency graph icon</p>
            <p className="text-xs">to view file dependencies</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background border-l border-border">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <GitGraph className="w-4 h-4 text-primary flex-shrink-0" />
            <h3 className="text-sm font-semibold truncate">Dependencies</h3>
          </div>
          <p className="text-xs text-muted-foreground truncate">{fileName}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Depends On */}
          <div>
            <h4 className="text-xs font-semibold text-primary mb-3 uppercase tracking-wide">
              Files this depends on ({dependencies.dependsOn.length})
            </h4>
            {dependencies.dependsOn.length === 0 ? (
              <p className="text-xs text-muted-foreground">No dependencies</p>
            ) : (
              <div className="space-y-2">
                {dependencies.dependsOn.map((dep) => (
                  <div key={dep.name} className="p-2 rounded border border-border bg-card/50 text-xs">
                    <p className="font-medium text-foreground mb-1">{dep.name}</p>
                    {dep.procedures.length > 0 && (
                      <div className="space-y-1">
                        {dep.procedures.map((proc) => (
                          <div key={proc} className="text-muted-foreground pl-2 border-l border-muted-foreground/30">
                            ⚡ {proc}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Depended By */}
          <div>
            <h4 className="text-xs font-semibold text-primary mb-3 uppercase tracking-wide">
              Files that depend on this ({dependencies.dependedBy.length})
            </h4>
            {dependencies.dependedBy.length === 0 ? (
              <p className="text-xs text-muted-foreground">No dependents</p>
            ) : (
              <div className="space-y-2">
                {dependencies.dependedBy.map((dep) => (
                  <div key={dep.name} className="p-2 rounded border border-border bg-card/50 text-xs">
                    <p className="font-medium text-foreground mb-1">{dep.name}</p>
                    {dep.procedures.length > 0 && (
                      <div className="space-y-1">
                        {dep.procedures.map((proc) => (
                          <div key={proc} className="text-muted-foreground pl-2 border-l border-muted-foreground/30">
                            ⚡ {proc}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Impact Information */}
          {(dependencies.dependsOn.length > 0 || dependencies.dependedBy.length > 0) && (
            <div className="border-t border-border pt-4">
              <h4 className="text-xs font-semibold text-warning mb-2 uppercase tracking-wide">
                ⚠️ Impact Analysis
              </h4>
              <div className="text-xs text-muted-foreground space-y-1">
                {dependencies.dependedBy.length > 0 && (
                  <p>
                    • Changing this file affects{' '}
                    <span className="font-semibold text-foreground">
                      {dependencies.dependedBy.length}
                    </span>{' '}
                    other file(s)
                  </p>
                )}
                {dependencies.dependsOn.length > 0 && (
                  <p>
                    • This file depends on{' '}
                    <span className="font-semibold text-foreground">
                      {dependencies.dependsOn.length}
                    </span>{' '}
                    other file(s)
                  </p>
                )}
                {dependencies.dependedBy.length > 0 && (
                  <p className="mt-2 pt-2 border-t border-border">
                    Files to update when modifying this:{' '}
                    <span className="font-semibold text-foreground">
                      {dependencies.dependedBy.map((d) => d.name).join(', ')}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
