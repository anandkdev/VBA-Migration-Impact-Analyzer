import { create } from 'zustand'
import { VBAFile, VBAModule, Procedure } from '@/types/index'
import type { ProjectStats } from '@/core/types'

interface NavigationState {
  activeSection: string
  activeFileId: string | null
  activeLineNumber: number | null
  activeSearchTerm: string | null
  activeSearchResultId: string | null
  selectedProcedure: Procedure | null
  selectedVariable: any | null
  selectedModule: VBAModule | null
}

interface ProjectState extends NavigationState {
  projectName: string
  files: VBAFile[]
  modules: VBAModule[]
  stats: ProjectStats | null
  setProjectName: (name: string) => void
  addFile: (file: VBAFile) => void
  addModule: (module: VBAModule) => void
  setProject: (files: VBAFile[], modules: VBAModule[], stats: ProjectStats) => void
  setActiveSection: (section: string) => void
  setActiveFile: (fileId: string | null, lineNumber?: number) => void
  setActiveLineNumber: (lineNumber: number | null) => void
  setActiveSearch: (term: string | null, resultId?: string | null) => void
  setSelectedProcedure: (procedure: Procedure | null) => void
  setSelectedVariable: (variable: any | null) => void
  setSelectedModule: (module: VBAModule | null) => void
  clearSelection: () => void
  clear: () => void
}

export const useProjectStore = create<ProjectState>((set) => ({
  projectName: '',
  files: [],
  modules: [],
  stats: null,
  activeSection: 'dashboard',
  activeFileId: null,
  activeLineNumber: null,
  activeSearchTerm: null,
  activeSearchResultId: null,
  selectedProcedure: null,
  selectedVariable: null,
  selectedModule: null,

  setProjectName: (name) => set({ projectName: name }),

  addFile: (file) =>
    set((state) => ({
      files: [...state.files, file],
    })),

  addModule: (module) =>
    set((state) => ({
      modules: [...state.modules, module],
    })),

  setProject: (files, modules, stats) => set({ files, modules, stats }),

  setActiveSection: (section) => set({ activeSection: section }),

  setActiveFile: (fileId, lineNumber) =>
    set({
      activeFileId: fileId,
      activeLineNumber: lineNumber ?? null,
    }),

  setActiveLineNumber: (lineNumber) => set({ activeLineNumber: lineNumber }),

  setActiveSearch: (term, resultId) =>
    set({
      activeSearchTerm: term,
      activeSearchResultId: resultId ?? null,
    }),

  setSelectedProcedure: (procedure) => set({ selectedProcedure: procedure }),

  setSelectedVariable: (variable) => set({ selectedVariable: variable }),

  setSelectedModule: (module) => set({ selectedModule: module }),

  clearSelection: () =>
    set({
      activeFileId: null,
      activeLineNumber: null,
      selectedProcedure: null,
      selectedVariable: null,
      selectedModule: null,
    }),

  clear: () =>
    set({
      projectName: '',
      files: [],
      modules: [],
      stats: null,
      activeSection: 'dashboard',
      activeFileId: null,
      activeLineNumber: null,
      activeSearchTerm: null,
      activeSearchResultId: null,
      selectedProcedure: null,
      selectedVariable: null,
      selectedModule: null,
    }),
}))
