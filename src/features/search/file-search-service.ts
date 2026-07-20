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
   * Replace a single match in a file
   */
  public replaceMatch(
    fileId: string,
    lineNumber: number,
    matchStart: number,
    matchEnd: number,
    replacement: string
  ): { success: boolean; newContent?: string; error?: string } {
    try {
      const indexed = this.index.getIndexedFile(fileId)
      if (!indexed) {
        return { success: false, error: 'File not found' }
      }

      const lineIndex = lineNumber - 1
      if (lineIndex < 0 || lineIndex >= indexed.lines.length) {
        return { success: false, error: 'Line not found' }
      }

      const line = indexed.lines[lineIndex]
      const newLine =
        line.originalContent.slice(0, matchStart) +
        replacement +
        line.originalContent.slice(matchEnd)

      indexed.lines[lineIndex].originalContent = newLine
      return { success: true, newContent: newLine }
    } catch (error) {
      return {
        success: false,
        error: `Failed to replace: ${(error as Error).message}`,
      }
    }
  }

  /**
   * Replace all matches in a file
   */
  public replaceAllInFile(
    fileId: string,
    searchTerm: string,
    replacement: string,
    options?: Partial<SearchOptions>
  ): { success: boolean; replacedCount?: number; error?: string } {
    try {
      const indexed = this.index.getIndexedFile(fileId)
      if (!indexed) {
        return { success: false, error: 'File not found' }
      }

      let replacedCount = 0
      const caseSensitive = options?.caseSensitive ?? false
      const searchRegex = options?.matchRegex
        ? new RegExp(searchTerm, caseSensitive ? 'g' : 'gi')
        : null

      indexed.lines.forEach((line) => {
        const originalLength = line.originalContent.length
        if (searchRegex) {
          line.originalContent = line.originalContent.replace(
            searchRegex,
            replacement
          )
        } else {
          const regex = new RegExp(
            searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
            caseSensitive ? 'g' : 'gi'
          )
          line.originalContent = line.originalContent.replace(regex, replacement)
        }
        if (line.originalContent.length !== originalLength) {
          replacedCount++
        }
      })

      return { success: true, replacedCount }
    } catch (error) {
      return {
        success: false,
        error: `Failed to replace all: ${(error as Error).message}`,
      }
    }
  }

  /**
   * Replace all matches across all files
   */
  public replaceAllMatches(
    results: FileMatchGroup[],
    replacement: string
  ): { success: boolean; totalReplaced?: number; error?: string } {
    try {
      let totalReplaced = 0

      results.forEach((group) => {
        const searchTerm = group.matches[0]?.matchContent || ''
        if (!searchTerm) return

        const result = this.replaceAllInFile(group.file.id, searchTerm, replacement)
        if (result.success && result.replacedCount) {
          totalReplaced += result.replacedCount
        }
      })

      return { success: true, totalReplaced }
    } catch (error) {
      return {
        success: false,
        error: `Failed to replace all matches: ${(error as Error).message}`,
      }
    }
  }

  /**
   * Get the current file content (after any replacements)
   */
  public getFileContent(fileId: string): string | null {
    const indexed = this.index.getIndexedFile(fileId)
    if (!indexed) return null
    return indexed.lines.map((line) => line.originalContent).join('\n')
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
