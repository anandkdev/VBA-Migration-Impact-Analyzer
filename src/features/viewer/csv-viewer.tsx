'use client'

import React, { useMemo, useState } from 'react'
import { VBAFile } from '@/types/index'

interface CSVViewerProps {
  file: VBAFile | null
}

export function CSVViewer({ file }: CSVViewerProps) {
  const [pageSize] = useState(50)
  const [page, setPage] = useState(0)

  const { rows, headers } = useMemo(() => {
    if (!file) return { rows: [], headers: [] }

    const lines = file.content.split('\n').filter((line) => line.trim())
    if (lines.length === 0) return { rows: [], headers: [] }

    // Simple CSV parser (handles basic cases, not RFC 4180 edge cases)
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = []
      let current = ''
      let inQuotes = false

      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }

      result.push(current.trim())
      return result
    }

    const headers = parseCSVLine(lines[0])
    const rows = lines.slice(1).map((line) => parseCSVLine(line))

    return { rows, headers }
  }, [file])

  if (!file) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-card text-muted-foreground">
        <p className="text-sm">Select a file to view</p>
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-card text-muted-foreground">
        <p className="text-sm">No data to display</p>
      </div>
    )
  }

  const paginatedRows = rows.slice(page * pageSize, (page + 1) * pageSize)
  const totalPages = Math.ceil(rows.length / pageSize)

  return (
    <div className="w-full h-full flex flex-col bg-background">
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-card/70 font-semibold">
            <tr>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="border border-border px-3 py-2 text-left whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-muted/50">
                {row.map((cell, colIdx) => (
                  <td key={colIdx} className="border border-border px-3 py-2 text-xs whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-border bg-card/50 text-xs text-muted-foreground flex items-center justify-between">
        <span>
          Row {page * pageSize + 1} to {Math.min((page + 1) * pageSize, rows.length)} of {rows.length}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage(Math.max(0, page - 1))}
            className="px-2 py-1 rounded hover:bg-muted disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page === totalPages - 1}
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            className="px-2 py-1 rounded hover:bg-muted disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
