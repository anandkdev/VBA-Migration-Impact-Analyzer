'use client'

import React from 'react'
import {
  LayoutDashboard,
  FolderOpen,
  Search,
  Zap,
  GitGraph,
  FileText,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'explorer', label: 'Project Explorer', icon: FolderOpen },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'analysis', label: 'Impact Analysis', icon: Zap },
  { id: 'graph', label: 'Dependency Graph', icon: GitGraph },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 h-9',
                  isActive && 'bg-secondary text-secondary-foreground'
                )}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm truncate">{item.label}</span>
              </Button>
            )
          })}
        </div>
      </ScrollArea>

      {/* Sidebar Footer - Import Project Button */}
      <div className="p-4 border-t border-border">
        <Button className="w-full" size="sm">
          Import Project
        </Button>
      </div>
    </div>
  )
}
