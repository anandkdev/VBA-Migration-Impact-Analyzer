'use client'

import React from 'react'
import { Settings2 } from 'lucide-react'
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
          variant={showOptions ? 'secondary' : 'ghost'}
          size="sm"
          onClick={onToggleOptions}
          title="Search options"
        >
          <Settings2 className="w-4 h-4" />
        </Button>
      </div>

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
