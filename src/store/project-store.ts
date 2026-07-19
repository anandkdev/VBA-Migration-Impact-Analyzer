import { create } from 'zustand'

interface ProjectFile {
  id: string
  name: string
  path: string
  type: 'bas' | 'cls' | 'frm' | 'xlsm' | 'xls' | 'xlsx' | 'txt' | 'csv'
  content: string
}

interface ProjectModule {
  id: string
  name: string
  type: 'Module' | 'Class' | 'Form'
  procedures: string[]
  variables: string[]
  worksheets?: string[]
}

interface ProjectState {
  projectName: string
  files: ProjectFile[]
  modules: ProjectModule[]
  setProjectName: (name: string) => void
  addFile: (file: ProjectFile) => void
  addModule: (module: ProjectModule) => void
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
