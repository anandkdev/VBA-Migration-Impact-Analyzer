'use client'

import React from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { FileMatchGroup } from '@/features/search/file-search-index'
import { SearchExportService } from '@/features/search/search-export-service'

interface ExportMenuProps {
  results: FileMatchGroup[]
  query: string
  disabled?: boolean
}

/**
 * Export menu for search results
 * Supports CSV, Excel, JSON, and plain text formats
 */
export function ExportMenu({ results, query, disabled = false }: ExportMenuProps) {
  const handleExport = (format: 'csv' | 'xlsx' | 'json' | 'txt') => {
    const sanitizedQuery = query.replace(/[/\\?%*:|"<>]/g, '_')

    switch (format) {
      case 'csv':
        SearchExportService.exportToCSV(results, sanitizedQuery)
        break
      case 'xlsx':
        SearchExportService.exportToExcel(results, sanitizedQuery)
        break
      case 'json':
        SearchExportService.exportToJSON(results, sanitizedQuery)
        break
      case 'txt':
        SearchExportService.exportToText(results, sanitizedQuery)
        break
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          title="Export search results"
        >
          <Download className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('xlsx')}>
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('json')}>
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('txt')}>
          Export as Text
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
