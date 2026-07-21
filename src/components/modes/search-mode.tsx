'use client'

import React, { useState } from 'react'
import { Search, Download, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSearchStore } from '@/store/search-store'
import { EmptyState } from '@/utils/empty-states'

export function SearchMode() {
  const { query, setQuery, results, clearResults } = useSearchStore()
  const [selectedResult, setSelectedResult] = useState<number | null>(null)

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Implement actual search
    console.log('Searching for:', query)
  }

  const handleExport = () => {
    // TODO: Implement export to Excel, CSV, JSON
    console.log('Exporting results...')
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Search Toolbar */}
      <div className="border-b border-border bg-card p-4 space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search VBA code, variables, procedures..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
          <Button type="submit" variant="default" size="sm">
            Search
          </Button>
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery('')
                clearResults()
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </form>

        {/* Export & Stats */}
        {results.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto">
        {results.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <EmptyState
              icon="🔍"
              title="Search VBA Projects"
              description="Enter a search query to find code, variables, procedures, and more across all imported projects."
              action={undefined}
            />
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {results.map((result, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedResult(selectedResult === idx ? null : idx)}
                className={`p-3 rounded border cursor-pointer transition-colors ${
                  selectedResult === idx
                    ? 'bg-primary/10 border-primary'
                    : 'bg-card border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{result.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      Line {result.lineNumber}
                    </p>
                  </div>
                  <span className="text-xs bg-muted px-2 py-1 rounded whitespace-nowrap">
                    {result.columnNumber}
                  </span>
                </div>
                {selectedResult === idx && (
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                    {result.context}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
