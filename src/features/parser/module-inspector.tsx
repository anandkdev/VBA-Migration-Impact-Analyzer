'use client'

import React from 'react'
import { VBAModule, Procedure } from '@/types/index'
import { Zap, Package, Grid3x3, Layers2, Code2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ModuleInspectorProps {
  module: VBAModule | null
  selectedProcedure?: Procedure | null
}

export function ModuleInspector({
  module,
  selectedProcedure,
}: ModuleInspectorProps) {
  if (!module) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        <p>Select a module to view details</p>
      </div>
    )
  }

  if (selectedProcedure) {
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {/* Procedure Header */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Procedure</h4>
            <div className="p-3 bg-muted rounded space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-mono text-sm">{selectedProcedure.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-sm">{selectedProcedure.type}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Scope</p>
                <p className="text-sm">{selectedProcedure.scope}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm">
                  Lines {selectedProcedure.startLine}-{selectedProcedure.endLine}
                </p>
              </div>
            </div>
          </div>

          {/* Procedure Variables */}
          {selectedProcedure.variables && selectedProcedure.variables.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Variables ({selectedProcedure.variables.length})
              </h4>
              <div className="space-y-1">
                {selectedProcedure.variables.map((v) => (
                  <div
                    key={v.id}
                    className="p-2 bg-muted rounded text-xs font-mono"
                  >
                    <p>
                      <span className="text-blue-500">{v.name}</span>
                      <span className="text-muted-foreground"> As {v.type}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Procedure Calls */}
          {selectedProcedure.calls && selectedProcedure.calls.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                External Calls ({selectedProcedure.calls.length})
              </h4>
              <div className="space-y-1">
                {selectedProcedure.calls.map((call, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-muted rounded text-xs font-mono truncate"
                    title={call}
                  >
                    {call}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* Module Header */}
        <div>
          <h4 className="font-semibold text-sm mb-2">Module Info</h4>
          <div className="p-3 bg-muted rounded space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="font-mono text-sm">{module.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Type</p>
              <p className="text-sm">{module.type}</p>
            </div>
          </div>
        </div>

        {/* Module Statistics */}
        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            Statistics
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-muted rounded">
              <p className="text-xs text-muted-foreground">Procedures</p>
              <p className="text-lg font-bold">{module.procedures.length}</p>
            </div>
            <div className="p-2 bg-muted rounded">
              <p className="text-xs text-muted-foreground">Variables</p>
              <p className="text-lg font-bold">{module.variables.length}</p>
            </div>
            <div className="p-2 bg-muted rounded">
              <p className="text-xs text-muted-foreground">Constants</p>
              <p className="text-lg font-bold">{module.constants.length}</p>
            </div>
            <div className="p-2 bg-muted rounded">
              <p className="text-xs text-muted-foreground">Types</p>
              <p className="text-lg font-bold">{module.types.length}</p>
            </div>
          </div>
        </div>

        {/* Module Variables */}
        {module.variables.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Module Variables
            </h4>
            <div className="space-y-1">
              {module.variables.map((v) => (
                <div
                  key={v.id}
                  className="p-2 bg-muted rounded text-xs font-mono truncate"
                  title={`${v.name} As ${v.type}`}
                >
                  <span className="text-blue-500">{v.name}</span>
                  <span className="text-muted-foreground"> As {v.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Constants */}
        {module.constants.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Grid3x3 className="w-4 h-4" />
              Constants
            </h4>
            <div className="space-y-1">
              {module.constants.map((c, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-muted rounded text-xs font-mono truncate"
                  title={c}
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enums */}
        {module.enums.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Layers2 className="w-4 h-4" />
              Enums
            </h4>
            <div className="space-y-1">
              {module.enums.map((e, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-muted rounded text-xs font-mono"
                >
                  {e}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
