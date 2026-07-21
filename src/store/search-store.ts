import { create } from 'zustand'

interface SearchResult {
  fileId: string
  fileName: string
  lineNumber: number
  columnNumber: number
  text: string
  context: string
}

interface SearchStore {
  query: string
  results: SearchResult[]
  isSearching: boolean
  matchCount: number
  fileTypes: string[]
  objectTypes: string[]
  searchScope: 'project' | 'workbook' | 'file'

  setQuery: (query: string) => void
  setResults: (results: SearchResult[]) => void
  setIsSearching: (searching: boolean) => void
  setFileTypes: (types: string[]) => void
  setObjectTypes: (types: string[]) => void
  setSearchScope: (scope: 'project' | 'workbook' | 'file') => void
  clearResults: () => void
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  results: [],
  isSearching: false,
  matchCount: 0,
  fileTypes: [],
  objectTypes: [],
  searchScope: 'project',

  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results, matchCount: results.length }),
  setIsSearching: (searching) => set({ isSearching: searching }),
  setFileTypes: (types) => set({ fileTypes: types }),
  setObjectTypes: (types) => set({ objectTypes: types }),
  setSearchScope: (scope) => set({ searchScope: scope }),
  clearResults: () => set({ results: [], matchCount: 0, query: '' }),
}))
