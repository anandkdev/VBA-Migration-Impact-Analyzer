'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type CardVariant = 'default' | 'destructive' | 'warning' | 'success'

interface DashboardCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  variant?: CardVariant
}

export function DashboardCard({
  label,
  value,
  icon: Icon,
  variant = 'default',
}: DashboardCardProps) {
  const variantStyles = {
    default: 'bg-card border-border',
    destructive: 'bg-destructive/10 border-destructive/20',
    warning: 'bg-yellow-500/10 border-yellow-500/20',
    success: 'bg-green-500/10 border-green-500/20',
  }

  const iconColorStyles = {
    default: 'text-muted-foreground',
    destructive: 'text-destructive',
    warning: 'text-yellow-600 dark:text-yellow-500',
    success: 'text-green-600 dark:text-green-500',
  }

  return (
    <div
      className={cn(
        'p-4 rounded-lg border',
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-tight">
            {label}
          </p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <Icon className={cn('w-5 h-5', iconColorStyles[variant])} />
      </div>
    </div>
  )
}
