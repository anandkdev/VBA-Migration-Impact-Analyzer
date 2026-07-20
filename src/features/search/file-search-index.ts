import { VBAFile } from '@/types/index'

export interface SearchMatch {
  id: string
  lineNumber: number
  lineContent: string
  matchStart: number
  matchEnd: number
  matchContent: string
}

export interface FileMatchGroup {
  file: VBAFile
  matches: SearchMatch[]
}

export interface IndexedFileLine {
  lineNumber: number
  content: string
  originalContent: string
  tokens: string[]
}

export interface IndexedFile {
  file: VBAFile
  lines: IndexedFileLine[]
}

export interface SearchOptions {
  caseSensitive: boolean
  wholeWord: boolean
  matchRegex: boolean
  ignoreComments: boolean
}

export class FileSearchIndex {
  private index: Map<string, IndexedFile> = new Map()
  private matchIdCounter: number = 0

  /**
   * Index all files
   */
  public buildIndex(files: VBAFile[]): void {
    this.index.clear()
    this.matchIdCounter = 0

    files.forEach((file) => {
      this.indexFile(file)
    })
  }

  /**
   * Index a single file
   */
  private indexFile(file: VBAFile): void {
    const lines = file.content.split('\n')

    const indexedLines: IndexedFileLine[] = lines.map((content, index) => ({
      lineNumber: index + 1,
      content: content.toLowerCase(),
      originalContent: content,
      tokens: this.tokenizeLine(content),
    }))

    this.index.set(file.id, {
      file,
      lines: indexedLines,
    })
  }

  /**
   * Tokenize a line into searchable tokens
   */
  private tokenizeLine(line: string): string[] {
    return line
      .toLowerCase()
      .split(/\s+/)
      .filter((token) => token.length > 0)
  }

  /**
   * Search all indexed files
   */
  public search(
    query: string,
    options: Partial<SearchOptions> = {}
  ): FileMatchGroup[] {
    const opts: SearchOptions = {
      caseSensitive: options.caseSensitive ?? false,
      wholeWord: options.wholeWord ?? false,
      matchRegex: options.matchRegex ?? false,
      ignoreComments: options.ignoreComments ?? true,
    }

    const results: FileMatchGroup[] = []

    this.index.forEach((indexedFile) => {
      const matches = this.searchFile(indexedFile, query, opts)

      if (matches.length > 0) {
        results.push({
          file: indexedFile.file,
          matches,
        })
      }
    })

    return results
  }

  /**
   * Search a single file
   */
  private searchFile(
    indexedFile: IndexedFile,
    query: string,
    options: SearchOptions
  ): SearchMatch[] {
    const matches: SearchMatch[] = []

    indexedFile.lines.forEach((line) => {
      // Skip comments if ignoreComments is true
      if (options.ignoreComments && this.isCommentLine(line.originalContent)) {
        return
      }

      const lineMatches = this.findMatches(
        line.originalContent,
        line.content,
        query,
        line.lineNumber,
        options
      )

      matches.push(...lineMatches)
    })

    return matches
  }

  /**
   * Find all matches in a line
   */
  private findMatches(
    originalLine: string,
    lowerLine: string,
    query: string,
    lineNumber: number,
    options: SearchOptions
  ): SearchMatch[] {
    const matches: SearchMatch[] = []
    const searchQuery = options.caseSensitive ? query : query.toLowerCase()
    const searchLine = options.caseSensitive ? originalLine : lowerLine

    if (options.matchRegex) {
      return this.findRegexMatches(
        originalLine,
        query,
        lineNumber,
        options
      )
    }

    if (options.wholeWord) {
      return this.findWholeWordMatches(
        originalLine,
        searchQuery,
        lineNumber,
        options
      )
    }

    // Partial match
    let startIndex = 0
    while (true) {
      const index = searchLine.indexOf(searchQuery, startIndex)
      if (index === -1) break

      matches.push({
        id: `match_${++this.matchIdCounter}`,
        lineNumber,
        lineContent: originalLine,
        matchStart: index,
        matchEnd: index + searchQuery.length,
        matchContent: originalLine.substring(index, index + searchQuery.length),
      })

      startIndex = index + 1
    }

    return matches
  }

  /**
   * Find whole-word matches
   */
  private findWholeWordMatches(
    line: string,
    query: string,
    lineNumber: number,
    options: SearchOptions
  ): SearchMatch[] {
    const matches: SearchMatch[] = []
    const searchLine = options.caseSensitive ? line : line.toLowerCase()

    const wordBoundaryRegex = new RegExp(
      `\\b${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
      options.caseSensitive ? 'g' : 'gi'
    )

    let match
    while ((match = wordBoundaryRegex.exec(searchLine)) !== null) {
      matches.push({
        id: `match_${++this.matchIdCounter}`,
        lineNumber,
        lineContent: line,
        matchStart: match.index,
        matchEnd: match.index + match[0].length,
        matchContent: line.substring(match.index, match.index + match[0].length),
      })
    }

    return matches
  }

  /**
   * Find regex matches
   */
  private findRegexMatches(
    line: string,
    query: string,
    lineNumber: number,
    options: SearchOptions
  ): SearchMatch[] {
    const matches: SearchMatch[] = []

    try {
      const regex = new RegExp(
        query,
        options.caseSensitive ? 'g' : 'gi'
      )

      let match
      while ((match = regex.exec(line)) !== null) {
        matches.push({
          id: `match_${++this.matchIdCounter}`,
          lineNumber,
          lineContent: line,
          matchStart: match.index,
          matchEnd: match.index + match[0].length,
          matchContent: match[0],
        })
      }
    } catch (error) {
      // Invalid regex, skip
    }

    return matches
  }

  /**
   * Check if a line is a comment
   */
  private isCommentLine(line: string): boolean {
    const trimmed = line.trim()
    return trimmed.startsWith("'") || trimmed.startsWith('REM')
  }

  /**
   * Get indexed file by ID
   */
  public getIndexedFile(fileId: string): IndexedFile | undefined {
    return this.index.get(fileId)
  }

  /**
   * Clear the index
   */
  public clear(): void {
    this.index.clear()
    this.matchIdCounter = 0
  }

  /**
   * Get index size
   */
  public getSize(): number {
    return this.index.size
  }
}

// Singleton instance
export const fileSearchIndex = new FileSearchIndex()
