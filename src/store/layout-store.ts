import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type BottomTab = 'search' | 'inspector' | 'impact' | 'dependencies' | 'migration' | 'reports'

interface LayoutState {
  activeBottomTab: BottomTab
  bottomPanelOpen: boolean
  bottomPanelSize: number
  statisticsOpen: boolean
  settingsOpen: boolean
  filtersOpen: boolean
  helpOpen: boolean

  setActiveBottomTab: (tab: BottomTab) => void
  setBottomPanelOpen: (open: boolean) => void
  setBottomPanelSize: (size: number) => void
  setStatisticsOpen: (open: boolean) => void
  setSettingsOpen: (open: boolean) => void
  setFiltersOpen: (open: boolean) => void
  setHelpOpen: (open: boolean) => void
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      activeBottomTab: 'search',
      bottomPanelOpen: true,
      bottomPanelSize: 30,
      statisticsOpen: false,
      settingsOpen: false,
      filtersOpen: false,
      helpOpen: false,

      setActiveBottomTab: (tab) => set({ activeBottomTab: tab, bottomPanelOpen: true }),
      setBottomPanelOpen: (open) => set({ bottomPanelOpen: open }),
      setBottomPanelSize: (size) => set({ bottomPanelSize: size }),
      setStatisticsOpen: (open) => set({ statisticsOpen: open }),
      setSettingsOpen: (open) => set({ settingsOpen: open }),
      setFiltersOpen: (open) => set({ filtersOpen: open }),
      setHelpOpen: (open) => set({ helpOpen: open }),
    }),
    {
      name: 'vba-analyzer-layout',
      version: 1,
    }
  )
)
