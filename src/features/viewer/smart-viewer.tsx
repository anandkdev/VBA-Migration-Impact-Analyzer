'use client'

import React from 'react'
import { VBAFile } from '@/types/index'
import { MonacoViewer } from './monaco-viewer'
import { ExcelViewer } from './excel-viewer'
import { CSVViewer } from './csv-viewer'
import { JSONViewer } from './json-viewer'
import { XMLViewer } from './xml-viewer'
import { ImageViewer } from './image-viewer'
import { PDFViewer } from './pdf-viewer'

interface SmartViewerProps {
  file: VBAFile | null
}

export function SmartViewer({ file }: SmartViewerProps) {
  if (!file) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-card text-muted-foreground">
        <p className="text-sm">Select a file to view</p>
      </div>
    )
  }

  switch (file.type) {
    // VBA code files
    case 'bas':
    case 'cls':
    case 'frm':
    case 'txt':
    case 'sql':
      return <MonacoViewer file={file} />

    // Excel files
    case 'xlsm':
    case 'xls':
    case 'xlsx':
      return <ExcelViewer file={file} />

    // CSV
    case 'csv':
      return <CSVViewer file={file} />

    // JSON
    case 'json':
      return <JSONViewer file={file} />

    // XML
    case 'xml':
      return <XMLViewer file={file} />

    // Images
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return <ImageViewer file={file} />

    // PDF
    case 'pdf':
      return <PDFViewer file={file} />

    default:
      return (
        <div className="w-full h-full flex items-center justify-center bg-card text-muted-foreground">
          <p className="text-sm">Unsupported file type: {file.type}</p>
        </div>
      )
  }
}
