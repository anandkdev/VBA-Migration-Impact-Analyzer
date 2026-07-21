'use client'

import React from 'react'
import { useExplorerStore } from '@/store/explorer-store'
import { useProjectStore } from '@/store/project-store'
import { EmptyState } from '@/utils/empty-states'
import { CodeViewer } from '@/features/viewer/code-viewer'
import { TableViewer } from '@/features/viewer/table-viewer'
import { ImageViewer } from '@/features/viewer/image-viewer'
import { FormPreview } from '@/features/viewer/form-preview'

export function SmartViewer() {
  const selectedFileId = useExplorerStore((state) => state.selectedFileId)
  const files = useProjectStore((state) => state.files)

  if (!selectedFileId) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <EmptyState
          icon="📁"
          title="No file selected"
          description="Select a file from the project explorer to view its contents."
          action={undefined}
        />
      </div>
    )
  }

  const file = files.find((f) => f.id === selectedFileId)

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <EmptyState
          icon="❌"
          title="File not found"
          description="The selected file could not be found."
          action={undefined}
        />
      </div>
    )
  }

  // Determine file type and render appropriate viewer
  const fileExt = file.name?.split('.').pop()?.toLowerCase()

  // VBA Code Files
  if (['bas', 'cls'].includes(fileExt || '')) {
    return <CodeViewer filePath={file.name} fileId={selectedFileId} />
  }

  // Excel Workbooks - show in tabbed layout
  if (['xlsm', 'xlsx', 'xls'].includes(fileExt || '')) {
    return <ExcelWorkbookViewer fileId={selectedFileId} />
  }

  // UserForms - Visual + Code
  if (fileExt === 'frm') {
    return (
      <div className="h-full flex flex-col">
        <FormPreview fileId={selectedFileId} />
        <div className="border-t border-border" />
        <CodeViewer filePath={file.name} fileId={selectedFileId} />
      </div>
    )
  }

  // CSV - Table only
  if (fileExt === 'csv') {
    return <TableViewer fileId={selectedFileId} />
  }

  // Images
  if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(fileExt || '')) {
    return <ImageViewer fileId={selectedFileId} />
  }

  // SQL, JSON, XML - Code with syntax highlighting
  if (['sql', 'json', 'xml'].includes(fileExt || '')) {
    return <CodeViewer filePath={file.name} fileId={selectedFileId} />
  }

  // Default: Code viewer
  return <CodeViewer filePath={file.name} fileId={selectedFileId} />
}

function ExcelWorkbookViewer({ fileId }: { fileId: string }) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'code'>('overview')
  const files = useProjectStore((state) => state.files)
  const file = files.find((f) => f.id === fileId)

  if (!file) return null

  return (
    <div className="h-full flex flex-col">
      {/* Tab Selector */}
      <div className="border-b border-border bg-card/50 flex gap-1 px-4 py-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            activeTab === 'overview'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted/50'
          }`}
        >
          Worksheets & Code
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            activeTab === 'code'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted/50'
          }`}
        >
          ThisWorkbook Code
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'overview' ? (
          <WorkbookOverview />
        ) : (
          <CodeViewer filePath={file.name} fileId={fileId} />
        )}
      </div>
    </div>
  )
}

function WorkbookOverview() {
  return (
    <div className="p-4">
      <div className="space-y-4">
        <section>
          <h3 className="text-sm font-semibold mb-2">Worksheets</h3>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>Worksheet preview and data summary coming soon</p>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold mb-2">VBA Code</h3>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>Code modules and forms within this workbook</p>
          </div>
        </section>
      </div>
    </div>
  )
}
