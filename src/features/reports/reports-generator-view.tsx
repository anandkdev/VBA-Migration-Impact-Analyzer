'use client'

import React, { useState } from 'react'
import { FileText, Download, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  collectReportData,
  generateFilename,
  createDownloadBlob,
  downloadFile,
} from '@/features/reports/report-service'
import { generateHTMLReport } from '@/features/reports/html-report-generator'
import { generateExcelReport, writeExcelFile } from '@/features/reports/excel-report-generator'

interface ReportsGeneratorViewProps {
  impactResults?: any[]
  fieldName?: string
}

type ReportFormat = 'html' | 'excel'

export function ReportsGeneratorView({
  impactResults,
  fieldName,
}: ReportsGeneratorViewProps) {
  const [selectedFormats, setSelectedFormats] = useState<ReportFormat[]>(['html'])
  const [isGenerating, setIsGenerating] = useState(false)
  const [downloadedFiles, setDownloadedFiles] = useState<string[]>([])

  const handleFormatToggle = (format: ReportFormat) => {
    setSelectedFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    )
  }

  const handleGenerateReports = async () => {
    setIsGenerating(true)
    setDownloadedFiles([])

    try {
      const reportData = collectReportData(impactResults, fieldName)

      // Generate HTML report
      if (selectedFormats.includes('html')) {
        const htmlContent = generateHTMLReport(reportData)
        const filename = generateFilename('html', fieldName)
        const blob = createDownloadBlob(htmlContent, 'text/html')
        downloadFile(blob, filename)
        setDownloadedFiles((prev) => [...prev, filename])
      }

      // Generate Excel report
      if (selectedFormats.includes('excel')) {
        const excelWorkbook = generateExcelReport(reportData)
        const filename = generateFilename('xlsx', fieldName)
        writeExcelFile(excelWorkbook, filename)
        setDownloadedFiles((prev) => [...prev, filename])
      }

      // Simulate generation time for UX
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      console.error('Report generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold">Generate Reports</h2>
        </div>

        <p className="text-sm text-muted-foreground max-w-2xl">
          Export your VBA analysis results in multiple formats. Choose the formats you'd like to
          generate and download them all at once.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col p-6 space-y-6">
        {/* Format Selection */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Report Formats</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={selectedFormats.includes('html')}
                onChange={() => handleFormatToggle('html')}
                className="w-4 h-4 rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-sm">HTML Report</p>
                <p className="text-xs text-muted-foreground">
                  Professional styled report readable in any browser
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={selectedFormats.includes('excel')}
                onChange={() => handleFormatToggle('excel')}
                className="w-4 h-4 rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-sm">Excel Report</p>
                <p className="text-xs text-muted-foreground">
                  Multi-sheet workbook with statistics and detailed analysis
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Report Contents */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Report Contents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-lg border border-border bg-muted/50">
              <p className="font-medium text-sm mb-2">✓ Project Summary</p>
              <p className="text-xs text-muted-foreground">
                Files, modules, procedures, and variable counts
              </p>
            </div>

            {impactResults && impactResults.length > 0 && (
              <>
                <div className="p-4 rounded-lg border border-border bg-muted/50">
                  <p className="font-medium text-sm mb-2">✓ Impact Analysis</p>
                  <p className="text-xs text-muted-foreground">
                    All impact findings with severity levels
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border bg-muted/50">
                  <p className="font-medium text-sm mb-2">✓ Recommendations</p>
                  <p className="text-xs text-muted-foreground">
                    Specific actions for each impact item
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border bg-muted/50">
                  <p className="font-medium text-sm mb-2">✓ Statistics</p>
                  <p className="text-xs text-muted-foreground">
                    Breakdown by severity, type, and business area
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border bg-muted/50">
                  <p className="font-medium text-sm mb-2">✓ Dependency Data</p>
                  <p className="text-xs text-muted-foreground">
                    Location information for all findings
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info Box */}
        {!impactResults || impactResults.length === 0 ? (
          <div className="p-4 rounded-lg border border-yellow-500/50 bg-yellow-500/10 text-sm text-yellow-700 dark:text-yellow-400">
            <p className="font-medium mb-1">No Impact Analysis Results</p>
            <p>
              Run an impact analysis first to generate reports with findings. Currently, only the
              project summary will be included.
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-lg border border-blue-500/50 bg-blue-500/10 text-sm text-blue-700 dark:text-blue-400">
            <p className="font-medium mb-1">✓ Ready to Generate</p>
            <p>
              Your impact analysis ({impactResults.length} findings) will be included in all
              reports.
            </p>
          </div>
        )}

        {/* Downloaded Files */}
        {downloadedFiles.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Downloaded Files</h3>
            <div className="space-y-2">
              {downloadedFiles.map((filename) => (
                <div
                  key={filename}
                  className="flex items-center gap-3 p-3 rounded-lg border border-green-500/50 bg-green-500/10"
                >
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-green-700 dark:text-green-400 flex-1">
                    {filename}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card/50 p-6">
        <Button
          onClick={handleGenerateReports}
          disabled={isGenerating || selectedFormats.length === 0}
          className="gap-2 w-full sm:w-auto"
          size="lg"
        >
          <Download className="w-4 h-4" />
          {isGenerating ? 'Generating Reports...' : 'Generate & Download Reports'}
        </Button>
      </div>
    </div>
  )
}
