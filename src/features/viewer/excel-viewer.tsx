'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { VBAFile } from '@/types/index'
import { Button } from '@/components/ui/button'

interface ExcelViewerProps {
  file: VBAFile | null
}

export function ExcelViewer({ file }: ExcelViewerProps) {
  const [activeSheetIndex, setActiveSheetIndex] = useState(0)

  if (!file || !file.sheetData || file.sheetData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-card text-muted-foreground">
        <p className="text-sm">No sheet data available</p>
      </div>
    )
  }

  const sheetData = file.sheetData
  const activeSheet = sheetData[activeSheetIndex]
  const rows = activeSheet?.rows || []

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Sheet Tabs */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card/50 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          disabled={activeSheetIndex === 0}
          onClick={() => setActiveSheetIndex(Math.max(0, activeSheetIndex - 1))}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex gap-1 flex-1 overflow-x-auto">
          {sheetData.map((sheet, idx) => (
            <button
              key={sheet.name}
              onClick={() => setActiveSheetIndex(idx)}
              className={`px-3 py-1 text-sm rounded whitespace-nowrap transition-colors ${
                idx === activeSheetIndex
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {sheet.name}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          disabled={activeSheetIndex === sheetData.length - 1}
          onClick={() => setActiveSheetIndex(Math.min(sheetData.length - 1, activeSheetIndex + 1))}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className={rowIdx === 0 ? 'bg-card/70 font-semibold sticky top-0' : ''}>
                {(Array.isArray(row) ? row : Object.values(row || {})).map((cell, colIdx) => (
                  <td
                    key={colIdx}
                    className="border border-border px-3 py-2 whitespace-nowrap text-xs"
                  >
                    {String(cell ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
