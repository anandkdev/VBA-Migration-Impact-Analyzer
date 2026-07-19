/**
 * Impact analysis rules for identifying migration concerns
 */

export type SeverityLevel = 'High' | 'Medium' | 'Low'
export type BusinessArea = 'Data Processing' | 'Reporting' | 'Validation' | 'Integration' | 'Storage' | 'Other'
export type TechnicalArea = 'Core Logic' | 'Calculation' | 'Query' | 'Form' | 'Worksheet' | 'Comment' | 'Other'

export interface ImpactRule {
  name: string
  pattern: RegExp
  severity: SeverityLevel
  businessArea: BusinessArea
  technicalArea: TechnicalArea
  reason: string
  recommendation: string
  contexts: string[]
}

/**
 * Rules for identifying impact of RMS to MPH migration
 */
export const IMPACT_RULES: ImpactRule[] = [
  // High severity - Core allocation logic
  {
    name: 'Allocation Logic',
    pattern: /allocation|allocate|distribute|distribute.*to|assign.*to/i,
    severity: 'High',
    businessArea: 'Data Processing',
    technicalArea: 'Core Logic',
    reason: 'Field directly involved in allocation calculations that depend on hierarchy',
    recommendation: 'Review and update allocation logic to use new MPH hierarchy structure',
    contexts: ['procedure', 'query', 'calculation'],
  },

  // High severity - Group/hierarchy processing
  {
    name: 'Hierarchy Navigation',
    pattern: /parent|child|ancestor|descendant|level|traverse|hierarchy|parent.*of|child.*of/i,
    severity: 'High',
    businessArea: 'Data Processing',
    technicalArea: 'Core Logic',
    reason: 'Hierarchy navigation will change with new structure',
    recommendation: 'Update navigation logic to work with new MPH hierarchy traversal methods',
    contexts: ['procedure', 'query'],
  },

  // High severity - Data validation rules
  {
    name: 'Validation Rules',
    pattern: /validate|check|verify|constraint|rule.*group|group.*rule|must.*match/i,
    severity: 'High',
    businessArea: 'Validation',
    technicalArea: 'Calculation',
    reason: 'Validation rules may depend on old hierarchy structure',
    recommendation: 'Review and rewrite validation rules for new hierarchy',
    contexts: ['procedure', 'query', 'comment'],
  },

  // High severity - Database queries
  {
    name: 'Query Dependencies',
    pattern: /select|insert|update|delete|from|where|join|group\s+by/i,
    severity: 'High',
    businessArea: 'Integration',
    technicalArea: 'Query',
    reason: 'SQL queries directly reference old hierarchy structure',
    recommendation: 'Update SQL queries to use new MPH field names and relationships',
    contexts: ['query', 'procedure'],
  },

  // Medium severity - Data export
  {
    name: 'Data Export',
    pattern: /export|output|write.*file|save.*file|csv|excel|report/i,
    severity: 'Medium',
    businessArea: 'Reporting',
    technicalArea: 'Query',
    reason: 'Export format may depend on old hierarchy data structure',
    recommendation: 'Update export logic to include new MPH fields where needed',
    contexts: ['procedure', 'query', 'form'],
  },

  // Medium severity - Report calculations
  {
    name: 'Report Calculations',
    pattern: /report|total|sum|count|aggregate|calculate|summarize/i,
    severity: 'Medium',
    businessArea: 'Reporting',
    technicalArea: 'Calculation',
    reason: 'Reporting logic may need adjustment for new hierarchy',
    recommendation: 'Review report calculations and aggregations for accuracy',
    contexts: ['procedure', 'query', 'calculation'],
  },

  // Medium severity - Form fields and validation
  {
    name: 'Form Field Binding',
    pattern: /form|control|textbox|combobox|listbox|bind|value|selected/i,
    severity: 'Medium',
    businessArea: 'Data Processing',
    technicalArea: 'Form',
    reason: 'Form controls may be bound to old field structure',
    recommendation: 'Update form field bindings to new MPH structure',
    contexts: ['form', 'procedure'],
  },

  // Medium severity - Worksheet references
  {
    name: 'Worksheet Structure',
    pattern: /sheet|column|row|cell|range|offset|index|header/i,
    severity: 'Medium',
    businessArea: 'Data Processing',
    technicalArea: 'Worksheet',
    reason: 'Worksheet structure depends on field hierarchy',
    recommendation: 'Refactor worksheet columns and formulas for new hierarchy',
    contexts: ['worksheet', 'procedure', 'query'],
  },

  // Low severity - Documentation and comments
  {
    name: 'Documentation',
    pattern: /todo|fixme|note|comment|document|explain|description/i,
    severity: 'Low',
    businessArea: 'Other',
    technicalArea: 'Comment',
    reason: 'Documentation may reference old field names',
    recommendation: 'Update comments and documentation to reflect new structure',
    contexts: ['comment'],
  },

  // Low severity - Error messages
  {
    name: 'Error Messages',
    pattern: /error|message|alert|warn|exception|invalid|failed/i,
    severity: 'Low',
    businessArea: 'Other',
    technicalArea: 'Comment',
    reason: 'Error messages may reference old field names',
    recommendation: 'Update error messages to reference new field names',
    contexts: ['comment', 'string'],
  },
]

/**
 * Find matching rules for a search term
 */
export function findMatchingRules(
  searchTerm: string,
  context?: string
): ImpactRule[] {
  return IMPACT_RULES.filter((rule) => {
    const matchesTerm = rule.pattern.test(searchTerm)
    const matchesContext =
      !context || rule.contexts.includes(context)

    return matchesTerm && matchesContext
  })
}

/**
 * Calculate severity boost based on context
 */
export function calculateSeverityBoost(
  baseSeverity: SeverityLevel,
  context: string
): SeverityLevel {
  const severityOrder: Record<SeverityLevel, number> = {
    'High': 3,
    'Medium': 2,
    'Low': 1,
  }

  let boost = 0

  // Core logic contexts increase severity
  if (['procedure', 'query', 'calculation'].includes(context)) {
    boost = 1
  }

  const currentLevel = severityOrder[baseSeverity]
  const newLevel = Math.min(currentLevel + boost, 3)

  const reverseMap: Record<number, SeverityLevel> = {
    1: 'Low',
    2: 'Medium',
    3: 'High',
  }

  return reverseMap[newLevel]
}

/**
 * Get all available business areas
 */
export function getBusinessAreas(): BusinessArea[] {
  return [
    'Data Processing',
    'Reporting',
    'Validation',
    'Integration',
    'Storage',
    'Other',
  ]
}

/**
 * Get all available technical areas
 */
export function getTechnicalAreas(): TechnicalArea[] {
  return [
    'Core Logic',
    'Calculation',
    'Query',
    'Form',
    'Worksheet',
    'Comment',
    'Other',
  ]
}
