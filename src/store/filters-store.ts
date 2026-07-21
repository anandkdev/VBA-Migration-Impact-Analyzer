import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { VBAFileType, SeverityLevel } from '@/types/index'

interface FiltersState {
  fileTypes: VBAFileType[]
  objectTypes: string[]
  severity: SeverityLevel[]
  searchScope: 'project' | 'file' | 'folder'
  migrationFilter: 'rms' | 'mph' | 'attributes' | 'flags' | null

  setFileTypes: (types: VBAFileType[]) => void
  setObjectTypes: (types: string[]) => void
  setSeverity: (levels: SeverityLevel[]) => void
  setSearchScope: (scope: 'project' | 'file' | 'folder') => void
  setMigrationFilter: (filter: 'rms' | 'mph' | 'attributes' | 'flags' | null) => void
  resetFilters: () => void
}

const DEFAULT_FILE_TYPES: VBAFileType[] = [
  'bas',
  'cls',
  'frm',
  'xlsm',
  'xls',
  'xlsx',
  'csv',
  'txt',
  'sql',
  'xml',
  'json',
  'png',
  'jpg',
  'jpeg',
  'gif',
  'svg',
  'pdf',
]

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set) => ({
      fileTypes: DEFAULT_FILE_TYPES,
      objectTypes: [],
      severity: [],
      searchScope: 'project',
      migrationFilter: null,

      setFileTypes: (types) => set({ fileTypes: types }),
      setObjectTypes: (types) => set({ objectTypes: types }),
      setSeverity: (levels) => set({ severity: levels }),
      setSearchScope: (scope) => set({ searchScope: scope }),
      setMigrationFilter: (filter) => set({ migrationFilter: filter }),
      resetFilters: () =>
        set({
          fileTypes: DEFAULT_FILE_TYPES,
          objectTypes: [],
          severity: [],
          searchScope: 'project',
          migrationFilter: null,
        }),
    }),
    {
      name: 'vba-analyzer-filters',
      version: 1,
    }
  )
)
