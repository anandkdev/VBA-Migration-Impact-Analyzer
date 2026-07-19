import { create } from 'zustand'
import { VBAFile, VBAModule } from '@/types/index'

interface ProjectState {
  projectName: string
  files: VBAFile[]
  modules: VBAModule[]
  setProjectName: (name: string) => void
  addFile: (file: VBAFile) => void
  addModule: (module: VBAModule) => void
  clear: () => void
}

export const useProjectStore = create<ProjectState>((set) => ({
  projectName: '',
  files: [],
  modules: [],

  setProjectName: (name) => set({ projectName: name }),

  addFile: (file) =>
    set((state) => ({
      files: [...state.files, file],
    })),

  addModule: (module) =>
    set((state) => ({
      modules: [...state.modules, module],
    })),

  clear: () =>
    set({
      projectName: '',
      files: [],
      modules: [],
    }),
}))
