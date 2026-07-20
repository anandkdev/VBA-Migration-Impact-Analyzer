'use client'

import React from 'react'
import { Search, X, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SearchHeaderProps {
  query: string
  onQueryChange: (query: string) => void
  matchCount: number
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
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search files and code..."
            className="w-full px-10 py-2 rounded border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            autoFocus
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

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
