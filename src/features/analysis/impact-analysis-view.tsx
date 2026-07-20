'use client'

import React, { useState, useMemo } from 'react'
import { Zap, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImpactResults } from '@/features/analysis/impact-results'
import {
  analyzeFieldImpact,
  filterImpactResults,
  ImpactResult,
} from '@/features/analysis/impact-service'
import {
  getTechnicalAreas,
  getBusinessAreas,
} from '@/features/analysis/impact-rules'

export function ImpactAnalysisView() {
  const [fieldName, setFieldName] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [results, setResults] = useState<ImpactResult[]>([])

  // Filters
  const [severityFilter, setSeverityFilter] = useState<string[]>([])
  const [itemTypeFilter, setItemTypeFilter] = useState<string[]>([])
  const [businessAreaFilter, setBusinessAreaFilter] = useState<string[]>([])
  const [technicalAreaFilter, setTechnicalAreaFilter] = useState<string[]>([])

  const technicalAreas = useMemo(() => getTechnicalAreas(), [])
  const businessAreas = useMemo(() => getBusinessAreas(), [])

  // Perform analysis
  const handleAnalyze = () => {
    if (!fieldName.trim()) return

    setIsAnalyzing(true)
    // Simulate async work
    setTimeout(() => {
      const analysisResults = analyzeFieldImpact(fieldName)
      setResults(analysisResults)
      setIsAnalyzing(false)
    }, 300)
  }

  // Filter results based on selected filters
  const filteredResults = useMemo(() => {
    return filterImpactResults(results, {
      severity: severityFilter.length > 0 ? (severityFilter as any) : undefined,
      itemType: itemTypeFilter.length > 0 ? itemTypeFilter : undefined,
      businessArea:
        businessAreaFilter.length > 0 ? (businessAreaFilter as any) : undefined,
      technicalArea:
        technicalAreaFilter.length > 0 ? (technicalAreaFilter as any) : undefined,
    })
  }, [
    results,
    severityFilter,
    itemTypeFilter,
    businessAreaFilter,
    technicalAreaFilter,
  ])

  const handleToggleFilter = (
    value: string,
    filterArray: string[],
    setFilter: (arr: string[]) => void
  ) => {
    if (filterArray.includes(value)) {
      setFilter(filterArray.filter((v) => v !== value))
    } else {
      setFilter([...filterArray, value])
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 space-y-3">
        {/* Input */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="Enter field name (e.g., Product Group)..."
              className="w-full px-10 py-2 rounded border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !fieldName.trim()}
            className="gap-2"
          >
            <Search className="w-4 h-4" />
            Analyze
          </Button>

          <Button
            variant={showFilters ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            title="Filter results"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Filters */}
        {showFilters && results.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-border max-h-80 overflow-y-auto">
            {/* Severity Filter */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Severity:
              </p>
              <div className="flex gap-2">
                {['High', 'Medium', 'Low'].map((severity) => (
                  <label
                    key={severity}
                    className="flex items-center gap-2 text-xs cursor-pointer hover:bg-muted p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={severityFilter.includes(severity)}
                      onChange={() =>
                        handleToggleFilter(
                          severity,
                          severityFilter,
                          setSeverityFilter
                        )
                      }
                      className="rounded"
                    />
                    <span>{severity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Item Type Filter */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Item Type:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {['procedure', 'variable', 'module', 'file', 'comment', 'constant'].map(
                  (type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 text-xs cursor-pointer hover:bg-muted p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={itemTypeFilter.includes(type)}
                        onChange={() =>
                          handleToggleFilter(type, itemTypeFilter, setItemTypeFilter)
                        }
                        className="rounded"
                      />
                      <span className="capitalize">{type}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Business Area Filter */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Business Area:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {businessAreas.map((area) => (
                  <label
                    key={area}
                    className="flex items-center gap-2 text-xs cursor-pointer hover:bg-muted p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={businessAreaFilter.includes(area)}
                      onChange={() =>
                        handleToggleFilter(
                          area,
                          businessAreaFilter,
                          setBusinessAreaFilter
                        )
                      }
                      className="rounded"
                    />
                    <span>{area}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Technical Area Filter */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Technical Area:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {technicalAreas.map((area) => (
                  <label
                    key={area}
                    className="flex items-center gap-2 text-xs cursor-pointer hover:bg-muted p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={technicalAreaFilter.includes(area)}
                      onChange={() =>
                        handleToggleFilter(
                          area,
                          technicalAreaFilter,
                          setTechnicalAreaFilter
                        )
                      }
                      className="rounded"
                    />
                    <span>{area}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(severityFilter.length > 0 ||
              itemTypeFilter.length > 0 ||
              businessAreaFilter.length > 0 ||
              technicalAreaFilter.length > 0) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSeverityFilter([])
                  setItemTypeFilter([])
                  setBusinessAreaFilter([])
                  setTechnicalAreaFilter([])
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Help Text */}
        {results.length === 0 && !isAnalyzing && (
          <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
            <p className="font-semibold mb-1">How to use Impact Analysis:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Enter a field name (e.g., "Product Group", "Division", "Region")</li>
              <li>Click "Analyze" to find all references to this field</li>
              <li>Review severity levels to prioritize migration work</li>
              <li>Use filters to focus on specific areas</li>
            </ul>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-hidden">
        <ImpactResults results={filteredResults} isLoading={isAnalyzing} />
      </div>
    </div>
  )
}
