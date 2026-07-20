import { FileMatchGroup } from '@/features/search/file-search-index'
import * as XLSX from 'xlsx'

export type ExportFormat = 'csv' | 'xlsx' | 'json' | 'txt'

interface ExportRow {
  'Search Query': string
  File: string
  'Source File'?: string
  'Sheet Name'?: string
  'File Match Count': number
  'Line Number': number
  'Line Content': string
  'Match Position': string
}

interface ExcelExportRow extends ExportRow {
  'Matched Text': string
}

/**
 * Service for exporting search results in various formats
 */
export class SearchExportService {
  /**
   * Export search results to CSV
   */
  static exportToCSV(
    results: FileMatchGroup[],
    query: string,
    filename?: string
  ): void {
    const rows = this.prepareExportData(results, query)
    const csv = this.convertToCSV(rows)
    this.downloadFile(csv, filename || `search-results-${query}.csv`, 'text/csv')
  }

  /**
   * Export search results to Excel with formatting
   */
  static exportToExcel(
    results: FileMatchGroup[],
    query: string,
    filename?: string
  ): void {
    const rows = this.prepareExportDataWithMatchedText(results, query)
    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Search Results')

    // Set column widths
    worksheet['!cols'] = [
      { wch: 20 },
      { wch: 30 },
      { wch: 15 },
      { wch: 12 },
      { wch: 50 },
      { wch: 15 },
      { wch: 20 },
    ]

    // Apply styling to highlight matched text
    this.applyExcelHighlighting(worksheet, results)

    XLSX.writeFile(
      workbook,
      filename || `search-results-${query}.xlsx`
    )
  }

  /**
   * Export search results to JSON
   */
  static exportToJSON(
    results: FileMatchGroup[],
    query: string,
    filename?: string
  ): void {
    const data = {
      query,
      timestamp: new Date().toISOString(),
      totalFiles: results.length,
      totalMatches: results.reduce((sum, r) => sum + r.matches.length, 0),
      results: results.map((group) => {
        const fileObj: any = {
          id: group.file.id,
          name: group.file.name,
          path: group.file.path,
          type: group.file.type,
        }
        if (group.file.sourceFile) {
          fileObj.sourceFile = group.file.sourceFile
        }
        if (group.file.sourceSheet) {
          fileObj.sourceSheet = group.file.sourceSheet
        }
        return {
          file: fileObj,
          matchCount: group.matches.length,
          matches: group.matches.map((match) => ({
            id: match.id,
            lineNumber: match.lineNumber,
            lineContent: match.lineContent,
            matchStart: match.matchStart,
            matchEnd: match.matchEnd,
            matchedText: match.lineContent.substring(match.matchStart, match.matchEnd),
          })),
        }
      }),
    }

    const json = JSON.stringify(data, null, 2)
    this.downloadFile(json, filename || `search-results-${query}.json`, 'application/json')
  }

  /**
   * Export search results to plain text
   */
  static exportToText(
    results: FileMatchGroup[],
    query: string,
    filename?: string
  ): void {
    const lines: string[] = [
      `Search Results for: "${query}"`,
      `Exported on: ${new Date().toLocaleString()}`,
      `Total files: ${results.length}`,
      `Total matches: ${results.reduce((sum, r) => sum + r.matches.length, 0)}`,
      '',
      '='.repeat(80),
      '',
    ]

    results.forEach((group) => {
      lines.push(`File: ${group.file.path}`)
      if (group.file.sourceFile) {
        lines.push(`Source File: ${group.file.sourceFile}`)
      }
      if (group.file.sourceSheet) {
        lines.push(`Sheet Name: ${group.file.sourceSheet}`)
      }
      lines.push(`File Match Count: ${group.matches.length}`)
      lines.push('-'.repeat(80))

      group.matches.forEach((match) => {
        lines.push(`  Line ${match.lineNumber}: ${match.lineContent}`)
        lines.push(`  Matched Text: "${match.lineContent.substring(match.matchStart, match.matchEnd)}"`)
        lines.push('')
      })

      lines.push('')
    })

    const text = lines.join('\n')
    this.downloadFile(text, filename || `search-results-${query}.txt`, 'text/plain')
  }

  /**
   * Prepare data for export
   */
  private static prepareExportData(results: FileMatchGroup[], query?: string): ExportRow[] {
    const rows: ExportRow[] = []

    results.forEach((group) => {
      group.matches.forEach((match) => {
        const row: ExportRow = {
          'Search Query': query || '',
          File: group.file.path,
          'File Match Count': group.matches.length,
          'Line Number': match.lineNumber,
          'Line Content': match.lineContent,
          'Match Position': `${match.matchStart}-${match.matchEnd}`,
        }

        // Add source file and sheet info if available
        if (group.file.sourceFile) {
          row['Source File'] = group.file.sourceFile
        }
        if (group.file.sourceSheet) {
          row['Sheet Name'] = group.file.sourceSheet
        }

        rows.push(row)
      })
    })

    return rows
  }

  /**
   * Prepare data for Excel export with matched text column
   */
  private static prepareExportDataWithMatchedText(
    results: FileMatchGroup[],
    query: string
  ): ExcelExportRow[] {
    const rows: ExcelExportRow[] = []

    results.forEach((group) => {
      group.matches.forEach((match) => {
        const row: ExcelExportRow = {
          'Search Query': query,
          File: group.file.path,
          'File Match Count': group.matches.length,
          'Line Number': match.lineNumber,
          'Line Content': match.lineContent,
          'Match Position': `${match.matchStart}-${match.matchEnd}`,
          'Matched Text': match.lineContent.substring(match.matchStart, match.matchEnd),
        }

        // Add source file and sheet info if available
        if (group.file.sourceFile) {
          row['Source File'] = group.file.sourceFile
        }
        if (group.file.sourceSheet) {
          row['Sheet Name'] = group.file.sourceSheet
        }

        rows.push(row)
      })
    })

    return rows
  }

  /**
   * Convert data to CSV format
   */
  private static convertToCSV(rows: ExportRow[]): string {
    if (rows.length === 0) return ''

    const headers = Object.keys(rows[0])
    const csvHeaders = headers.map((h) => this.escapeCSV(h)).join(',')

    const csvRows = rows.map((row) =>
      headers.map((header) => this.escapeCSV(String(row[header as keyof ExportRow]))).join(',')
    )

    return [csvHeaders, ...csvRows].join('\n')
  }

  /**
   * Escape CSV values
   */
  private static escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`
    }
    return value
  }

  /**
   * Apply highlighting to Excel cells containing matched text
   */
  private static applyExcelHighlighting(
    worksheet: XLSX.WorkSheet,
    results: FileMatchGroup[]
  ): void {
    let rowIndex = 2 // Start from row 2 (row 1 is header)
    const highlightFill = { fgColor: { rgb: 'FFFF00' } } // Yellow background
    const highlightFont = { bold: true, color: { rgb: '000000' } } // Bold black text

    results.forEach((group) => {
      group.matches.forEach(() => {
        // Column G is "Matched Text" (7th column)
        const cellRef = XLSX.utils.encode_col(6) + rowIndex
        if (worksheet[cellRef]) {
          worksheet[cellRef].fill = highlightFill
          worksheet[cellRef].font = highlightFont
        }
        rowIndex++
      })
    })
  }

  /**
   * Trigger file download
   */
  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

