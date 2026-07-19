import { useProjectStore } from '@/store/project-store'
import {
  buildSearchIndex,
  searchIndex as performSearch,
  SearchIndex,
  SearchOptions,
  IndexedItem,
  getMatchPositions,
} from '@/features/search/search-index'

export class SearchService {
  private static instance: SearchService
  private index: SearchIndex | null = null
  private lastProjectId: string | null = null

  private constructor() {}

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService()
    }
    return SearchService.instance
  }

  /**
   * Ensure index is built and up-to-date
   */
  private ensureIndex(): void {
    const { files, modules, projectName } = useProjectStore.getState()

    // Rebuild index if project changed or doesn't exist
    if (this.index === null || this.lastProjectId !== projectName) {
      this.index = buildSearchIndex(files, modules)
      this.lastProjectId = projectName
    }
  }

  /**
   * Search with given query and options
   */
  search(query: string, options: SearchOptions): IndexedItem[] {
    this.ensureIndex()

    if (!this.index) {
      return []
    }

    return performSearch(this.index, query, options)
  }

  /**
   * Get match positions for highlighting
   */
  getMatches(
    content: string,
    query: string,
    options: SearchOptions
  ): Array<{ start: number; end: number }> {
    return getMatchPositions(content, query, options)
  }

  /**
   * Clear cache to force rebuild
   */
  clearCache(): void {
    this.index = null
    this.lastProjectId = null
  }

  /**
   * Get index statistics
   */
  getStats() {
    this.ensureIndex()

    if (!this.index) {
      return { itemCount: 0, fileCount: 0 }
    }

    return {
      itemCount: this.index.items.length,
      fileCount: this.index.fileCount,
      lastUpdated: this.index.lastUpdated,
    }
  }

  /**
   * Get available search types
   */
  getAvailableTypes(): Array<{ value: string; label: string }> {
    return [
      { value: 'procedure', label: 'Procedures' },
      { value: 'variable', label: 'Variables' },
      { value: 'module', label: 'Modules' },
      { value: 'constant', label: 'Constants' },
      { value: 'enum', label: 'Enums' },
      { value: 'type', label: 'Types' },
      { value: 'comment', label: 'Comments' },
      { value: 'file', label: 'Files' },
    ]
  }
}

export const searchService = SearchService.getInstance()
