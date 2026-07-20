'use client'

import React from 'react'
import { SearchOptions } from '@/features/search/file-search-index'

interface SearchToolbarProps {
  options: Partial<SearchOptions>
  onOptionsChange: (options: Partial<SearchOptions>) => void
}

/**
 * Advanced search options toolbar
 * Case sensitive, whole word, regex, ignore comments
 */
export function SearchToolbar({
  options,
  onOptionsChange,
}: SearchToolbarProps) {
  const handleToggle = (key: keyof SearchOptions) => {
    onOptionsChange({
      ...options,
      [key]: !options[key],
    })
  }

  return (
    <div className="space-y-3 pt-3 border-t border-border max-h-64 overflow-y-auto px-4">
      {/* Case Sensitive */}
      <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-2 rounded">
        <input
          type="checkbox"
          checked={options.caseSensitive ?? false}
          onChange={() => handleToggle('caseSensitive')}
          className="rounded"
        />
        <span>Case sensitive</span>
      </label>

      {/* Whole Word */}
      <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-2 rounded">
        <input
          type="checkbox"
          checked={options.wholeWord ?? false}
          onChange={() => handleToggle('wholeWord')}
          disabled={options.matchRegex}
          className="rounded"
        />
        <span>Whole word</span>
      </label>

      {/* Regex */}
      <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-2 rounded">
        <input
          type="checkbox"
          checked={options.matchRegex ?? false}
          onChange={() => handleToggle('matchRegex')}
          className="rounded"
        />
        <span>Use regular expression</span>
      </label>

      {/* Ignore Comments */}
      <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted p-2 rounded">
        <input
          type="checkbox"
          checked={options.ignoreComments ?? true}
          onChange={() => handleToggle('ignoreComments')}
          className="rounded"
        />
        <span>Ignore comments</span>
      </label>
    </div>
  )
}
