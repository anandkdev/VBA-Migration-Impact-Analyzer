'use client'

import React from 'react'
import { Settings2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchInputLoader } from '@/components/loaders/search-input-loader'
import { ExportMenu } from '@/components/search/export-menu'
import { FileMatchGroup } from '@/features/search/file-search-index'

interface SearchHeaderProps {
  query: string
  onQueryChange: (query: string) => void
  matchCount: number
  results?: FileMatchGroup[]
  isLoading?: boolean
  onToggleOptions?: () => void
  showOptions?: boolean
  replaceValue?: string
  onReplaceChange?: (value: string) => void
  showReplace?: boolean
  onToggleReplace?: () => void
  onReplace?: () => void
  onReplaceAll?: () => void
  isReplacing?: boolean
}

/**
 * Search header with input, stats, and controls
 */
export function SearchHeader({
  query,
  onQueryChange,
  matchCount,
  results = [],
  isLoading = false,
  onToggleOptions,
  showOptions = false,
  replaceValue = '',
  onReplaceChange,
  showReplace = false,
  onToggleReplace,
  onReplace,
  onReplaceAll,
  isReplacing = false,
}: SearchHeaderProps) {
  const handleClear = () => {
    onQueryChange('')
  }

  return (
    <div className="border-b border-border p-4 space-y-3">
      {/* Search Input */}
      <div className="flex items-center gap-2">
        <SearchInputLoader
          value={query}
          onChange={onQueryChange}
          onClear={handleClear}
          isLoading={isLoading}
          placeholder="Search files and code..."
          autoFocus
        />

        {query && results.length > 0 && (
          <ExportMenu
            results={results}
            query={query}
            disabled={isLoading}
          />
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleReplace}
          title="Toggle replace"
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${showReplace ? 'rotate-180' : ''}`} />
        </Button>

        <Button
          variant={showOptions ? 'secondary' : 'ghost'}
          size="sm"
          onClick={onToggleOptions}
          title="Search options"
        >
          <Settings2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Replace Input */}
      {showReplace && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={replaceValue}
            onChange={(e) => onReplaceChange?.(e.target.value)}
            placeholder="Replace with..."
            className="flex-1 px-3 py-1.5 text-sm border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={!query || isReplacing}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={onReplace}
            disabled={!query || matchCount === 0 || isReplacing}
            title="Replace next match"
          >
            Replace
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onReplaceAll}
            disabled={!query || matchCount === 0 || isReplacing}
            title="Replace all matches"
          >
            Replace All
          </Button>
        </div>
      )}

      {/* Results Info */}
      {query && (
        <div className="text-xs text-muted-foreground">
          {matchCount > 0 ? (
            <span>
              Found {matchCount} match{matchCount !== 1 ? 'es' : ''}
            </span>
          ) : (
            <span>No matches found</span>
          )}
        </div>
      )}
    </div>
  )
}
