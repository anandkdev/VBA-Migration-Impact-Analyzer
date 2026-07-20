export type VBAFileType = 'bas' | 'cls' | 'frm' | 'xlsm' | 'xls' | 'xlsx' | 'txt' | 'csv'

export type ModuleType = 'Module' | 'Class' | 'Form' | 'Workbook' | 'Worksheet'

export type SeverityLevel = 'High' | 'Medium' | 'Low'

export interface VBAFile {
  id: string
  name: string
  path: string
  type: VBAFileType
  content: string
  createdAt: Date
  modifiedAt: Date
  sourceFile?: string
  sourceSheet?: string
}

export interface Variable {
  id: string
  name: string
  type: string
  scope: 'Global' | 'Module' | 'Procedure'
  lineNumber: number
  declaration: string
}

export interface Procedure {
  id: string
  name: string
  type: 'Sub' | 'Function' | 'PropertyGet' | 'PropertyLet' | 'PropertySet'
  scope: 'Public' | 'Private'
  moduleId: string
  startLine: number
  endLine: number
  variables: Variable[]
  calls: string[]
  comments: string[]
}

export interface VBAModule {
  id: string
  name: string
  type: ModuleType
  fileId?: string
  procedures: Procedure[]
  variables: Variable[]
  constants: string[]
  enums: string[]
  types: string[]
  comments: string[]
}

export interface VBAProject {
  id: string
  name: string
  path: string
  files: VBAFile[]
  modules: VBAModule[]
  worksheets: string[]
  namedRanges: string[]
  queries: string[]
  createdAt: Date
}

export interface SearchResult {
  id: string
  type: 'Variable' | 'Procedure' | 'Module' | 'Comment' | 'File'
  name: string
  location: {
    fileId: string
    moduleName: string
    procedureName?: string
    lineNumber: number
  }
  context: string
  matches: number
}

export interface ImpactItem {
  id: string
  fieldName: string
  severity: SeverityLevel
  reason: string
  recommendation: string
  businessArea: string
  technicalArea: string
  locations: {
    moduleName: string
    procedureName?: string
    lineNumber: number
    fileId: string
  }[]
}

export interface DependencyNode {
  id: string
  label: string
  type: 'Procedure' | 'Module' | 'External'
  color?: string
}

export interface DependencyEdge {
  source: string
  target: string
  label?: string
}

export interface DependencyGraph {
  nodes: DependencyNode[]
  edges: DependencyEdge[]
}
