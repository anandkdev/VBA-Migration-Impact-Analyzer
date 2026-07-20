import { useProjectStore } from '@/store/project-store'
import { ImpactResult } from '@/features/analysis/impact-service'

export interface ReportData {
  projectName: string
  generatedDate: string
  summary: {
    totalFiles: number
    totalModules: number
    totalProcedures: number
    totalVariables: number
  }
  impactAnalysis: {
    fieldName: string
    results: ImpactResult[]
    highCount: number
    mediumCount: number
    lowCount: number
  } | null
  statistics: {
    byType: Record<string, number>
    byArea: Record<string, number>
    bySeverity: Record<string, number>
  } | null
}

/**
 * Collect data for report generation
 */
export function collectReportData(
  impactResults?: ImpactResult[],
  fieldName?: string
): ReportData {
  const { projectName, files, modules } = useProjectStore.getState()

  const procedures = modules.flatMap((m) => m.procedures)
  const variables = modules.flatMap((m) => m.variables)

  const reportData: ReportData = {
    projectName: projectName || 'VBA Project',
    generatedDate: new Date().toLocaleString(),
    summary: {
      totalFiles: files.length,
      totalModules: modules.length,
      totalProcedures: procedures.length,
      totalVariables: variables.length,
    },
    impactAnalysis: null,
    statistics: null,
  }

  if (impactResults && impactResults.length > 0) {
    const highCount = impactResults.filter((r) => r.severity === 'High').length
    const mediumCount = impactResults.filter((r) => r.severity === 'Medium').length
    const lowCount = impactResults.filter((r) => r.severity === 'Low').length

    const byType: Record<string, number> = {}
    const byArea: Record<string, number> = {}
    const bySeverity: Record<string, number> = {
      High: highCount,
      Medium: mediumCount,
      Low: lowCount,
    }

    impactResults.forEach((result) => {
      byType[result.itemType] = (byType[result.itemType] || 0) + 1
      byArea[result.businessArea] = (byArea[result.businessArea] || 0) + 1
    })

    reportData.impactAnalysis = {
      fieldName: fieldName || 'Unknown Field',
      results: impactResults,
      highCount,
      mediumCount,
      lowCount,
    }

    reportData.statistics = {
      byType,
      byArea,
      bySeverity,
    }
  }

  return reportData
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(format: string, fieldName?: string): string {
  const timestamp = new Date().toISOString().slice(0, 10)
  const name = fieldName ? `${fieldName.replace(/\s+/g, '-')}-` : ''
  return `vba-analysis-${name}${timestamp}.${format}`
}

/**
 * Format severity for display
 */
export function formatSeverity(severity: string): {
  label: string
  color: string
  bgColor: string
} {
  switch (severity) {
    case 'High':
      return {
        label: 'HIGH',
        color: '#dc2626',
        bgColor: '#fee2e2',
      }
    case 'Medium':
      return {
        label: 'MEDIUM',
        color: '#d97706',
        bgColor: '#fef3c7',
      }
    case 'Low':
      return {
        label: 'LOW',
        color: '#16a34a',
        bgColor: '#dcfce7',
      }
    default:
      return {
        label: 'UNKNOWN',
        color: '#6b7280',
        bgColor: '#f3f4f6',
      }
  }
}

/**
 * Export data to JSON (for API)
 */
export function exportJSON(data: ReportData): string {
  return JSON.stringify(data, null, 2)
}

/**
 * Create downloadable blob
 */
export function createDownloadBlob(content: string, mimeType: string): Blob {
  return new Blob([content], { type: mimeType })
}

/**
 * Trigger file download
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
