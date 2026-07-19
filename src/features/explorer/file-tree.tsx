'use client'

import React, { useState } from 'react'
import { ChevronRight, ChevronDown, FileCode2, Folder } from 'lucide-react'
import { VBAFile } from '@/types/index'
import { cn } from '@/lib/utils'

interface FileTreeNode {
  type: 'folder' | 'file'
  name: string
  path: string
  children?: FileTreeNode[]
  file?: VBAFile
}

interface FileTreeProps {
  files: VBAFile[]
  onSelectFile: (file: VBAFile) => void
  selectedFileId?: string
}

function buildFileTree(files: VBAFile[]): FileTreeNode[] {
  const root: Record<string, FileTreeNode> = {}

  files.forEach((file) => {
    const parts = file.path.split('/')
    let current = root

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1
      const key = part

      if (!current[key]) {
        current[key] = {
          type: isFile ? 'file' : 'folder',
          name: part,
          path: parts.slice(0, index + 1).join('/'),
          ...(isFile && { file }),
        }
      }

      if (!isFile) {
        if (!current[key].children) {
          current[key].children = []
        }
        current = current[key].children.reduce(
          (acc, child) => ({ ...acc, [child.name]: child }),
          {}
        )
      }
    })
  })

  return Object.values(root).sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}

function FileTreeItem({
  node,
  level = 0,
  onSelectFile,
  selectedFileId,
}: {
  node: FileTreeNode
  level?: number
  onSelectFile: (file: VBAFile) => void
  selectedFileId?: string
}) {
  const [isExpanded, setIsExpanded] = useState(level < 2)
  const isFile = node.type === 'file'

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-1.5 text-sm hover:bg-accent rounded cursor-pointer group',
          isFile &&
            node.file?.id === selectedFileId &&
            'bg-accent text-accent-foreground'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (isFile && node.file) {
            onSelectFile(node.file)
          } else {
            setIsExpanded(!isExpanded)
          }
        }}
      >
        {!isFile && node.children && (
          <button className="flex-shrink-0 p-0 hover:bg-muted rounded">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
        {!isFile && !node.children && <div className="w-4 flex-shrink-0" />}

        {isFile ? (
          <FileCode2 className="w-4 h-4 flex-shrink-0 text-blue-500" />
        ) : (
          <Folder className="w-4 h-4 flex-shrink-0 text-amber-500" />
        )}

        <span className="truncate">{node.name}</span>
      </div>

      {!isFile && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              level={level + 1}
              onSelectFile={onSelectFile}
              selectedFileId={selectedFileId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FileTree({
  files,
  onSelectFile,
  selectedFileId,
}: FileTreeProps) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
        <Folder className="w-8 h-8 opacity-50" />
        <p className="text-sm">No files imported yet</p>
        <p className="text-xs">Use the "Import Project" button to get started</p>
      </div>
    )
  }

  const tree = buildFileTree(files)

  return (
    <div className="text-sm">
      {tree.map((node) => (
        <FileTreeItem
          key={node.path}
          node={node}
          onSelectFile={onSelectFile}
          selectedFileId={selectedFileId}
        />
      ))}
    </div>
  )
}
