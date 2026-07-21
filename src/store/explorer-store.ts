import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ExplorerStore {
  selectedFileId: string | null
  selectedWorkbookId: string | null
  selectedWorksheetId: string | null
  expandedNodes: Set<string>

  setSelectedFile: (fileId: string | null) => void
  setSelectedWorkbook: (workbookId: string | null) => void
  setSelectedWorksheet: (worksheetId: string | null) => void
  toggleNodeExpanded: (nodeId: string) => void
  setExpandedNodes: (nodeIds: Set<string>) => void
}

export const useExplorerStore = create<ExplorerStore>()(
  persist(
    (set) => ({
      selectedFileId: null,
      selectedWorkbookId: null,
      selectedWorksheetId: null,
      expandedNodes: new Set(),

      setSelectedFile: (fileId) => set({ selectedFileId: fileId }),
      setSelectedWorkbook: (workbookId) => set({ selectedWorkbookId: workbookId }),
      setSelectedWorksheet: (worksheetId) => set({ selectedWorksheetId: worksheetId }),
      toggleNodeExpanded: (nodeId) =>
        set((state) => {
          const expanded = new Set(state.expandedNodes)
          if (expanded.has(nodeId)) {
            expanded.delete(nodeId)
          } else {
            expanded.add(nodeId)
          }
          return { expandedNodes: expanded }
        }),
      setExpandedNodes: (nodeIds) => set({ expandedNodes: nodeIds }),
    }),
    {
      name: 'explorer-store',
      partialize: (state) => ({
        selectedFileId: state.selectedFileId,
        selectedWorkbookId: state.selectedWorkbookId,
        selectedWorksheetId: state.selectedWorksheetId,
        expandedNodes: Array.from(state.expandedNodes),
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as any),
        expandedNodes: new Set((persistedState as any)?.expandedNodes || []),
      }),
    }
  )
)
