import { searchService } from '@/features/search/search-service'
import { IndexedItem, SearchOptions } from '@/features/search/search-index'
import {
  findMatchingRules,
  calculateSeverityBoost,
  SeverityLevel,
  BusinessArea,
  TechnicalArea,
} from '@/features/analysis/impact-rules'

export interface ImpactResult {
  id: string
  itemId: string
  itemName: string
  itemType: string
  severity: SeverityLevel
  businessArea: BusinessArea
  technicalArea: TechnicalArea
  reason: string
  recommendation: string
  fileName: string
  moduleName?: string
  procedureName?: string
  lineNumber: number
  searchTerm: string
  matchType: string
}

/**
 * Analyze impact of changing a field or structure
 */
export function analyzeFieldImpact(
  fieldName: string,
  searchContext?: string[]
): ImpactResult[] {
  if (!fieldName.trim()) {
    return []
  }

  const results: ImpactResult[] = []

  // Search for the field name
  const searchOptions: SearchOptions = {
    caseSensitive: false,
    useRegex: false,
    wholeWord: false,
    ignoreComments: false,
    searchTypes: searchContext || [],
  }

  const searchResults = searchService.search(fieldName, searchOptions)

  // For each search result, find matching rules and create impact results
  searchResults.forEach((searchResult, index) => {
    const matchingRules = findMatchingRules(fieldName, searchResult.type)

    // If no specific rules match, create a default impact result
    if (matchingRules.length === 0) {
      results.push(createDefaultImpactResult(searchResult, fieldName, index))
    } else {
      // Create an impact result for each matching rule
      matchingRules.forEach((rule, ruleIndex) => {
        const severity = calculateSeverityBoost(rule.severity, searchResult.type)

        results.push({
          id: `impact_${searchResult.id}_${ruleIndex}`,
          itemId: searchResult.id,
          itemName: searchResult.name,
          itemType: searchResult.type,
          severity,
          businessArea: rule.businessArea,
          technicalArea: rule.technicalArea,
          reason: rule.reason,
          recommendation: rule.recommendation,
          fileName: searchResult.fileName,
          moduleName: searchResult.moduleName,
          procedureName: searchResult.procedureName,
          lineNumber: searchResult.lineNumber,
          searchTerm: fieldName,
          matchType: rule.name,
        })
      })
    }
  })

  // Sort by severity (High > Medium > Low) then by line number
  results.sort((a, b) => {
    const severityOrder: Record<SeverityLevel, number> = {
      'High': 3,
      'Medium': 2,
      'Low': 1,
    }

    const severityDiff = severityOrder[b.severity] - severityOrder[a.severity]
    if (severityDiff !== 0) return severityDiff

    return a.lineNumber - b.lineNumber
  })

  return results
}

/**
 * Create a default impact result when no specific rule matches
 */
function createDefaultImpactResult(
  searchResult: IndexedItem,
  fieldName: string,
  index: number
): ImpactResult {
  let severity: SeverityLevel = 'Low'
  let reason = 'Field referenced in code'
  let recommendation = 'Review this reference to ensure compatibility with new hierarchy'

  // Default severity based on item type
  if (searchResult.type === 'procedure' || searchResult.type === 'variable') {
    severity = 'Medium'
    reason = 'Field used in active code element'
  } else if (searchResult.type === 'module') {
    severity = 'Low'
    reason = 'Field mentioned in module'
  }

  return {
    id: `impact_default_${searchResult.id}_${index}`,
    itemId: searchResult.id,
    itemName: searchResult.name,
    itemType: searchResult.type,
    severity,
    businessArea: 'Other',
    technicalArea: 'Other',
    reason,
    recommendation,
    fileName: searchResult.fileName,
    moduleName: searchResult.moduleName,
    procedureName: searchResult.procedureName,
    lineNumber: searchResult.lineNumber,
    searchTerm: fieldName,
    matchType: 'General Reference',
  }
}

/**
 * Get impact statistics
 */
export function getImpactStats(results: ImpactResult[]) {
  const stats = {
    total: results.length,
    high: results.filter((r) => r.severity === 'High').length,
    medium: results.filter((r) => r.severity === 'Medium').length,
    low: results.filter((r) => r.severity === 'Low').length,
    byType: {} as Record<string, number>,
    byArea: {} as Record<string, number>,
  }

  // Count by type
  results.forEach((r) => {
    stats.byType[r.itemType] = (stats.byType[r.itemType] || 0) + 1
  })

  // Count by business area
  results.forEach((r) => {
    stats.byArea[r.businessArea] = (stats.byArea[r.businessArea] || 0) + 1
  })

  return stats
}

/**
 * Filter impact results
 */
export function filterImpactResults(
  results: ImpactResult[],
  filters: {
    severity?: SeverityLevel[]
    itemType?: string[]
    businessArea?: BusinessArea[]
    technicalArea?: TechnicalArea[]
  }
): ImpactResult[] {
  return results.filter((result) => {
    if (
      filters.severity &&
      !filters.severity.includes(result.severity)
    ) {
      return false
    }

    if (
      filters.itemType &&
      !filters.itemType.includes(result.itemType)
    ) {
      return false
    }

    if (
      filters.businessArea &&
      !filters.businessArea.includes(result.businessArea)
    ) {
      return false
    }

    if (
      filters.technicalArea &&
      !filters.technicalArea.includes(result.technicalArea)
    ) {
      return false
    }

    return true
  })
}
