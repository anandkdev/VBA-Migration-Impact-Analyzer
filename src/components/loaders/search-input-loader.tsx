'use client'

import React from 'react'
import { Search, X } from 'lucide-react'
import { Spinner } from '@/components/loaders/spinner'

interface SearchInputLoaderProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  isLoading?: boolean
  placeholder?: string
  autoFocus?: boolean
}

/**
 * Search input with inline loading spinner
 * Shows spinner while searching, clear button when has value
 */
export function SearchInputLoader({
  value,
  onChange,
  onClear,
  isLoading = false,
  placeholder = 'Search files and code...',
  autoFocus = true,
}: SearchInputLoaderProps) {
  return (
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-10 py-2 rounded border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        autoFocus={autoFocus}
      />
      {isLoading ? (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Spinner size="sm" />
        </div>
      ) : value ? (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      ) : null}
    </div>
  )
}
