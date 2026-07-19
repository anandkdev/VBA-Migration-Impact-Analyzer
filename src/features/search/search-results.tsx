'use client'

import React from 'react'
import { IndexedItem } from '@/features/search/search-index'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Zap,
  Package,
  Grid3x3,
  Layers2,
  Code2,
  Hash,
  FileCode2,
  MessageSquare,
} from 'lucide-react'

interface SearchResultsProps {
  results: IndexedItem[]
  isLoading?: boolean
  onSelectResult?: (result: IndexedItem) => void
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'procedure':
      return <Zap className="w-4 h-4 text-blue-500" />
    case 'variable':
      return <Package className="w-4 h-4 text-green-500" />
    case 'constant':
      return <Hash className="w-4 h-4 text-yellow-500" />
    case 'enum':
      return <Grid3x3 className="w-4 h-4 text-purple-500" />
    case 'type':
      return <Layers2 className="w-4 h-4 text-orange-500" />
    case 'module':
      return <Code2 className="w-4 h-4 text-indigo-500" />
    case 'comment':
      return <MessageSquare className="w-4 h-4 text-gray-500" />
    case 'file':
      return <FileCode2 className="w-4 h-4 text-cyan-500" />
    default:
      return <Hash className="w-4 h-4" />
  }
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    procedure: 'Procedure',
    variable: 'Variable',
    constant: 'Constant',
    enum: 'Enum',
    type: 'Type',
    module: 'Module',
    comment: 'Comment',
    file: 'File',
  }
  return labels[type] || type
}

export function SearchResults({
  results,
  isLoading,
  onSelectResult,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p className="text-sm">Searching...</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <p className="text-sm mb-1">No results found</p>
          <p className="text-xs">Try a different search term</p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-2">
        {results.length > 0 && (
          <div className="text-xs text-muted-foreground sticky top-0 bg-background/50 backdrop-blur py-2 px-2">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </div>
        )}

        {results.map((result, index) => (
          <button
            key={`${result.id}_${index}`}
            onClick={() => onSelectResult?.(result)}
            className="w-full text-left p-3 rounded border border-border hover:bg-accent hover:border-accent transition-colors group"
          >
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">
                {getTypeIcon(result.type)}
              </div>

              <div className="flex-1 min-w-0">
                {/* Result Name */}
                <p className="font-medium text-sm truncate group-hover:text-accent-foreground">
                  {result.name}
                </p>

                {/* Result Content Preview */}
                <p className="text-xs text-muted-foreground truncate">
                  {result.content}
                </p>

                {/* Location Info */}
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>{getTypeLabel(result.type)}</span>

                  {result.moduleName && (
                    <>
                      <span>•</span>
                      <span className="truncate">{result.moduleName}</span>
                    </>
                  )}

                  {result.procedureName && (
                    <>
                      <span>•</span>
                      <span className="truncate">{result.procedureName}</span>
                    </>
                  )}

                  {result.lineNumber > 1 && (
                    <>
                      <span>•</span>
                      <span>Line {result.lineNumber}</span>
                    </>
                  )}
                </div>
              </div>

              {/* File Name */}
              <div className="flex-shrink-0 text-right">
                <p className="text-xs text-muted-foreground truncate max-w-xs">
                  {result.fileName}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}
