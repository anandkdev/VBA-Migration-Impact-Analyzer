'use client'

import React, { useState, useMemo } from 'react'
import { Search, Settings2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchResults } from '@/features/search/search-results'
import { searchService } from '@/features/search/search-service'
import { SearchOptions } from '@/features/search/search-index'

export function SearchView() {
  const [query, setQuery] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    caseSensitive: false,
    useRegex: false,
    wholeWord: false,
    ignoreComments: true,
    searchTypes: [],
  })
  const [isSearching, setIsSearching] = useState(false)

  const availableTypes = useMemo(
    () => searchService.getAvailableTypes(),
    []
  )

  const results = useMemo(() => {
    if (!query.trim()) return []
    setIsSearching(true)
    const res = searchService.search(query, searchOptions)
    setIsSearching(false)
    return res
  }, [query, searchOptions])

  const handleToggleType = (type: string) => {
    setSearchOptions((prev) => ({
      ...prev,
      searchTypes: prev.searchTypes.includes(type)
        ? prev.searchTypes.filter((t) => t !== type)
        : [...prev.searchTypes, type],
    }))
  }

  const handleClearSearch = () => {
    setQuery('')
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Search Header */}
      <div className="border-b border-border p-4 space-y-3">
        {/* Search Input */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search variables, procedures, comments..."
              className="w-full px-10 py-2 rounded border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
            {query && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Button
            variant={showOptions ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setShowOptions(!showOptions)}
            title="Search options"
          >
            <Settings2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Search Options */}
        {showOptions && (
          <div className="space-y-3 pt-3 border-t border-border max-h-64 overflow-y-auto">
            {/* Case and Regex Options */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-2 rounded">
                <input
                  type="checkbox"
                  checked={searchOptions.caseSensitive}
                  onChange={(e) =>
                    setSearchOptions((prev) => ({
                      ...prev,
                      caseSensitive: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <span>Case sensitive</span>
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-2 rounded">
                <input
                  type="checkbox"
                  checked={searchOptions.useRegex}
                  onChange={(e) =>
                    setSearchOptions((prev) => ({
                      ...prev,
                      useRegex: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <span>Regular expression</span>
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-2 rounded">
                <input
                  type="checkbox"
                  checked={searchOptions.wholeWord}
                  onChange={(e) =>
                    setSearchOptions((prev) => ({
                      ...prev,
                      wholeWord: e.target.checked,
                    }))
                  }
                  className="rounded"
                  disabled={searchOptions.useRegex}
                />
                <span>Whole word</span>
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-2 rounded">
                <input
                  type="checkbox"
                  checked={searchOptions.ignoreComments}
                  onChange={(e) =>
                    setSearchOptions((prev) => ({
                      ...prev,
                      ignoreComments: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <span>Ignore comments</span>
              </label>
            </div>

            {/* Search Type Filters */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Search in:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {availableTypes.map((type) => (
                  <label
                    key={type.value}
                    className="flex items-center gap-2 text-xs cursor-pointer hover:bg-muted p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={
                        searchOptions.searchTypes.length === 0 ||
                        searchOptions.searchTypes.includes(type.value)
                      }
                      onChange={() => handleToggleType(type.value)}
                      className="rounded"
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {query && (
          <div className="text-xs text-muted-foreground">
            {results.length > 0
              ? `Found ${results.length} match${results.length !== 1 ? 'es' : ''}`
              : 'No matches found'}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-hidden">
        <SearchResults
          results={results}
          isLoading={isSearching}
        />
      </div>

      {/* Footer Info */}
      {!query && (
        <div className="border-t border-border p-4 text-center text-sm text-muted-foreground bg-muted/30">
          <p>Start typing to search across all project files</p>
          <p className="text-xs mt-2">
            Searches procedures, variables, constants, comments, and more
          </p>
        </div>
      )}
    </div>
  )
}
