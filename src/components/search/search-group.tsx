'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { FileMatchGroup } from '@/features/search/file-search-index'
import { SearchMatch } from '@/components/search/search-match'

interface SearchGroupProps {
  group: FileMatchGroup
  selectedMatchId?: string | null
  onSelectMatch?: (matchId: string, fileId: string, lineNumber: number) => void
}

/**
 * Renders a file group with all its matches
 * VSCode-style collapsible group
 */
export function SearchGroup({
  group,
  selectedMatchId,
  onSelectMatch,
}: SearchGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="border-b border-border">
      {/* File Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-accent transition-colors group"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}

        <div className="flex-1 min-w-0 text-left">
          <p className="font-semibold text-sm truncate">{group.file.name}</p>
          <p className="text-xs text-muted-foreground">
            {group.file.path}
          </p>
        </div>

        <div className="flex-shrink-0 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          {group.matches.length} {group.matches.length === 1 ? 'match' : 'matches'}
        </div>
      </button>

      {/* Matches */}
      {isExpanded && (
        <div className="bg-muted/20">
          {group.matches.map((match) => (
            <SearchMatch
              key={match.id}
              match={match}
              isSelected={selectedMatchId === match.id}
              onClick={() =>
                onSelectMatch?.(match.id, group.file.id, match.lineNumber)
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
