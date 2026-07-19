import { create } from 'zustand'

interface SettingsState {
  theme: 'light' | 'dark' | 'system'
  searchOptions: {
    caseSensitive: boolean
    useRegex: boolean
    ignoreComments: boolean
  }
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  updateSearchOptions: (
    options: Partial<SettingsState['searchOptions']>
  ) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'system',
  searchOptions: {
    caseSensitive: false,
    useRegex: false,
    ignoreComments: true,
  },

  setTheme: (theme) => set({ theme }),

  updateSearchOptions: (options) =>
    set((state) => ({
      searchOptions: {
        ...state.searchOptions,
        ...options,
      },
    })),
}))
