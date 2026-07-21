import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WorkspaceMode = 'explorer' | 'search'

interface ModeStore {
  currentMode: WorkspaceMode
  sidebarCollapsed: boolean
  theme: 'light' | 'dark'

  setMode: (mode: WorkspaceMode) => void
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useModeStore = create<ModeStore>()(
  persist(
    (set) => ({
      currentMode: 'explorer',
      sidebarCollapsed: false,
      theme: 'light',

      setMode: (mode) => set({ currentMode: mode }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'mode-store',
    }
  )
)
