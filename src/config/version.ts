export const APP_VERSION = '1.0.0'
export const APP_NAME = 'VBA Migration Impact Analyzer'
export const APP_DESCRIPTION = 'Analyze VBA projects and assess migration impact from RMS to Modern Product Hierarchy'

export const FEATURES = {
  projectImport: true,
  codeExploration: true,
  search: true,
  impactAnalysis: true,
  dependencyGraph: true,
  reports: true,
  settings: true,
  help: true,
}

export const BUILD_INFO = {
  version: APP_VERSION,
  buildDate: new Date().toISOString().split('T')[0],
  environment: typeof window !== 'undefined' ? 'browser' : 'server',
}
