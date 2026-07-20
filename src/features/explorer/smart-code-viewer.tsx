'use client'

import React, { useRef } from 'react'
import { VBAFile } from '@/types/index'
import { getFileTypeDisplayName } from '@/features/import/import-service'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSmartScroll } from '@/hooks/use-smart-scroll'
import { cn } from '@/lib/utils'

interface SmartCodeViewerProps {
  file: VBAFile
  lines: string[]
  activeLineNumber?: number | null
}

/**
 * Smart code viewer with:
 * - Auto-scrolling to active line
 * - Line highlighting
 * - Text search highlighting (optional)
 */
export function SmartCodeViewer({
  file,
  lines,
  activeLineNumber,
}: SmartCodeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Smart scroll to active line
  useSmartScroll(activeLineNumber ?? null, containerRef)

  return (
    <ScrollArea horizontal className="h-full bg-background rounded-md border border-border" ref={containerRef}>
      <div className="flex flex-col min-w-max">
        <pre className="p-4 text-xs font-mono text-foreground">
          {lines.map((line, index) => {
            const lineNum = index + 1
            const isActive = lineNum === activeLineNumber

            return (
              <div
                key={index}
                data-line={lineNum}
                className={cn(
                  'flex',
                  isActive && 'bg-yellow-200/20 dark:bg-yellow-900/30 border-l-2 border-l-yellow-500'
                )}
              >
                <span className="mr-4 text-muted-foreground select-none inline-block w-12 text-right pr-2">
                  {lineNum}
                </span>
                <code className="flex-1 whitespace-pre">
                  {line}
                </code>
              </div>
            )
          })}
        </pre>
      </div>

      {/* File Footer */}
      <div className="border-t border-border bg-card/50 px-4 py-2 text-xs text-muted-foreground sticky bottom-0">
        <p>
          {getFileTypeDisplayName(file.type)} • {file.content.length} bytes •{' '}
          {lines.length} lines
        </p>
      </div>
    </ScrollArea>
  )
}
