'use client'

import React, { useMemo, useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { VBAFile } from '@/types/index'

interface XMLViewerProps {
  file: VBAFile | null
}

function XMLTree({
  node,
  level = 0,
}: {
  node: Element
  level?: number
}): React.ReactNode {
  const [expanded, setExpanded] = useState(level < 2)
  const hasChildren = node.children.length > 0
  const text = node.textContent?.trim()

  return (
    <div>
      <div
        className="flex items-center gap-1 cursor-pointer hover:bg-muted/30 rounded px-1"
        onClick={() => setExpanded(!expanded)}
      >
        {hasChildren && (
          <>
            {expanded ? (
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            )}
          </>
        )}
        {!hasChildren && <div className="w-4 flex-shrink-0" />}

        <span className="text-blue-500 font-mono text-sm">&lt;{node.tagName}</span>

        {Array.from(node.attributes || []).map((attr) => (
          <span key={attr.name} className="text-green-500 text-xs font-mono ml-1">
            {attr.name}="<span className="text-amber-500">{attr.value}</span>"
          </span>
        ))}

        <span className="text-blue-500 font-mono text-sm">
          {hasChildren ? ' ...' : ' /'}
          &gt;
        </span>
      </div>

      {expanded && hasChildren && (
        <div className="ml-4 border-l border-border/50">
          {Array.from(node.children).map((child, idx) => (
            <div key={idx} className="py-1">
              <XMLTree node={child as Element} level={level + 1} />
            </div>
          ))}
          {text && !text.match(/^\s*$/) && (
            <div className="py-1 text-amber-500 text-xs font-mono">{text}</div>
          )}
        </div>
      )}
    </div>
  )
}

export function XMLViewer({ file }: XMLViewerProps) {
  const xmlRoot = useMemo(() => {
    if (!file) return null
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(file.content, 'application/xml')
      if (doc.getElementsByTagName('parsererror').length > 0) {
        return null
      }
      return doc.documentElement
    } catch {
      return null
    }
  }, [file])

  if (!file) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-card text-muted-foreground">
        <p className="text-sm">Select a file to view</p>
      </div>
    )
  }

  if (!xmlRoot) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-card text-muted-foreground">
        <p className="text-sm">Invalid XML</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full overflow-auto p-4 bg-background font-mono text-sm">
      <XMLTree node={xmlRoot} />
    </div>
  )
}
