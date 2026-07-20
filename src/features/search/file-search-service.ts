import { VBAFile } from '@/types/index'
import {
  fileSearchIndex,
  FileMatchGroup,
  SearchOptions,
  FileSearchIndex,
} from '@/features/search/file-search-index'

/**
 * Service layer for file-based search operations
 * Manages index lifecycle and provides search operations
 * Decoupled from UI
 */
export class FileSearchService {
  private index: FileSearchIndex = fileSearchIndex
  private lastQuery: string = ''
  private lastResults: FileMatchGroup[] = []
  private debounceTimer: NodeJS.Timeout | null = null
  private debounceDelay: number = 100

  /**
   * Initialize the search index with files
   */
  public initializeIndex(files: VBAFile[]): void {
    this.index.buildIndex(files)
  }

  /**
   * Clear the search index
   */
  public clearIndex(): void {
    this.index.clear()
    this.lastQuery = ''
    this.lastResults = []
    this.clearDebounce()
  }

  /**
   * Perform a search with debouncing
   */
  public async searchDebounced(
    query: string,
    options?: Partial<SearchOptions>
  ): Promise<FileMatchGroup[]> {
    return new Promise((resolve) => {
      this.clearDebounce()

      this.debounceTimer = setTimeout(() => {
        const results = this.search(query, options)
        resolve(results)
      }, this.debounceDelay)
    })
  }

  /**
   * Perform an immediate search
   */
  public search(
    query: string,
    options?: Partial<SearchOptions>
  ): FileMatchGroup[] {
    if (!query.trim()) {
      return []
    }

    // Cache check
    if (query === this.lastQuery) {
      return this.lastResults
    }

    const results = this.index.search(query, options)
    this.lastQuery = query
    this.lastResults = results

    return results
  }

  /**
   * Get file by ID
   */
  public getFileById(fileId: string): VBAFile | undefined {
    const indexed = this.index.getIndexedFile(fileId)
    return indexed?.file
  }

  /**
   * Get lines from a file
   */
  public getFileLines(fileId: string): string[] {
    const indexed = this.index.getIndexedFile(fileId)
    if (!indexed) return []
    return indexed.lines.map((line) => line.originalContent)
  }

  /**
   * Get a specific line from a file
   */
  public getFileLine(fileId: string, lineNumber: number): string | null {
    const indexed = this.index.getIndexedFile(fileId)
    if (!indexed) return null

    const line = indexed.lines.find((l) => l.lineNumber === lineNumber)
    return line?.originalContent ?? null
  }

  /**
   * Get total match count
   */
  public getMatchCount(results: FileMatchGroup[]): number {
    return results.reduce((sum, group) => sum + group.matches.length, 0)
  }

  /**
   * Get results grouped by file
   */
  public getResultsByFile(results: FileMatchGroup[]) {
    return results.map((group) => ({
      file: group.file,
      matchCount: group.matches.length,
      matches: group.matches,
    }))
  }

  /**
   * Clear debounce timer
   */
  private clearDebounce(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }
  }

  /**
   * Set debounce delay
   */
  public setDebounceDelay(delay: number): void {
    this.debounceDelay = Math.max(0, delay)
  }

  /**
   * Get index statistics
   */
  public getStats() {
    return {
      indexedFiles: this.index.getSize(),
      lastQuery: this.lastQuery,
      cachedResultCount: this.lastResults.length,
    }
  }
}

// Singleton instance
export const fileSearchService = new FileSearchService()
