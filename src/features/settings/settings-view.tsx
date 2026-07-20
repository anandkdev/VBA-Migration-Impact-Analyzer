'use client'

import React, { useState } from 'react'
import { Settings, RotateCcw, Moon, Sun, Monitor, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSettingsStore } from '@/store/settings-store'
import { useProjectStore } from '@/store/project-store'

export function SettingsView() {
  const {
    theme,
    searchOptions,
    exportDefaults,
    uiPreferences,
    setTheme,
    updateSearchOptions,
    updateExportDefaults,
    updateUiPreferences,
    resetSettings,
  } = useSettingsStore()

  const { projectName, files, modules } = useProjectStore()
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const handleResetSettings = () => {
    if (window.confirm('Reset all settings to defaults? This action cannot be undone.')) {
      resetSettings()
    }
  }

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold">Settings</h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Customize your VBA Migration Impact Analyzer experience. Settings are saved locally and
          persist across sessions.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Theme Settings */}
        <section className="space-y-4">
          <h3 className="font-semibold text-lg">Appearance</h3>

          <div className="space-y-3">
            <label className="text-sm font-medium">Theme</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                    theme === t
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-border hover:border-blue-300'
                  }`}
                >
                  {t === 'light' && <Sun className="w-5 h-5" />}
                  {t === 'dark' && <Moon className="w-5 h-5" />}
                  {t === 'system' && <Monitor className="w-5 h-5" />}
                  <span className="capitalize font-medium">{t}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
              <input
                type="checkbox"
                checked={uiPreferences.compactMode}
                onChange={(e) => updateUiPreferences({ compactMode: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-sm">Compact Mode</p>
                <p className="text-xs text-muted-foreground">Reduce spacing and padding</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
              <input
                type="checkbox"
                checked={uiPreferences.enableAnimations}
                onChange={(e) => updateUiPreferences({ enableAnimations: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-sm">Animations</p>
                <p className="text-xs text-muted-foreground">Enable smooth transitions</p>
              </div>
            </label>
          </div>
        </section>

        {/* Editor Settings */}
        <section className="space-y-4 pt-6 border-t border-border">
          <h3 className="font-semibold text-lg">Code Editor</h3>

          <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
            <input
              type="checkbox"
              checked={uiPreferences.showLineNumbers}
              onChange={(e) => updateUiPreferences({ showLineNumbers: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <div className="flex-1">
              <p className="font-medium text-sm">Show Line Numbers</p>
              <p className="text-xs text-muted-foreground">Display line numbers in code viewer</p>
            </div>
          </label>
        </section>

        {/* Search Settings */}
        <section className="space-y-4 pt-6 border-t border-border">
          <h3 className="font-semibold text-lg">Search Defaults</h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
              <input
                type="checkbox"
                checked={searchOptions.caseSensitive}
                onChange={(e) => updateSearchOptions({ caseSensitive: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-sm">Case Sensitive</p>
                <p className="text-xs text-muted-foreground">Default to case-sensitive searches</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
              <input
                type="checkbox"
                checked={searchOptions.useRegex}
                onChange={(e) => updateSearchOptions({ useRegex: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-sm">Use Regular Expressions</p>
                <p className="text-xs text-muted-foreground">Default to regex search mode</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
              <input
                type="checkbox"
                checked={searchOptions.ignoreComments}
                onChange={(e) => updateSearchOptions({ ignoreComments: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-sm">Ignore Comments</p>
                <p className="text-xs text-muted-foreground">Exclude comments from search results</p>
              </div>
            </label>
          </div>
        </section>

        {/* Export Settings */}
        <section className="space-y-4 pt-6 border-t border-border">
          <h3 className="font-semibold text-lg">Export Defaults</h3>

          <div className="space-y-3">
            <label className="text-sm font-medium">Preferred Format</label>
            <div className="flex gap-3">
              {(['html', 'excel'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => updateExportDefaults({ format })}
                  className={`flex-1 p-3 rounded-lg border-2 transition-colors font-medium capitalize ${
                    exportDefaults.format === format
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-border hover:border-blue-300'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
            <input
              type="checkbox"
              checked={exportDefaults.includeStats}
              onChange={(e) => updateExportDefaults({ includeStats: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <div className="flex-1">
              <p className="font-medium text-sm">Include Statistics</p>
              <p className="text-xs text-muted-foreground">Add statistics to exported reports</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent cursor-pointer">
            <input
              type="checkbox"
              checked={exportDefaults.includeRecommendations}
              onChange={(e) => updateExportDefaults({ includeRecommendations: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <div className="flex-1">
              <p className="font-medium text-sm">Include Recommendations</p>
              <p className="text-xs text-muted-foreground">Include action items in reports</p>
            </div>
          </label>
        </section>

        {/* Data & Cache */}
        <section className="space-y-4 pt-6 border-t border-border">
          <h3 className="font-semibold text-lg">Data & Cache</h3>

          {projectName && (
            <div className="p-4 rounded-lg border border-border bg-muted/50">
              <p className="text-sm font-medium mb-2">Current Project</p>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm">{projectName}</p>
                  <p className="text-xs text-muted-foreground">
                    {files.length} files • {modules.length} modules
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`${projectName} (${files.length} files, ${modules.length} modules)`, 'project-info')}
                  className="gap-2"
                >
                  {copiedSection === 'project-info' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copiedSection === 'project-info' ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
          )}

          <div className="p-4 rounded-lg border border-border bg-blue-500/10">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              ℹ️ All data is stored locally in your browser. Clearing your browser cache will clear
              all imported projects and settings.
            </p>
          </div>
        </section>

        {/* Reset */}
        <section className="space-y-4 pt-6 border-t border-border">
          <h3 className="font-semibold text-lg text-red-600">Danger Zone</h3>

          <Button
            onClick={handleResetSettings}
            variant="outline"
            className="gap-2 border-red-500/50 text-red-600 hover:bg-red-500/10"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All Settings to Defaults
          </Button>
          <p className="text-xs text-muted-foreground">
            This will reset all settings but will not clear your imported projects or analysis
            results.
          </p>
        </section>
      </div>
    </div>
  )
}
