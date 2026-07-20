'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SearchHeader } from '@/components/search/search-header'
import { SearchToolbar } from '@/components/search/search-toolbar'
import { SearchGroup } from '@/components/search/search-group'
import { SearchResultSkeleton } from '@/components/loaders/skeleton-loader'
import { useProjectStore } from '@/store/project-store'
import { fileSearchService } from '@/features/search/file-search-service'
import { SearchOptions, FileMatchGroup } from '@/features/search/file-search-index'

/**
 * VSCode-style full-text file search
 * Implements clean architecture:
 * - Search logic in file-search-service.ts
 * - Indexing in file-search-index.ts
 * - UI components are dumb and reusable
 * - Navigation via global store
 */
export function FileSearchView() {
  const {
    files,
    activeSearchTerm,
    activeSearchResultId,
    setActiveSearch,
    setActiveFile,
    setActiveSection,
  } = useProjectStore()

  const [query, setQuery] = useState(activeSearchTerm || '')
  const [showOptions, setShowOptions] = useState(false)
  const [results, setResults] = useState<FileMatchGroup[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  const [searchOptions, setSearchOptions] = useState<Partial<SearchOptions>>({
    caseSensitive: false,
    wholeWord: false,
    matchRegex: false,
    ignoreComments: true,
  })

  // Initialize search index when files change
  useEffect(() => {
    setIsInitializing(true)
    if (files.length > 0) {
      // Simulate async initialization
      setTimeout(() => {
        fileSearchService.initializeIndex(files)
        setIsInitializing(false)
      }, 100)
    } else {
      setIsInitializing(false)
    }
  }, [files])

  // Perform search when query or options change
  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([])
        return
      }

      setIsSearching(true)
      const searchResults = fileSearchService.search(query, searchOptions)
      setResults(searchResults)
      setIsSearching(false)
    }

    performSearch()
  }, [query, searchOptions])

  // Update global search term
  useEffect(() => {
    setActiveSearch(query || null)
  }, [query, setActiveSearch])

  // Calculate total match count
  const matchCount = useMemo(
    () => fileSearchService.getMatchCount(results),
    [results]
  )

  // Handle match selection
  const handleSelectMatch = (
    matchId: string,
    fileId: string,
    lineNumber: number
  ) => {
    // Update global store
    setActiveSearch(query, matchId)
    setActiveFile(fileId, lineNumber)
    setActiveSection('explorer')
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <SearchHeader
        query={query}
        onQueryChange={setQuery}
        matchCount={matchCount}
        isLoading={isSearching || isInitializing}
        onToggleOptions={() => setShowOptions(!showOptions)}
        showOptions={showOptions}
      />

      {/* Options */}
      {showOptions && (
        <SearchToolbar
          options={searchOptions}
          onOptionsChange={setSearchOptions}
        />
      )}

      {/* Results */}
      <div className="flex-1 overflow-hidden relative">
        {!query.trim() ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-sm mb-2">Start typing to search</p>
              <p className="text-xs">Search across all imported files</p>
            </div>
          </div>
        ) : isSearching || isInitializing ? (
          <ScrollArea className="h-full">
            <SearchResultSkeleton />
          </ScrollArea>
        ) : results.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-sm mb-1">No matches found</p>
              <p className="text-xs">Try a different search term</p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div>
              {results.map((group) => (
                <SearchGroup
                  key={group.file.id}
                  group={group}
                  selectedMatchId={activeSearchResultId}
                  onSelectMatch={handleSelectMatch}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}
