import { ReportData } from '@/features/reports/report-service'

/**
 * Generate HTML report from report data
 */
export function generateHTMLReport(data: ReportData): string {
  const severityColors = {
    High: '#dc2626',
    Medium: '#d97706',
    Low: '#16a34a',
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VBA Migration Impact Analysis Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: #ffffff;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        header {
            border-bottom: 2px solid #e5e7eb;
            margin-bottom: 40px;
            padding-bottom: 20px;
        }
        h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
            color: #111827;
        }
        .meta {
            font-size: 14px;
            color: #6b7280;
            display: flex;
            gap: 20px;
        }
        h2 {
            font-size: 24px;
            font-weight: 600;
            margin-top: 40px;
            margin-bottom: 20px;
            color: #111827;
            border-left: 4px solid #3b82f6;
            padding-left: 12px;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .summary-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            background: #f9fafb;
        }
        .summary-card h3 {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6b7280;
            margin-bottom: 8px;
        }
        .summary-card .value {
            font-size: 32px;
            font-weight: 700;
            color: #3b82f6;
        }
        .impact-summary {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }
        .severity-card {
            border-left: 4px solid;
            border-radius: 8px;
            padding: 20px;
            background: #f9fafb;
        }
        .severity-card.high {
            border-left-color: ${severityColors.High};
        }
        .severity-card.medium {
            border-left-color: ${severityColors.Medium};
        }
        .severity-card.low {
            border-left-color: ${severityColors.Low};
        }
        .severity-card h3 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .severity-card .count {
            font-size: 28px;
            font-weight: 700;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
        }
        th {
            background: #f3f4f6;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #e5e7eb;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6b7280;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        tr:hover {
            background: #f9fafb;
        }
        .severity-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .severity-badge.high {
            background: #fee2e2;
            color: ${severityColors.High};
        }
        .severity-badge.medium {
            background: #fef3c7;
            color: ${severityColors.Medium};
        }
        .severity-badge.low {
            background: #dcfce7;
            color: ${severityColors.Low};
        }
        .recommendation {
            background: #f0f9ff;
            border-left: 4px solid #0ea5e9;
            padding: 16px;
            border-radius: 4px;
            margin: 8px 0;
            font-size: 14px;
        }
        .recommendation strong {
            display: block;
            margin-bottom: 6px;
            color: #0369a1;
        }
        footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }
        .page-break {
            page-break-after: always;
            margin: 40px 0;
        }
        @media print {
            body {
                background: white;
            }
            .container {
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>VBA Migration Impact Analysis Report</h1>
            <div class="meta">
                <div><strong>Project:</strong> ${escapeHtml(data.projectName)}</div>
                <div><strong>Generated:</strong> ${data.generatedDate}</div>
            </div>
        </header>

        <!-- Summary Section -->
        <h2>Project Summary</h2>
        <div class="summary-grid">
            <div class="summary-card">
                <h3>Total Files</h3>
                <div class="value">${data.summary.totalFiles}</div>
            </div>
            <div class="summary-card">
                <h3>Modules</h3>
                <div class="value">${data.summary.totalModules}</div>
            </div>
            <div class="summary-card">
                <h3>Procedures</h3>
                <div class="value">${data.summary.totalProcedures}</div>
            </div>
            <div class="summary-card">
                <h3>Variables</h3>
                <div class="value">${data.summary.totalVariables}</div>
            </div>
        </div>

        ${
          data.impactAnalysis
            ? `
        <div class="page-break"></div>

        <!-- Impact Analysis Section -->
        <h2>Impact Analysis: ${escapeHtml(data.impactAnalysis.fieldName)}</h2>

        <div class="impact-summary">
            <div class="severity-card high">
                <h3>High Severity</h3>
                <div class="count">${data.impactAnalysis.highCount}</div>
            </div>
            <div class="severity-card medium">
                <h3>Medium Severity</h3>
                <div class="count">${data.impactAnalysis.mediumCount}</div>
            </div>
            <div class="severity-card low">
                <h3>Low Severity</h3>
                <div class="count">${data.impactAnalysis.lowCount}</div>
            </div>
        </div>

        <h2>Impact Results</h2>
        <table>
            <thead>
                <tr>
                    <th>Severity</th>
                    <th>Item Name</th>
                    <th>Type</th>
                    <th>Business Area</th>
                    <th>Technical Area</th>
                    <th>Location</th>
                </tr>
            </thead>
            <tbody>
                ${data.impactAnalysis.results
                  .map(
                    (result) => `
                    <tr>
                        <td><span class="severity-badge ${result.severity.toLowerCase()}">${result.severity}</span></td>
                        <td><strong>${escapeHtml(result.itemName)}</strong></td>
                        <td>${escapeHtml(result.itemType)}</td>
                        <td>${escapeHtml(result.businessArea)}</td>
                        <td>${escapeHtml(result.technicalArea)}</td>
                        <td>${escapeHtml(result.fileName)}:${result.lineNumber}</td>
                    </tr>
                `
                  )
                  .join('')}
            </tbody>
        </table>

        <h2>Details & Recommendations</h2>
        ${data.impactAnalysis.results
          .slice(0, 10)
          .map(
            (result) => `
            <div style="margin-bottom: 30px;">
                <h3 style="margin-bottom: 10px;">${escapeHtml(result.itemName)} (${result.severity})</h3>
                <p><strong>Reason:</strong> ${escapeHtml(result.reason)}</p>
                <div class="recommendation">
                    <strong>Recommendation:</strong>
                    ${escapeHtml(result.recommendation)}
                </div>
            </div>
        `
          )
          .join('')}
        ${
          data.impactAnalysis.results.length > 10
            ? `<p style="color: #6b7280; font-style: italic;">... and ${data.impactAnalysis.results.length - 10} more items. See detailed report for complete list.</p>`
            : ''
        }
        `
            : ''
        }

        <footer>
            <p>VBA Migration Impact Analyzer | Report generated automatically</p>
        </footer>
    </div>
</body>
</html>`
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}
