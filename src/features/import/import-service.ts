import { VBAFile, VBAFileType } from '@/types/index'
import { useProjectStore } from '@/store/project-store'

const SUPPORTED_EXTENSIONS = new Set([
  '.bas',
  '.cls',
  '.frm',
  '.xlsm',
  '.xls',
  '.xlsx',
  '.txt',
  '.csv',
])

function getFileType(filename: string): VBAFileType | null {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'))
  if (SUPPORTED_EXTENSIONS.has(ext)) {
    return ext.replace('.', '') as VBAFileType
  }
  return null
}

async function readFileContent(fileHandle: any): Promise<string> {
  const file = await fileHandle.getFile()
  const text = await file.text()
  return text
}

async function walkDirectory(
  dirHandle: any,
  files: VBAFile[] = [],
  path = ''
): Promise<VBAFile[]> {
  try {
    // @ts-ignore - File System Access API types
    for await (const entry of dirHandle.values()) {
      const entryPath = path ? `${path}/${entry.name}` : entry.name

      if (entry.kind === 'file') {
        const fileType = getFileType(entry.name)
        if (fileType) {
          try {
            const content = await readFileContent(entry)
            const vbaFile: VBAFile = {
              id: `file_${Math.random().toString(36).substr(2, 9)}`,
              name: entry.name,
              path: entryPath,
              type: fileType,
              content,
              createdAt: new Date(),
              modifiedAt: new Date(),
            }
            files.push(vbaFile)
          } catch (error) {
            console.warn(`Failed to read file ${entryPath}:`, error)
          }
        }
      } else if (entry.kind === 'directory') {
        // Skip common directories
        const skipDirs = ['node_modules', '.git', '.venv', '__pycache__', '.next', 'dist', 'build']
        if (!skipDirs.includes(entry.name)) {
          await walkDirectory(entry, files, entryPath)
        }
      }
    }
  } catch (error) {
    console.error('Error walking directory:', error)
  }

  return files
}

export async function importProjectFromFolder(dirHandle: any): Promise<{
  success: boolean
  filesRead?: number
  filesSkipped?: number
  error?: string
}> {
  try {
    // Get all files from directory
    const files = await walkDirectory(dirHandle)

    if (files.length === 0) {
      return {
        success: false,
        error: 'No supported VBA files found in the selected folder',
      }
    }

    // Update project store with files
    const { clear, addFile } = useProjectStore.getState()
    clear()

    files.forEach((file) => {
      addFile(file)
    })

    return {
      success: true,
      filesRead: files.length,
      filesSkipped: 0,
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to import project: ${(error as Error).message}`,
    }
  }
}

export function getFileTypeDisplayName(type: VBAFileType): string {
  const names: Record<VBAFileType, string> = {
    bas: 'VBA Module',
    cls: 'Class Module',
    frm: 'Form Module',
    xlsm: 'Excel Macro Workbook',
    xls: 'Excel Workbook',
    xlsx: 'Excel Workbook',
    txt: 'Text File',
    csv: 'CSV File',
  }
  return names[type] || type.toUpperCase()
}

export function getFileTypeIcon(type: VBAFileType): string {
  const icons: Record<VBAFileType, string> = {
    bas: '📄',
    cls: '🏗️',
    frm: '📋',
    xlsm: '📊',
    xls: '📊',
    xlsx: '📊',
    txt: '📝',
    csv: '🗂️',
  }
  return icons[type] || '📄'
}
