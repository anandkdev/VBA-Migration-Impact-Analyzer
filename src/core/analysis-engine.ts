import { VBAFile, VBAModule } from '@/types/index'
import { parseProjectModules } from '@/features/parser/vba-parser'
import { AnalysisResult, ProjectStats } from './types'

export function analyzeProject(files: VBAFile[]): AnalysisResult {
  const modules = parseProjectModules(
    files.map((f) => ({
      id: f.id,
      name: f.name,
      content: f.content,
      type: f.type,
    }))
  )

  const stats = calculateStats(modules)

  return {
    modules,
    stats,
  }
}

function calculateStats(modules: VBAModule[]): ProjectStats {
  const allProcedures = modules.flatMap((m) => m.procedures)
  const allVariables = modules.flatMap((m) => m.variables)
  const allConstants = modules.flatMap((m) => m.constants)

  // Find largest module
  let largestModule = null
  let maxProcs = 0
  for (const m of modules) {
    if (m.procedures.length > maxProcs) {
      maxProcs = m.procedures.length
      largestModule = {
        name: m.name,
        procedures: m.procedures.length,
        variables: m.variables.length,
      }
    }
  }

  // Find largest procedure
  let largestProcedure = null
  let maxLines = 0
  for (const m of modules) {
    for (const p of m.procedures) {
      const lines = p.endLine - p.startLine + 1
      if (lines > maxLines) {
        maxLines = lines
        largestProcedure = {
          name: p.name,
          module: m.name,
          lines,
        }
      }
    }
  }

  // Find unused variables
  const unusedVariables = findUnusedVariables(modules)

  // Find duplicate procedures
  const duplicateProcedures = findDuplicateProcedures(modules)

  // Count workbook and worksheet events
  const workbookEvents = countEventType(allProcedures, 'Workbook_')
  const worksheetEvents = countEventType(allProcedures, 'Worksheet_')

  // Count SQL references
  const sqlReferences = allProcedures.reduce(
    (sum, p) => sum + p.calls.filter((c) => c.startsWith('[SQL]')).length,
    0
  )

  return {
    totalFiles: modules.reduce((sum, m) => sum + (m.fileId ? 1 : 0), 0),
    totalModules: modules.length,
    totalProcedures: allProcedures.length,
    totalVariables: allVariables.length,
    totalConstants: allConstants.length,
    totalEnums: modules.reduce((sum, m) => sum + m.enums.length, 0),
    totalTypes: modules.reduce((sum, m) => sum + m.types.length, 0),
    largestModule,
    largestProcedure,
    unusedVariables,
    duplicateProcedures,
    workbookEvents,
    worksheetEvents,
    sqlReferences,
  }
}

function findUnusedVariables(
  modules: VBAModule[]
): Array<{ name: string; module: string; procedure?: string }> {
  const unused: Array<{ name: string; module: string; procedure?: string }> = []

  for (const module of modules) {
    // Check module-level variables
    for (const variable of module.variables) {
      const isUsed = module.procedures.some((proc) =>
        proc.calls.some(
          (call) =>
            call.includes(variable.name) ||
            proc.variables.some((v) => v.name === variable.name)
        )
      )
      if (!isUsed) {
        unused.push({ name: variable.name, module: module.name })
      }
    }

    // Check procedure-level variables
    for (const procedure of module.procedures) {
      for (const variable of procedure.variables) {
        const isUsed = procedure.calls.some((call) => call.includes(variable.name))
        if (!isUsed) {
          unused.push({
            name: variable.name,
            module: module.name,
            procedure: procedure.name,
          })
        }
      }
    }
  }

  return unused
}

function findDuplicateProcedures(
  modules: VBAModule[]
): Array<{ name: string; modules: string[] }> {
  const procMap = new Map<string, string[]>()

  for (const module of modules) {
    for (const proc of module.procedures) {
      const key = proc.name
      if (!procMap.has(key)) {
        procMap.set(key, [])
      }
      procMap.get(key)!.push(module.name)
    }
  }

  return Array.from(procMap.entries())
    .filter(([_, mods]) => mods.length > 1)
    .map(([name, mods]) => ({
      name,
      modules: Array.from(new Set(mods)),
    }))
}

function countEventType(procedures: VBAModule['procedures'], prefix: string): number {
  return procedures.filter((p) => p.name.startsWith(prefix)).length
}
