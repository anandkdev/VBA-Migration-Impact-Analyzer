import { VBAFile, VBAFileType } from '@/types/index'
import { useProjectStore } from '@/store/project-store'
import * as XLSX from 'xlsx'

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

const EXCEL_EXTENSIONS = new Set(['.xlsm', '.xls', '.xlsx'])

function getFileType(filename: string): VBAFileType | null {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'))
  if (SUPPORTED_EXTENSIONS.has(ext)) {
    return ext.replace('.', '') as VBAFileType
  }
  return null
}

async function readFileContent(fileHandle: any): Promise<string> {
  const file = await fileHandle.getFile()
  const ext = fileHandle.name.toLowerCase().slice(fileHandle.name.lastIndexOf('.'))

  // Handle Excel files specially - extract sheet content
  if (EXCEL_EXTENSIONS.has(ext)) {
    return await readExcelContent(file)
  }

  // Handle text files
  const text = await file.text()
  return text
}

/**
 * Extract readable content from Excel files
 * Includes sheet names and cell content
 */
async function readExcelContent(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })

    const content: string[] = []
    content.push(`File: ${file.name}`)
    content.push(`Sheets: ${workbook.SheetNames.join(', ')}`)
    content.push('='.repeat(80))
    content.push('')

    // Extract content from all sheets
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName]
      const csvContent = XLSX.utils.sheet_to_csv(worksheet)
      content.push(`Sheet: ${sheetName}`)
      content.push('-'.repeat(80))
      content.push(csvContent)
      content.push('')
    })

    return content.join('\n')
  } catch (error) {
    console.warn('Failed to parse Excel file as XLSX, treating as binary:', error)
    return `[Binary Excel File: ${file.name}]\n[Note: This file contains binary data that cannot be fully displayed as text]\n[File size: ${(file.size / 1024).toFixed(2)} KB]`
  }
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
            // Handle Excel files specially - extract sheets as separate files
            if (EXCEL_EXTENSIONS.has(`.${fileType}`)) {
              const excelSheets = await readExcelSheets(entry, entryPath)
              files.push(...excelSheets)
            } else {
              // Handle regular text files
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
            }
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

/**
 * Extract each sheet from an Excel file as a separate file
 */
async function readExcelSheets(fileHandle: any, filePath: string): Promise<VBAFile[]> {
  const sheets: VBAFile[] = []
  try {
    const file = await fileHandle.getFile()
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    const fileType = getFileType(fileHandle.name) || 'xlsx'

    // Create a separate file for each sheet
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName]
      const csvContent = XLSX.utils.sheet_to_csv(worksheet)

      const vbaFile: VBAFile = {
        id: `file_${Math.random().toString(36).substr(2, 9)}`,
        name: `${sheetName}`,
        path: `${filePath} > ${sheetName}`,
        type: fileType as VBAFileType,
        content: csvContent,
        createdAt: new Date(),
        modifiedAt: new Date(),
        sourceFile: fileHandle.name, // Track original Excel file
        sourceSheet: sheetName, // Track which sheet this is from
      }
      sheets.push(vbaFile)
    })

    return sheets
  } catch (error) {
    console.error(`Failed to read Excel sheets from ${filePath}:`, error)
    return []
  }
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

/**
 * Import individual files selected by user
 */
export async function importFilesFromSelection(fileHandles: any[]): Promise<{
  success: boolean
  filesRead?: number
  filesSkipped?: number
  error?: string
}> {
  try {
    const files: VBAFile[] = []
    let skipped = 0

    // Process each selected file
    for (const fileHandle of fileHandles) {
      const fileType = getFileType(fileHandle.name)

      if (fileType) {
        try {
          // Handle Excel files specially - extract sheets as separate files
          if (EXCEL_EXTENSIONS.has(`.${fileType}`)) {
            const excelSheets = await readExcelSheets(fileHandle, fileHandle.name)
            files.push(...excelSheets)
          } else {
            // Handle regular text files
            const content = await readFileContent(fileHandle)
            const vbaFile: VBAFile = {
              id: `file_${Math.random().toString(36).substr(2, 9)}`,
              name: fileHandle.name,
              path: fileHandle.name,
              type: fileType,
              content,
              createdAt: new Date(),
              modifiedAt: new Date(),
            }
            files.push(vbaFile)
          }
        } catch (error) {
          console.warn(`Failed to read file ${fileHandle.name}:`, error)
          skipped++
        }
      } else {
        skipped++
      }
    }

    if (files.length === 0) {
      return {
        success: false,
        error: 'No supported files found in selection',
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
      filesSkipped: skipped,
    }
  } catch (error) {
    return {
      success: false,
      error: `Failed to import files: ${(error as Error).message}`,
    }
  }
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
