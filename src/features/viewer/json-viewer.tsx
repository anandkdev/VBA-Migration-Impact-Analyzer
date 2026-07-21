'use client'

import React, { useMemo, useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { VBAFile } from '@/types/index'

interface JSONViewerProps {
  file: VBAFile | null
}

function JSONTree({ data, level = 0 }: { data: any; level?: number }) {
  const [expanded, setExpanded] = useState(level < 2)
  const isObject = data !== null && typeof data === 'object'
  const isArray = Array.isArray(data)
  const isEmpty = isArray ? data.length === 0 : Object.keys(data).length === 0

  if (!isObject) {
    return (
      <span className="text-amber-500">
        {data === null ? 'null' : typeof data === 'string' ? `"${data}"` : String(data)}
      </span>
    )
  }

  return (
    <div>
      <div
        className="flex items-center gap-1 cursor-pointer hover:bg-muted/30 rounded px-1"
        onClick={() => setExpanded(!expanded)}
      >
        {!isEmpty && (
          <>
            {expanded ? (
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            )}
          </>
        )}
        {isEmpty && <div className="w-4 flex-shrink-0" />}
        <span className="text-blue-500 font-mono text-sm">
          {isArray ? '[ ]' : '{ }'}
        </span>
        {isEmpty && <span className="text-muted-foreground text-xs">(empty)</span>}
      </div>

      {expanded && !isEmpty && (
        <div className="ml-4 border-l border-border/50">
          {isArray
            ? (data as any[]).map((item, idx) => (
                <div key={idx} className="py-1">
                  <span className="text-muted-foreground text-xs">[{idx}]: </span>
                  <JSONTree data={item} level={level + 1} />
                </div>
              ))
            : Object.entries(data).map(([key, value]) => (
                <div key={key} className="py-1">
                  <span className="text-green-500 text-xs font-mono">"{key}"</span>
                  <span className="text-muted-foreground">: </span>
                  <JSONTree data={value} level={level + 1} />
                </div>
              ))}
        </div>
      )}
    </div>
  )
}

export function JSONViewer({ file }: JSONViewerProps) {
  const jsonData = useMemo(() => {
    if (!file) return null
    try {
      return JSON.parse(file.content)
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

  if (!jsonData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-card text-muted-foreground">
        <p className="text-sm">Invalid JSON</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full overflow-auto p-4 bg-background font-mono text-sm">
      <JSONTree data={jsonData} />
    </div>
  )
}
