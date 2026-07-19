import { VBAModule, Procedure, Variable } from '@/types/index'

/**
 * Regular expressions for VBA syntax parsing
 */
const PATTERNS = {
  // Module/Class/Form declarations
  moduleDeclaration: /^(?:Attribute|'|REM\s)/i,

  // Procedure declarations
  subProcedure: /^\s*(?:Public\s+|Private\s+|Friend\s+|Static\s+)*(?:Sub|Function)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/i,
  propertyGet: /^\s*(?:Public\s+|Private\s+)?Property\s+Get\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:\(|$)/i,
  propertySet: /^\s*(?:Public\s+|Private\s+)?Property\s+(?:Set|Let)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/i,

  // Variable declarations
  variableDeclaration: /^\s*(?:Public|Private|Dim|Const|Static|Global)\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?:As\s+([A-Za-z0-9_\[\]\.]+))?/i,

  // Constants and Enums
  constantDeclaration: /^\s*Const\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)/i,
  enumDeclaration: /^\s*Enum\s+([A-Za-z_][A-Za-z0-9_]*)\s*$/i,
  typeDeclaration: /^\s*Type\s+([A-Za-z_][A-Za-z0-9_]*)\s*$/i,

  // Comments
  inlineComment: /^[^'"]*'(.*)$/i,
  blockComment: /^\s*REM\s+(.*)$/i,

  // Events
  workbookEvent: /^\s*(?:Private|Public|)\s*Sub\s+(Workbook_\w+)\s*\(/i,
  worksheetEvent: /^\s*(?:Private|Public|)\s*Sub\s+(Worksheet_\w+)\s*\(/i,

  // SQL and external calls
  sqlKeyword: /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN|GROUP\s+BY)\b/i,
  externalCall: /\b([A-Za-z_][A-Za-z0-9_]*)\s*\.\s*([A-Za-z_][A-Za-z0-9_]*)\s*\(/,

  // End of blocks
  endStatement: /^\s*(?:End\s+(?:Sub|Function|Type|Enum|If|With|Select|For|Do)|Else|ElseIf|Case)\b/i,
}

interface ParseContext {
  currentModule: Partial<VBAModule> | null
  currentProcedure: Partial<Procedure> | null
  inProcedure: boolean
  indentLevel: number
}

export function parseVBACode(content: string, moduleId: string): VBAModule | null {
  const lines = content.split('\n')
  const module: Partial<VBAModule> = {
    id: moduleId,
    name: '',
    type: 'Module',
    procedures: [],
    variables: [],
    constants: [],
    enums: [],
    types: [],
    comments: [],
  }

  const context: ParseContext = {
    currentModule: module,
    currentProcedure: null,
    inProcedure: false,
    indentLevel: 0,
  }

  let lineNumber = 0

  for (const line of lines) {
    lineNumber++

    // Skip empty lines
    if (!line.trim()) continue

    // Parse different line types
    parseLine(line, lineNumber, context)
  }

  // Finalize any open procedure
  if (context.currentProcedure) {
    context.currentProcedure.endLine = lineNumber
    module.procedures?.push(context.currentProcedure as Procedure)
  }

  return module as VBAModule
}

function parseLine(line: string, lineNumber: number, context: ParseContext): void {
  const trimmedLine = line.trim()
  const module = context.currentModule

  if (!module) return

  // Check for procedure start
  const subMatch = trimmedLine.match(PATTERNS.subProcedure)
  const propGetMatch = trimmedLine.match(PATTERNS.propertyGet)
  const propSetMatch = trimmedLine.match(PATTERNS.propertySet)

  if (subMatch) {
    // Save previous procedure
    if (context.currentProcedure) {
      context.currentProcedure.endLine = lineNumber - 1
      module.procedures?.push(context.currentProcedure as Procedure)
    }

    // Start new procedure
    const procName = subMatch[1]

    context.currentProcedure = {
      id: `proc_${Math.random().toString(36).substr(2, 9)}`,
      name: procName,
      type: trimmedLine.startsWith('Function') ? 'Function' : 'Sub',
      scope: trimmedLine.includes('Private') ? 'Private' : 'Public',
      moduleId: module.id || '',
      startLine: lineNumber,
      endLine: lineNumber,
      variables: [],
      calls: [],
      comments: [],
    }
    context.inProcedure = true
  } else if (propGetMatch) {
    if (context.currentProcedure) {
      context.currentProcedure.endLine = lineNumber - 1
      module.procedures?.push(context.currentProcedure as Procedure)
    }

    context.currentProcedure = {
      id: `proc_${Math.random().toString(36).substr(2, 9)}`,
      name: propGetMatch[1],
      type: 'PropertyGet',
      scope: trimmedLine.includes('Private') ? 'Private' : 'Public',
      moduleId: module.id || '',
      startLine: lineNumber,
      endLine: lineNumber,
      variables: [],
      calls: [],
      comments: [],
    }
    context.inProcedure = true
  } else if (propSetMatch) {
    if (context.currentProcedure) {
      context.currentProcedure.endLine = lineNumber - 1
      module.procedures?.push(context.currentProcedure as Procedure)
    }

    context.currentProcedure = {
      id: `proc_${Math.random().toString(36).substr(2, 9)}`,
      name: propSetMatch[1],
      type: 'PropertySet',
      scope: trimmedLine.includes('Private') ? 'Private' : 'Public',
      moduleId: module.id || '',
      startLine: lineNumber,
      endLine: lineNumber,
      variables: [],
      calls: [],
      comments: [],
    }
    context.inProcedure = true
  }

  // Check for procedure end
  if (PATTERNS.endStatement.test(trimmedLine)) {
    if (context.inProcedure && /^\s*End\s+(?:Sub|Function)/i.test(trimmedLine)) {
      if (context.currentProcedure) {
        context.currentProcedure.endLine = lineNumber
        module.procedures?.push(context.currentProcedure as Procedure)
        context.currentProcedure = null
      }
      context.inProcedure = false
    }
  }

  // Parse variable declarations
  const varMatch = trimmedLine.match(PATTERNS.variableDeclaration)
  if (varMatch && !trimmedLine.startsWith('Const')) {
    const variable: Variable = {
      id: `var_${Math.random().toString(36).substr(2, 9)}`,
      name: varMatch[1],
      type: varMatch[2] || 'Variant',
      scope: trimmedLine.includes('Global') ? 'Global'
           : trimmedLine.includes('Public') ? 'Module'
           : 'Procedure',
      lineNumber,
      declaration: trimmedLine,
    }

    if (context.inProcedure && context.currentProcedure) {
      context.currentProcedure.variables?.push(variable)
    } else {
      module.variables?.push(variable)
    }
  }

  // Parse constants
  const constMatch = trimmedLine.match(PATTERNS.constantDeclaration)
  if (constMatch) {
    module.constants?.push(constMatch[1])
  }

  // Parse enums
  const enumMatch = trimmedLine.match(PATTERNS.enumDeclaration)
  if (enumMatch) {
    module.enums?.push(enumMatch[1])
  }

  // Parse types
  const typeMatch = trimmedLine.match(PATTERNS.typeDeclaration)
  if (typeMatch) {
    module.types?.push(typeMatch[1])
  }

  // Extract comments
  const commentMatch = trimmedLine.match(PATTERNS.inlineComment)
  if (commentMatch) {
    const comment = commentMatch[1].trim()
    if (context.inProcedure && context.currentProcedure) {
      context.currentProcedure.comments?.push(comment)
    } else {
      module.comments?.push(comment)
    }
  }

  // Detect SQL queries
  if (PATTERNS.sqlKeyword.test(trimmedLine)) {
    if (context.inProcedure && context.currentProcedure) {
      context.currentProcedure.calls?.push(`[SQL] ${trimmedLine}`)
    }
  }

  // Detect external calls
  const extCallMatch = trimmedLine.match(PATTERNS.externalCall)
  if (extCallMatch) {
    const call = `${extCallMatch[1]}.${extCallMatch[2]}`
    if (context.inProcedure && context.currentProcedure) {
      if (!context.currentProcedure.calls?.includes(call)) {
        context.currentProcedure.calls?.push(call)
      }
    }
  }
}

export function parseProjectModules(
  files: Array<{ id: string; name: string; content: string; type: string }>
): VBAModule[] {
  return files
    .filter((f) => ['bas', 'cls', 'frm'].includes(f.type))
    .map((f) => {
      const module = parseVBACode(f.content, f.id)
      if (module) {
        module.name = f.name.replace(/\.(bas|cls|frm)$/i, '')
        // Infer module type from file extension
        if (f.type === 'cls') module.type = 'Class'
        else if (f.type === 'frm') module.type = 'Form'
        else module.type = 'Module'
      }
      return module
    })
    .filter((m) => m !== null) as VBAModule[]
}

export function extractProcedureOutline(module: VBAModule): Array<{
  name: string
  type: string
  lineNumber: number
  procedureCount: number
}> {
  return module.procedures.map((proc) => ({
    name: proc.name,
    type: proc.type,
    lineNumber: proc.startLine,
    procedureCount: module.procedures.length,
  }))
}
