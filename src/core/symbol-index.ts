import { VBAFile, VBAModule } from '@/types/index'

export interface IndexedItem {
  id: string
  type: 'variable' | 'procedure' | 'module' | 'comment' | 'file' | 'constant' | 'enum' | 'type'
  name: string
  content: string
  fileId: string
  fileName: string
  moduleName?: string
  modulePath?: string
  procedureName?: string
  lineNumber: number
  scope?: string
}

export interface SearchIndex {
  items: IndexedItem[]
  lastUpdated: Date
  fileCount: number
}

export interface SearchOptions {
  caseSensitive: boolean
  wholeWord: boolean
  matchRegex: boolean
  ignoreComments: boolean
  objectTypes?: string[]
}

export function buildSymbolIndex(
  files: VBAFile[],
  modules: VBAModule[]
): SearchIndex {
  const items: IndexedItem[] = []

  // Index files
  files.forEach((file) => {
    items.push({
      id: file.id,
      type: 'file',
      name: file.name,
      content: file.content,
      fileId: file.id,
      fileName: file.name,
      lineNumber: 1,
    })
  })

  // Index modules and their contents
  modules.forEach((module) => {
    // Index module itself
    items.push({
      id: module.id,
      type: 'module',
      name: module.name,
      content: module.name,
      fileId: module.fileId || '',
      fileName: `${module.name}.${module.type === 'Class' ? 'cls' : module.type === 'Form' ? 'frm' : 'bas'}`,
      moduleName: module.name,
      modulePath: module.name,
      lineNumber: 1,
    })

    // Index procedures
    module.procedures.forEach((proc) => {
      items.push({
        id: proc.id,
        type: 'procedure',
        name: proc.name,
        content: `${proc.type} ${proc.name}`,
        fileId: module.fileId || '',
        fileName: `${module.name}.${module.type === 'Class' ? 'cls' : module.type === 'Form' ? 'frm' : 'bas'}`,
        moduleName: module.name,
        modulePath: module.name,
        procedureName: proc.name,
        lineNumber: proc.startLine,
        scope: proc.scope,
      })
    })

    // Index variables
    module.variables.forEach((variable) => {
      items.push({
        id: variable.id,
        type: 'variable',
        name: variable.name,
        content: `${variable.name} As ${variable.type}`,
        fileId: module.fileId || '',
        fileName: `${module.name}.${module.type === 'Class' ? 'cls' : module.type === 'Form' ? 'frm' : 'bas'}`,
        moduleName: module.name,
        modulePath: module.name,
        lineNumber: variable.lineNumber,
        scope: variable.scope,
      })
    })

    // Index constants
    module.constants.forEach((constant, index) => {
      items.push({
        id: `const_${module.id}_${index}`,
        type: 'constant',
        name: constant,
        content: constant,
        fileId: module.fileId || '',
        fileName: `${module.name}.${module.type === 'Class' ? 'cls' : module.type === 'Form' ? 'frm' : 'bas'}`,
        moduleName: module.name,
        modulePath: module.name,
        lineNumber: 1,
      })
    })

    // Index enums
    module.enums.forEach((enumName, index) => {
      items.push({
        id: `enum_${module.id}_${index}`,
        type: 'enum',
        name: enumName,
        content: enumName,
        fileId: module.fileId || '',
        fileName: `${module.name}.${module.type === 'Class' ? 'cls' : module.type === 'Form' ? 'frm' : 'bas'}`,
        moduleName: module.name,
        modulePath: module.name,
        lineNumber: 1,
      })
    })

    // Index types
    module.types.forEach((typeName, index) => {
      items.push({
        id: `type_${module.id}_${index}`,
        type: 'type',
        name: typeName,
        content: typeName,
        fileId: module.fileId || '',
        fileName: `${module.name}.${module.type === 'Class' ? 'cls' : module.type === 'Form' ? 'frm' : 'bas'}`,
        moduleName: module.name,
        modulePath: module.name,
        lineNumber: 1,
      })
    })

    // Index comments
    module.comments.forEach((comment, index) => {
      items.push({
        id: `comment_${module.id}_${index}`,
        type: 'comment',
        name: `Comment: ${comment.substring(0, 50)}...`,
        content: comment,
        fileId: module.fileId || '',
        fileName: `${module.name}.${module.type === 'Class' ? 'cls' : module.type === 'Form' ? 'frm' : 'bas'}`,
        moduleName: module.name,
        modulePath: module.name,
        lineNumber: 1,
      })
    })

    // Index procedure variables and comments
    module.procedures.forEach((proc) => {
      proc.variables.forEach((variable) => {
        items.push({
          id: `${proc.id}_${variable.id}`,
          type: 'variable',
          name: variable.name,
          content: `${variable.name} As ${variable.type}`,
          fileId: module.fileId || '',
          fileName: `${module.name}.${module.type === 'Class' ? 'cls' : module.type === 'Form' ? 'frm' : 'bas'}`,
          moduleName: module.name,
          modulePath: module.name,
          procedureName: proc.name,
          lineNumber: variable.lineNumber,
          scope: variable.scope,
        })
      })

      proc.comments.forEach((comment, index) => {
        items.push({
          id: `${proc.id}_comment_${index}`,
          type: 'comment',
          name: `Comment in ${proc.name}`,
          content: comment,
          fileId: module.fileId || '',
          fileName: `${module.name}.${module.type === 'Class' ? 'cls' : module.type === 'Form' ? 'frm' : 'bas'}`,
          moduleName: module.name,
          modulePath: module.name,
          procedureName: proc.name,
          lineNumber: proc.startLine,
        })
      })
    })
  })

  return {
    items,
    lastUpdated: new Date(),
    fileCount: files.length,
  }
}

export function searchSymbolIndex(
  index: SearchIndex,
  query: string,
  options: Partial<SearchOptions> = {}
): IndexedItem[] {
  const opts: SearchOptions = {
    caseSensitive: options.caseSensitive ?? false,
    wholeWord: options.wholeWord ?? false,
    matchRegex: options.matchRegex ?? false,
    ignoreComments: options.ignoreComments ?? true,
    objectTypes: options.objectTypes || [],
  }

  if (!query.trim()) {
    return []
  }

  const results: IndexedItem[] = []

  // Filter by type first
  const itemsToSearch = index.items.filter((item) => {
    if (opts.ignoreComments && item.type === 'comment') return false
    if (opts.objectTypes && opts.objectTypes.length > 0 && !opts.objectTypes.includes(item.type)) {
      return false
    }
    return true
  })

  // Build regex or string matcher
  let matcher: (text: string) => boolean

  if (opts.matchRegex) {
    try {
      const flags = opts.caseSensitive ? 'g' : 'gi'
      const regex = new RegExp(query, flags)
      matcher = (text) => regex.test(text)
    } catch (error) {
      // Invalid regex, fall back to string matching
      matcher = (text) =>
        opts.caseSensitive
          ? text.includes(query)
          : text.toLowerCase().includes(query.toLowerCase())
    }
  } else if (opts.wholeWord) {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const flags = opts.caseSensitive ? 'g' : 'gi'
    const regex = new RegExp(`\\b${escapedQuery}\\b`, flags)
    matcher = (text) => regex.test(text)
  } else {
    matcher = (text) =>
      opts.caseSensitive
        ? text.includes(query)
        : text.toLowerCase().includes(query.toLowerCase())
  }

  // Search through items
  itemsToSearch.forEach((item) => {
    const searchableContent = opts.caseSensitive
      ? item.name + ' ' + item.content
      : (item.name + ' ' + item.content).toLowerCase()

    if (matcher(searchableContent)) {
      results.push(item)
    }
  })

  // Sort results by relevance
  results.sort((a, b) => {
    // Exact name matches first
    const aNameMatch = a.name.toLowerCase() === query.toLowerCase() ? 1 : 0
    const bNameMatch = b.name.toLowerCase() === query.toLowerCase() ? 1 : 0

    if (aNameMatch !== bNameMatch) return bNameMatch - aNameMatch

    // Type priority
    const typePriority: Record<string, number> = {
      procedure: 5,
      module: 4,
      variable: 3,
      constant: 2,
      enum: 2,
      type: 2,
      comment: 1,
      file: 0,
    }

    const aPriority = typePriority[a.type] || 0
    const bPriority = typePriority[b.type] || 0

    if (aPriority !== bPriority) return bPriority - aPriority

    // Line number (earlier matches first)
    return a.lineNumber - b.lineNumber
  })

  return results
}
