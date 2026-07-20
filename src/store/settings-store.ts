import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  theme: 'light' | 'dark' | 'system'
  searchOptions: {
    caseSensitive: boolean
    useRegex: boolean
    ignoreComments: boolean
  }
  exportDefaults: {
    format: 'html' | 'excel'
    includeStats: boolean
    includeRecommendations: boolean
  }
  uiPreferences: {
    compactMode: boolean
    showLineNumbers: boolean
    enableAnimations: boolean
  }
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  updateSearchOptions: (
    options: Partial<SettingsState['searchOptions']>
  ) => void
  updateExportDefaults: (
    options: Partial<SettingsState['exportDefaults']>
  ) => void
  updateUiPreferences: (
    options: Partial<SettingsState['uiPreferences']>
  ) => void
  resetSettings: () => void
}

const defaultSettings = {
  theme: 'system' as const,
  searchOptions: {
    caseSensitive: false,
    useRegex: false,
    ignoreComments: true,
  },
  exportDefaults: {
    format: 'html' as const,
    includeStats: true,
    includeRecommendations: true,
  },
  uiPreferences: {
    compactMode: false,
    showLineNumbers: true,
    enableAnimations: true,
  },
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setTheme: (theme) => set({ theme }),

      updateSearchOptions: (options) =>
        set((state) => ({
          searchOptions: {
            ...state.searchOptions,
            ...options,
          },
        })),

      updateExportDefaults: (options) =>
        set((state) => ({
          exportDefaults: {
            ...state.exportDefaults,
            ...options,
          },
        })),

      updateUiPreferences: (options) =>
        set((state) => ({
          uiPreferences: {
            ...state.uiPreferences,
            ...options,
          },
        })),

      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'vba-analyzer-settings',
      version: 1,
    }
  )
)
