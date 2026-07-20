import { useProjectStore } from '@/store/project-store'
import { VBAModule, Procedure } from '@/types/index'

export interface DependencyNode {
  id: string
  data: {
    label: string
    type: 'module' | 'procedure' | 'external'
    moduleName?: string
    procedureName?: string
    scope?: string
    variables?: number
    calls?: number
  }
  position: { x: number; y: number }
  parentNode?: string
}

export interface DependencyEdge {
  id: string
  source: string
  target: string
  data?: {
    callType?: string
    count?: number
  }
  animated?: boolean
}


/**
 * Build dependency graph from project
 */
export function buildDependencyGraph(): {
  nodes: DependencyNode[]
  edges: DependencyEdge[]
} {
  const { modules } = useProjectStore.getState()
  const nodes: DependencyNode[] = []
  const edges: DependencyEdge[] = []
  const procedureMap = new Map<string, { module: VBAModule; procedure: Procedure }>()

  // First pass: Create nodes and build procedure map
  modules.forEach((module) => {
    // Add module node
    nodes.push({
      id: module.id,
      data: {
        label: module.name,
        type: 'module',
        variables: module.variables.length,
      },
      position: { x: 0, y: 0 },
    })

    // Add procedure nodes
    module.procedures.forEach((procedure) => {
      const nodeId = `${module.id}_${procedure.id}`
      procedureMap.set(procedure.name.toLowerCase(), {
        module,
        procedure,
      })

      nodes.push({
        id: nodeId,
        data: {
          label: procedure.name,
          type: 'procedure',
          moduleName: module.name,
          procedureName: procedure.name,
          scope: procedure.scope,
          variables: procedure.variables.length,
          calls: procedure.calls.length,
        },
        position: { x: 0, y: 0 },
        parentNode: module.id,
      })
    })
  })

  // Second pass: Create edges based on calls
  const edgeMap = new Map<string, number>()

  modules.forEach((module) => {
    module.procedures.forEach((procedure) => {
      const sourceId = `${module.id}_${procedure.id}`

      // Find actual calls within the procedure
      procedure.calls.forEach((call) => {
        const callName = call.split('.')[call.includes('.') ? 1 : 0].split('(')[0].trim()

        // Check if this call matches any known procedure
        const targetProc = procedureMap.get(callName.toLowerCase())
        if (targetProc) {
          const targetId = `${targetProc.module.id}_${targetProc.procedure.id}`
          const edgeId = `${sourceId}-${targetId}`

          // Count multiple calls to same procedure
          edgeMap.set(edgeId, (edgeMap.get(edgeId) || 0) + 1)
        }
      })
    })
  })

  // Create edge objects
  edgeMap.forEach((count, edgeId) => {
    const [source, target] = edgeId.split('-')
    edges.push({
      id: edgeId,
      source,
      target,
      data: {
        callType: count > 1 ? 'multiple' : 'single',
        count,
      },
      animated: false,
    })
  })

  return { nodes, edges }
}

/**
 * Filter graph by search term
 */
export function filterGraphBySearch(
  nodes: DependencyNode[],
  edges: DependencyEdge[],
  searchTerm: string
): {
  nodes: DependencyNode[]
  edges: DependencyEdge[]
} {
  if (!searchTerm.trim()) {
    return { nodes, edges }
  }

  const lowerSearch = searchTerm.toLowerCase()
  const matchingNodeIds = new Set<string>()

  // Find matching nodes
  const filteredNodes = nodes.filter((node) => {
    const matches =
      node.data.label.toLowerCase().includes(lowerSearch) ||
      node.data.moduleName?.toLowerCase().includes(lowerSearch)

    if (matches) {
      matchingNodeIds.add(node.id)
    }

    return matches
  })

  // Include connected nodes (single level)
  const connectedNodeIds = new Set<string>()
  edges.forEach((edge) => {
    if (matchingNodeIds.has(edge.source)) {
      connectedNodeIds.add(edge.target)
    }
    if (matchingNodeIds.has(edge.target)) {
      connectedNodeIds.add(edge.source)
    }
  })

  // Add connected nodes to results
  connectedNodeIds.forEach((id) => {
    if (!matchingNodeIds.has(id)) {
      const node = nodes.find((n) => n.id === id)
      if (node) {
        filteredNodes.push(node)
        matchingNodeIds.add(id)
      }
    }
  })

  // Filter edges to only include ones between matching nodes
  const filteredEdges = edges.filter(
    (edge) => matchingNodeIds.has(edge.source) && matchingNodeIds.has(edge.target)
  )

  return { nodes: filteredNodes, edges: filteredEdges }
}

/**
 * Get node statistics
 */
export function getGraphStats(nodes: DependencyNode[], edges: DependencyEdge[]) {
  const procedureCount = nodes.filter((n) => n.data.type === 'procedure').length
  const moduleCount = nodes.filter((n) => n.data.type === 'module').length
  const callCount = edges.reduce((sum, e) => sum + (e.data?.count || 1), 0)

  return {
    totalNodes: nodes.length,
    procedures: procedureCount,
    modules: moduleCount,
    totalEdges: edges.length,
    totalCalls: callCount,
  }
}

/**
 * Calculate layout positions (simple hierarchical layout)
 */
export function calculateLayout(
  nodes: DependencyNode[],
  edges: DependencyEdge[]
): DependencyNode[] {
  const positioned = [...nodes]

  // Group by depth (simple level assignment)
  const depths = new Map<string, number>()
  const visited = new Set<string>()

  function assignDepth(nodeId: string, depth: number) {
    if (visited.has(nodeId)) return

    visited.add(nodeId)
    depths.set(nodeId, Math.max(depth, depths.get(nodeId) || 0))

    // Find children (nodes this node calls)
    edges.forEach((edge) => {
      if (edge.source === nodeId) {
        assignDepth(edge.target, depth + 1)
      }
    })
  }

  // Start from leaf nodes (nodes with no outgoing calls)
  const rootNodes = positioned.filter(
    (n) => n.data.type === 'procedure' && !edges.some((e) => e.source === n.id)
  )

  rootNodes.forEach((node) => {
    assignDepth(node.id, 0)
  })

  // Assign positions based on depth
  const levelCounts = new Map<number, number>()
  const levelPositions = new Map<number, number>()

  positioned.forEach((node) => {
    const depth = depths.get(node.id) || 0
    const count = (levelCounts.get(depth) || 0) + 1
    levelCounts.set(depth, count)
  })

  positioned.forEach((node) => {
    const depth = depths.get(node.id) || 0
    const position = (levelPositions.get(depth) || 0) + 1
    levelPositions.set(depth, position)

    const x = depth * 300
    const y = position * 100

    node.position = { x, y }
  })

  return positioned
}
