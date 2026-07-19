'use client'

import React, { useMemo, useState } from 'react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import { VBAFile, Procedure } from '@/types/index'
import { getFileTypeIcon, getFileTypeDisplayName } from '@/features/import/import-service'
import { parseVBACode } from '@/features/parser/vba-parser'
import { ProcedureOutline } from '@/features/parser/procedure-outline'
import { ScrollArea } from '@/components/ui/scroll-area'

interface CodeViewerProps {
  file: VBAFile | null
}

export function CodeViewer({ file }: CodeViewerProps) {
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null)

  const { lines, parsedModule } = useMemo(() => {
    if (!file) {
      return { lines: [], parsedModule: null }
    }

    const fileLines = file.content.split('\n')

    // Only parse VBA files
    if (['bas', 'cls', 'frm'].includes(file.type)) {
      const module = parseVBACode(file.content, file.id)
      return { lines: fileLines, parsedModule: module }
    }

    return { lines: fileLines, parsedModule: null }
  }, [file])

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <p className="text-sm mb-2">Select a file to view its contents</p>
          <p className="text-xs">Click on a file in the explorer</p>
        </div>
      </div>
    )
  }

  // Show procedure outline for VBA files
  if (parsedModule && parsedModule.procedures.length > 0) {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* File Header */}
        <div className="sticky top-0 border-b border-border bg-card/50 backdrop-blur px-4 py-3 z-10">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getFileTypeIcon(file.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {file.path}
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              {lines.length} lines • {parsedModule.procedures.length} procedures
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <PanelGroup direction="horizontal">
            {/* Procedure Outline */}
            <Panel defaultSize={20} minSize={15} maxSize={30} className="border-r border-border">
              <div className="h-full flex flex-col">
                <div className="px-4 py-2 border-b border-border bg-card/50 text-xs font-semibold">
                  Outline
                </div>
                <div className="flex-1 overflow-hidden">
                  <ProcedureOutline
                    module={parsedModule}
                    onSelectProcedure={setSelectedProcedure}
                    selectedProcedureName={selectedProcedure?.name}
                  />
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />

            {/* Code */}
            <Panel defaultSize={80} minSize={70}>
              <CodeContent
                file={file}
                lines={lines}
                selectedProcedure={selectedProcedure}
              />
            </Panel>
          </PanelGroup>
        </div>
      </div>
    )
  }

  // Default view for non-VBA files
  return (
    <ScrollArea className="h-full">
      <div className="h-full flex flex-col bg-background">
        {/* File Header */}
        <div className="sticky top-0 border-b border-border bg-card/50 backdrop-blur px-4 py-3 z-10">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getFileTypeIcon(file.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {file.path}
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              {lines.length} lines
            </div>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-hidden">
          <pre className="p-4 text-xs font-mono text-foreground">
            {lines.map((line, index) => (
              <div key={index} className="flex">
                <div className="mr-4 text-muted-foreground select-none sticky left-0 w-12 text-right pr-2">
                  {index + 1}
                </div>
                <code className="flex-1 break-words whitespace-pre-wrap">
                  {line}
                </code>
              </div>
            ))}
          </pre>
        </div>

        {/* File Footer */}
        <div className="border-t border-border bg-card/50 px-4 py-2 text-xs text-muted-foreground">
          <p>
            {getFileTypeDisplayName(file.type)} • {file.content.length} bytes
          </p>
        </div>
      </div>
    </ScrollArea>
  )
}

interface CodeContentProps {
  file: VBAFile
  lines: string[]
  selectedProcedure: Procedure | null
}

function CodeContent({ file, lines, selectedProcedure }: CodeContentProps) {
  // Highlight selected procedure lines
  const highlightStart = selectedProcedure?.startLine || 0
  const highlightEnd = selectedProcedure?.endLine || 0

  return (
    <ScrollArea className="h-full">
      <div className="h-full flex flex-col bg-background">
        {/* Code Content */}
        <div className="flex-1 overflow-hidden">
          <pre className="p-4 text-xs font-mono text-foreground">
            {lines.map((line, index) => {
              const lineNum = index + 1
              const isHighlighted =
                lineNum >= highlightStart && lineNum <= highlightEnd

              return (
                <div
                  key={index}
                  className={isHighlighted ? 'bg-primary/10' : ''}
                >
                  <span className="mr-4 text-muted-foreground select-none inline-block w-12 text-right pr-2">
                    {lineNum}
                  </span>
                  <code className="break-words whitespace-pre-wrap">
                    {line}
                  </code>
                </div>
              )
            })}
          </pre>
        </div>

        {/* File Footer */}
        <div className="border-t border-border bg-card/50 px-4 py-2 text-xs text-muted-foreground">
          <p>
            {getFileTypeDisplayName(file.type)} • {file.content.length} bytes
          </p>
        </div>
      </div>
    </ScrollArea>
  )
}
