'use client'

import React, { useCallback, useState, useMemo } from 'react'
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Search, Maximize2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { nodeTypes } from '@/features/graph/graph-nodes'
import {
  buildDependencyGraph,
  filterGraphBySearch,
  getGraphStats,
  calculateLayout,
} from '@/features/graph/graph-service'

export function GraphVisualization() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showMinimap, setShowMinimap] = useState(true)

  // Build graph on mount
  React.useEffect(() => {
    const { nodes: initialNodes, edges: initialEdges } = buildDependencyGraph()

    if (initialNodes.length > 0) {
      const positionedNodes = calculateLayout(initialNodes, initialEdges)
      setNodes(positionedNodes)
      setEdges(initialEdges)
    }
  }, [setNodes, setEdges])

  // Apply search filter
  const filteredData = useMemo(() => {
    return filterGraphBySearch(nodes, edges, searchTerm)
  }, [nodes, edges, searchTerm])

  // Update graph when search changes
  React.useEffect(() => {
    setNodes(filteredData.nodes)
    setEdges(filteredData.edges)
  }, [filteredData, setNodes, setEdges])

  // Get statistics
  const stats = useMemo(() => {
    return getGraphStats(nodes, edges)
  }, [nodes, edges])

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, _node: any) => {
      // Handle node selection
    },
    []
  )

  const handleFitView = useCallback(() => {
    // Fit view will be handled by React Flow
  }, [])

  if (nodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">No dependency data</p>
          <p className="text-xs">Import a project to view the dependency graph</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="border-b border-border bg-card/50 p-3 space-y-2">
        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search procedures or modules..."
              className="w-full px-10 py-2 rounded border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleFitView}
            title="Fit to view"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>

          <Button
            variant={showMinimap ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setShowMinimap(!showMinimap)}
            title="Toggle minimap"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Procedures: {stats.procedures}</span>
          <span>Modules: {stats.modules}</span>
          <span>Calls: {stats.totalCalls}</span>
          {searchTerm && (
            <span className="text-primary">
              Filtered: {nodes.length} nodes, {edges.length} edges
            </span>
          )}
        </div>
      </div>

      {/* Graph */}
      <div className="flex-1 overflow-hidden relative">
        <ReactFlow
          nodes={nodes as any}
          edges={edges as any}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes as any}
          fitView
        >
          <Background color="#aaa" gap={16} />
          <Controls />
          {showMinimap && (
            <MiniMap
              style={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
              }}
            />
          )}
        </ReactFlow>
      </div>

      {/* Legend */}
      <div className="border-t border-border bg-card/50 px-4 py-2 text-xs text-muted-foreground space-y-1">
        <div className="flex items-center gap-2">
          <span>⚡ = Procedure</span>
          <span className="mx-2">•</span>
          <span>📦 = Module</span>
          <span className="mx-2">•</span>
          <span>🔒 = Private scope</span>
        </div>
      </div>
    </div>
  )
}
