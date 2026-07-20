'use client'

import React, { useState } from 'react'
import { HelpCircle, ChevronDown, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { APP_VERSION, APP_NAME } from '@/config/version'

interface HelpSection {
  title: string
  icon: React.ReactNode
  content: string | React.ReactNode
}

interface KeyboardShortcut {
  keys: string[]
  description: string
}

const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  { keys: ['Ctrl', 'K'], description: 'Focus search box' },
  { keys: ['Ctrl', 'L'], description: 'Clear current project' },
  { keys: ['Escape'], description: 'Close dialogs and modals' },
  { keys: ['Ctrl', '/', '?'], description: 'Open help' },
]

export function HelpView() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['getting-started'])
  )
  const [copiedShortcut, setCopiedShortcut] = useState<string | null>(null)

  const toggleSection = (sectionId: string) => {
    const newSections = new Set(expandedSections)
    if (newSections.has(sectionId)) {
      newSections.delete(sectionId)
    } else {
      newSections.add(sectionId)
    }
    setExpandedSections(newSections)
  }

  const copyShortcut = (keys: string[]) => {
    const text = keys.join(' + ')
    navigator.clipboard.writeText(text)
    setCopiedShortcut(text)
    setTimeout(() => setCopiedShortcut(null), 2000)
  }

  const sections: HelpSection[] = [
    {
      title: 'Getting Started',
      icon: <HelpCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-3 text-sm">
          <p>
            Welcome to VBA Migration Impact Analyzer! This tool helps you analyze VBA projects and
            understand the impact of migrating from RMS to MPH hierarchy.
          </p>
          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li>
              <strong>Import a Project:</strong> Click "Import Folder" to select your VBA project
              directory
            </li>
            <li>
              <strong>Explore Code:</strong> Browse your files and modules in the Explorer tab
            </li>
            <li>
              <strong>Search:</strong> Use the Search tab to find specific procedures, variables,
              or patterns
            </li>
            <li>
              <strong>Analyze:</strong> Run impact analysis on specific fields in the Analysis tab
            </li>
            <li>
              <strong>Visualize:</strong> View procedure dependencies in the Graph tab
            </li>
            <li>
              <strong>Export:</strong> Generate HTML or Excel reports with your findings
            </li>
          </ol>
        </div>
      ),
    },
    {
      title: 'Features Overview',
      icon: <HelpCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-1">📁 Project Explorer</h4>
            <p className="text-muted-foreground">
              View all imported VBA files and modules. Click to view source code with syntax
              highlighting and procedure outline.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">🔍 Search Engine</h4>
            <p className="text-muted-foreground">
              Search across all code with multiple options: case-sensitive, regex, whole-word, and
              filtering by type. Results show exact locations in your code.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">⚠️ Impact Analysis</h4>
            <p className="text-muted-foreground">
              Analyze specific fields to identify all code affected by RMS→MPH migration. Get
              severity levels and specific recommendations.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">📊 Dependency Graph</h4>
            <p className="text-muted-foreground">
              Visualize procedure call dependencies. Pan, zoom, and search to understand code
              relationships. Hover for details.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">📄 Reports</h4>
            <p className="text-muted-foreground">
              Export analysis results in HTML or Excel format with summaries, statistics, and
              recommendations.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Keyboard Shortcuts',
      icon: <HelpCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-2">
          {KEYBOARD_SHORTCUTS.map((shortcut) => (
            <div
              key={shortcut.keys.join('+')}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <p className="text-sm">{shortcut.description}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyShortcut(shortcut.keys)}
                className="gap-2"
              >
                <code className="text-xs font-semibold bg-muted px-2 py-1 rounded">
                  {shortcut.keys.join(' + ')}
                </code>
                {copiedShortcut === shortcut.keys.join(' + ') ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Impact Analysis Rules',
      icon: <HelpCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            The analyzer checks for code patterns that are affected by RMS→MPH migration:
          </p>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <span className="font-semibold text-red-600 min-w-12">HIGH:</span>
              <span>Allocation logic, hierarchy navigation, validation rules</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-amber-600 min-w-12">MEDIUM:</span>
              <span>Data export, report calculations, form field bindings</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-green-600 min-w-12">LOW:</span>
              <span>Query dependencies, worksheet structure, documentation</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Tips & Tricks',
      icon: <HelpCircle className="w-5 h-5" />,
      content: (
        <ul className="space-y-2 text-sm">
          <li>
            💡 <strong>Search Tips:</strong> Use regex to find complex patterns. Try
            <code className="text-xs bg-muted px-1 rounded">Sub\s+\w+</code> to find all
            procedures.
          </li>
          <li>
            💡 <strong>Graph Navigation:</strong> Double-click nodes in the dependency graph to
            focus on specific procedures.
          </li>
          <li>
            💡 <strong>Filtering:</strong> Use type filters in search to find only procedures,
            variables, or specific item types.
          </li>
          <li>
            💡 <strong>Copy Data:</strong> Many panels have copy buttons. Use them to gather
            information for reports.
          </li>
          <li>
            💡 <strong>Settings Sync:</strong> Your preferences are saved locally. Switch devices
            and export reports to preserve findings.
          </li>
        </ul>
      ),
    },
    {
      title: 'Troubleshooting',
      icon: <HelpCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-3 text-sm">
          <div>
            <h4 className="font-semibold mb-1">Project not loading?</h4>
            <p className="text-muted-foreground">
              Ensure your VBA files are in standard .bas, .cls, or .txt format. The analyzer reads
              plain text files.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Search returning no results?</h4>
            <p className="text-muted-foreground">
              Check your search options. Try disabling "Ignore Comments" or "Case Sensitive" if
              enabled.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Graph not showing dependencies?</h4>
            <p className="text-muted-foreground">
              The graph shows visible procedure calls. Ensure your code has explicit Call
              statements or function invocations.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Settings not persisting?</h4>
            <p className="text-muted-foreground">
              Check your browser settings. Local storage must be enabled for settings to persist.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'About',
      icon: <HelpCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold mb-2">{APP_NAME}</p>
            <p className="text-muted-foreground">
              A comprehensive tool for analyzing VBA projects and assessing migration impact from
              RMS to Modern Product Hierarchy (MPH).
            </p>
            <p className="text-xs text-muted-foreground mt-2">Version {APP_VERSION}</p>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>Built with:</p>
            <ul className="list-disc list-inside pl-2">
              <li>Next.js 15 & React 18</li>
              <li>TypeScript for type safety</li>
              <li>Tailwind CSS & shadcn/ui</li>
              <li>React Flow for graph visualization</li>
              <li>Zustand for state management</li>
              <li>XLSX for report generation</li>
            </ul>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              All data is processed locally in your browser. No data is sent to external servers.
            </p>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold">Help & Documentation</h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Learn how to use the VBA Migration Impact Analyzer. Expand any section below for more
          details.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-3 max-w-3xl">
          {sections.map((section, index) => {
            const sectionId = `section-${index}`
            const isExpanded = expandedSections.has(sectionId)

            return (
              <div
                key={sectionId}
                className="border border-border rounded-lg overflow-hidden bg-card"
              >
                <button
                  onClick={() => toggleSection(sectionId)}
                  className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {section.icon}
                    <span className="font-semibold">{section.title}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {isExpanded && (
                  <div className="border-t border-border p-4 bg-muted/30">
                    {typeof section.content === 'string' ? (
                      <p className="text-sm text-muted-foreground">{section.content}</p>
                    ) : (
                      section.content
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
