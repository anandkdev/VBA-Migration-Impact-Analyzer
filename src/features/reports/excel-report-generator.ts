import * as XLSX from 'xlsx'
import { ReportData } from '@/features/reports/report-service'

/**
 * Generate Excel report from report data
 */
export function generateExcelReport(data: ReportData): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new()

  // Summary sheet
  addSummarySheet(workbook, data)

  // Impact Analysis sheet (if available)
  if (data.impactAnalysis) {
    addImpactAnalysisSheet(workbook, data)
    addDetailsSheet(workbook, data)
    addStatisticsSheet(workbook, data)
  }

  return workbook
}

/**
 * Add Summary sheet to workbook
 */
function addSummarySheet(workbook: XLSX.WorkBook, data: ReportData): void {
  const summary = [
    ['VBA Migration Impact Analysis Report'],
    [],
    ['Project:', data.projectName],
    ['Generated:', data.generatedDate],
    [],
    ['Summary Statistics'],
    ['Metric', 'Count'],
    ['Total Files', data.summary.totalFiles],
    ['Total Modules', data.summary.totalModules],
    ['Total Procedures', data.summary.totalProcedures],
    ['Total Variables', data.summary.totalVariables],
  ]

  const ws = XLSX.utils.aoa_to_sheet(summary)

  // Set column widths
  ws['!cols'] = [{ wch: 25 }, { wch: 20 }]

  // Style header
  for (let i = 0; i < 2; i++) {
    const cell = ws[XLSX.utils.encode_cell({ r: i, c: 0 })]
    if (cell) {
      cell.s = {
        font: { bold: true, size: 14 },
        alignment: { horizontal: 'left', vertical: 'top' },
      }
    }
  }

  XLSX.utils.book_append_sheet(workbook, ws, 'Summary')
}

/**
 * Add Impact Analysis sheet to workbook
 */
function addImpactAnalysisSheet(workbook: XLSX.WorkBook, data: ReportData): void {
  if (!data.impactAnalysis) return

  const results = data.impactAnalysis.results.map((result) => [
    result.severity,
    result.itemName,
    result.itemType,
    result.businessArea,
    result.technicalArea,
    result.matchType,
    result.fileName,
    result.lineNumber,
  ])

  const sheet = [
    [
      'Severity',
      'Item Name',
      'Item Type',
      'Business Area',
      'Technical Area',
      'Match Type',
      'File Name',
      'Line Number',
    ],
    ...results,
  ]

  const ws = XLSX.utils.aoa_to_sheet(sheet)

  // Set column widths
  ws['!cols'] = [
    { wch: 12 },
    { wch: 20 },
    { wch: 15 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 25 },
    { wch: 12 },
  ]

  XLSX.utils.book_append_sheet(workbook, ws, 'Impact Analysis')
}

/**
 * Add Details sheet to workbook
 */
function addDetailsSheet(workbook: XLSX.WorkBook, data: ReportData): void {
  if (!data.impactAnalysis) return

  const details: any[] = []

  data.impactAnalysis.results.forEach((result, index) => {
    if (index > 0) {
      details.push([])
    }

    details.push(['Item Name:', result.itemName])
    details.push(['Severity:', result.severity])
    details.push(['Type:', result.itemType])
    details.push(['Business Area:', result.businessArea])
    details.push(['Technical Area:', result.technicalArea])
    details.push(['Match Type:', result.matchType])
    details.push(['Reason:', result.reason])
    details.push(['Recommendation:', result.recommendation])
    details.push(['Location:', `${result.fileName}:${result.lineNumber}`])
    details.push([
      'Context:',
      `${result.moduleName || 'N/A'} ${result.procedureName ? `> ${result.procedureName}` : ''}`,
    ])
  })

  const ws = XLSX.utils.aoa_to_sheet(details)

  // Set column widths
  ws['!cols'] = [{ wch: 20 }, { wch: 80 }]

  // Wrap text
  for (const key in ws) {
    if (key.startsWith('!')) continue
    if (ws[key].v) {
      ws[key].s = {
        alignment: { wrapText: true, vertical: 'top' },
      }
    }
  }

  XLSX.utils.book_append_sheet(workbook, ws, 'Details')
}

/**
 * Add Statistics sheet to workbook
 */
function addStatisticsSheet(workbook: XLSX.WorkBook, data: ReportData): void {
  if (!data.impactAnalysis || !data.statistics) return

  const stats: any[] = [
    ['Impact Analysis Statistics'],
    [],
    ['Severity Breakdown'],
    ['Severity', 'Count', 'Percentage'],
    [
      'High',
      data.statistics.bySeverity['High'] || 0,
      `${(((data.statistics.bySeverity['High'] || 0) / data.impactAnalysis.results.length) * 100).toFixed(1)}%`,
    ],
    [
      'Medium',
      data.statistics.bySeverity['Medium'] || 0,
      `${(((data.statistics.bySeverity['Medium'] || 0) / data.impactAnalysis.results.length) * 100).toFixed(1)}%`,
    ],
    [
      'Low',
      data.statistics.bySeverity['Low'] || 0,
      `${(((data.statistics.bySeverity['Low'] || 0) / data.impactAnalysis.results.length) * 100).toFixed(1)}%`,
    ],
    [],
    ['By Item Type'],
    ['Type', 'Count'],
    ...Object.entries(data.statistics.byType).map(([type, count]) => [type, count]),
    [],
    ['By Business Area'],
    ['Area', 'Count'],
    ...Object.entries(data.statistics.byArea).map(([area, count]) => [area, count]),
  ]

  const ws = XLSX.utils.aoa_to_sheet(stats)

  // Set column widths
  ws['!cols'] = [{ wch: 20 }, { wch: 12 }, { wch: 15 }]

  XLSX.utils.book_append_sheet(workbook, ws, 'Statistics')
}

/**
 * Write workbook to file
 */
export function writeExcelFile(workbook: XLSX.WorkBook, filename: string): void {
  XLSX.writeFile(workbook, filename)
}
