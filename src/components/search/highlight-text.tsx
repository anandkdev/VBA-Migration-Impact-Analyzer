'use client'

import React from 'react'

interface HighlightTextProps {
  text: string
  matchStart: number
  matchEnd: number
  className?: string
}

/**
 * Reusable component for highlighting matched text
 * Used to highlight search matches in search results
 */
export function HighlightText({
  text,
  matchStart,
  matchEnd,
  className = '',
}: HighlightTextProps) {
  // Validate indices
  if (matchStart < 0 || matchEnd > text.length || matchStart >= matchEnd) {
    return <span className={className}>{text}</span>
  }

  const before = text.substring(0, matchStart)
  const highlighted = text.substring(matchStart, matchEnd)
  const after = text.substring(matchEnd)

  return (
    <span className={className}>
      {before}
      <mark className="bg-yellow-300 dark:bg-yellow-600 font-semibold">
        {highlighted}
      </mark>
      {after}
    </span>
  )
}
