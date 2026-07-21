import { VBAModule } from '@/types/index'
import type { SearchIndex } from '@/core/symbol-index'

export interface ProjectStats {
  totalFiles: number
  totalModules: number
  totalProcedures: number
  totalVariables: number
  totalConstants: number
  totalEnums: number
  totalTypes: number
  largestModule: { name: string; procedures: number; variables: number } | null
  largestProcedure: { name: string; module: string; lines: number } | null
  unusedVariables: Array<{ name: string; module: string; procedure?: string }>
  duplicateProcedures: Array<{ name: string; modules: string[] }>
  workbookEvents: number
  worksheetEvents: number
  sqlReferences: number
}

export interface AnalysisResult {
  modules: VBAModule[]
  stats: ProjectStats
  symbolIndex: SearchIndex
}
