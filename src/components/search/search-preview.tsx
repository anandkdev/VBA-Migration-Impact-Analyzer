'use client'

import React, { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileMatchGroup } from '@/features/search/file-search-index'

interface SearchPreviewProps {
  fileGroup: FileMatchGroup | null
  currentMatchId: string | null
  query: string
  onMatchSelect: (matchId: string, fileId: string, lineNumber: number) => void
  onClose: () => void
}

/**
 * Search result preview showing file content with highlighted matches
 */
export function SearchPreview({
  fileGroup,
  currentMatchId,
  query,
  onMatchSelect,
  onClose,
}: SearchPreviewProps) {
  const [previewQuery] = useState(query)

  // Find current match and its index
  const currentMatchIndex = useMemo(() => {
    if (!fileGroup || !currentMatchId) return -1
    return fileGroup.matches.findIndex((m) => m.id === currentMatchId)
  }, [fileGroup, currentMatchId])

  // Get previous match in current file
  const handlePrevious = () => {
    if (!fileGroup) return
    let previousIndex = currentMatchIndex - 1
    if (previousIndex < 0) {
      previousIndex = fileGroup.matches.length - 1
    }
    const match = fileGroup.matches[previousIndex]
    onMatchSelect(match.id, fileGroup.file.id, match.lineNumber)
  }

  // Get next match in current file
  const handleNext = () => {
    if (!fileGroup) return
    let nextIndex = currentMatchIndex + 1
    if (nextIndex >= fileGroup.matches.length) {
      nextIndex = 0
    }
    const match = fileGroup.matches[nextIndex]
    onMatchSelect(match.id, fileGroup.file.id, match.lineNumber)
  }

  if (!fileGroup) {
    return (
      <div className="flex flex-col h-full bg-background border-l border-border">
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="text-sm">Click a result to preview</p>
          </div>
        </div>
      </div>
    )
  }

  const currentMatch = currentMatchId
    ? fileGroup.matches.find((m) => m.id === currentMatchId)
    : fileGroup.matches[0]

  if (!currentMatch) {
    return null
  }

  const lines = fileGroup.file.content.split('\n')
  const startLine = Math.max(0, currentMatch.lineNumber - 3)
  const endLine = Math.min(lines.length, currentMatch.lineNumber + 3)
  const contextLines = lines.slice(startLine, endLine)

  return (
    <div className="flex flex-col h-full bg-background border-l border-border">
      {/* Preview Header */}
      <div className="border-b border-border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold truncate">{fileGroup.file.name}</h3>
            <p className="text-xs text-muted-foreground truncate mt-1">
              {fileGroup.file.path}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Match Info */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {currentMatchIndex + 1} of {fileGroup.matches.length} matches
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={fileGroup.matches.length === 0}
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={fileGroup.matches.length === 0}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* File Content Preview */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-0 font-mono text-sm">
          {contextLines.map((line, idx) => {
            const actualLineNumber = startLine + idx + 1
            const isCurrentLine = actualLineNumber === currentMatch.lineNumber

            // Find all matches on this line
            const matchesOnLine = fileGroup.matches.filter(
              (m) => m.lineNumber === actualLineNumber
            )

            return (
              <div
                key={idx}
                className={`flex gap-4 ${
                  isCurrentLine ? 'bg-yellow-500/10 border-l-2 border-l-yellow-500 pl-3' : 'pl-4'
                }`}
              >
                <span className="w-12 text-right text-muted-foreground flex-shrink-0">
                  {actualLineNumber}
                </span>
                <span className="flex-1 break-all text-foreground">
                  {matchesOnLine.length > 0 ? (
                    <>
                      {matchesOnLine.map((match, matchIdx) => {
                        const beforeStart = matchIdx === 0 ? 0 : matchesOnLine[matchIdx - 1].matchEnd
                        const before = line.substring(beforeStart, match.matchStart)
                        const highlighted = line.substring(match.matchStart, match.matchEnd)

                        return (
                          <React.Fragment key={match.id}>
                            {before}
                            <mark
                              className={`${
                                match.id === currentMatchId
                                  ? 'bg-orange-400 dark:bg-orange-600 font-bold'
                                  : 'bg-yellow-300 dark:bg-yellow-600 font-semibold'
                              }`}
                            >
                              {highlighted}
                            </mark>
                          </React.Fragment>
                        )
                      })}
                      {matchesOnLine[matchesOnLine.length - 1] &&
                        line.substring(matchesOnLine[matchesOnLine.length - 1].matchEnd)}
                    </>
                  ) : (
                    line
                  )}
                </span>
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {/* Query Info */}
      <div className="border-t border-border p-3 text-xs text-muted-foreground">
        <span>Search: </span>
        <span className="font-semibold text-foreground">"{previewQuery}"</span>
      </div>
    </div>
  )
}
