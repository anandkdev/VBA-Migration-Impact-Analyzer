'use client'

import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Settings2, RotateCcw } from 'lucide-react'
import { useFiltersStore } from '@/store/filters-store'
import { VBAFileType, SeverityLevel } from '@/types/index'

const FILE_TYPE_OPTIONS: VBAFileType[] = [
  'bas',
  'cls',
  'frm',
  'xlsm',
  'xls',
  'xlsx',
  'csv',
  'txt',
  'sql',
  'xml',
  'json',
  'png',
  'jpg',
  'jpeg',
  'gif',
  'svg',
  'pdf',
]

const OBJECT_TYPE_OPTIONS = ['procedure', 'variable', 'constant', 'enum', 'type', 'module', 'comment']

const SEVERITY_OPTIONS: SeverityLevel[] = ['High', 'Medium', 'Low']

export function FiltersPopover() {
  const {
    fileTypes,
    objectTypes,
    setSeverity: _setSeverity,
    setSearchScope: _setSearchScope,
    setMigrationFilter: _setMigrationFilter,
    setFileTypes,
    setObjectTypes,
    resetFilters,
  } = useFiltersStore()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="w-4 h-4" />
          Filters
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-4" align="start">
        <ScrollArea className="h-96">
          <div className="space-y-4 pr-4">
            {/* File Types */}
            <div>
              <h4 className="text-sm font-semibold mb-2">File Types</h4>
              <div className="flex flex-wrap gap-1">
                {FILE_TYPE_OPTIONS.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      const updated = fileTypes.includes(type)
                        ? fileTypes.filter((t) => t !== type)
                        : [...fileTypes, type]
                      setFileTypes(updated)
                    }}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      fileTypes.includes(type)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Object Types */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Object Type</h4>
              <div className="flex flex-wrap gap-1">
                {OBJECT_TYPE_OPTIONS.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      const updated = objectTypes.includes(type)
                        ? objectTypes.filter((t) => t !== type)
                        : [...objectTypes, type]
                      setObjectTypes(updated)
                    }}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      objectTypes.includes(type)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity (UI-only for now) */}
            <div className="opacity-50 pointer-events-none">
              <h4 className="text-sm font-semibold mb-2">Severity</h4>
              <div className="flex flex-wrap gap-1">
                {SEVERITY_OPTIONS.map((level) => (
                  <button
                    key={level}
                    disabled
                    className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground cursor-not-allowed"
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Coming in Impact Analysis phase</p>
            </div>

            {/* Search Scope (UI-only for now) */}
            <div className="opacity-50 pointer-events-none">
              <h4 className="text-sm font-semibold mb-2">Search Scope</h4>
              <div className="flex flex-wrap gap-1">
                {['Project', 'Current File', 'Folder'].map((scope) => (
                  <button
                    key={scope}
                    disabled
                    className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground cursor-not-allowed"
                  >
                    {scope}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Available in a future phase</p>
            </div>

            {/* Migration Filter (UI-only for now) */}
            <div className="opacity-50 pointer-events-none">
              <h4 className="text-sm font-semibold mb-2">Migration</h4>
              <div className="flex flex-wrap gap-1">
                {['RMS Only', 'MPH Only', 'Attributes', 'Business Flags'].map((filter) => (
                  <button
                    key={filter}
                    disabled
                    className="px-2 py-1 rounded text-xs bg-muted text-muted-foreground cursor-not-allowed"
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Available in Migration phase</p>
            </div>
          </div>
        </ScrollArea>

        {/* Reset Button */}
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="w-full gap-2"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
