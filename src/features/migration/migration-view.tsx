'use client'

import React from 'react'
import { EmptyState } from '@/utils/empty-states'

export function MigrationView() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <EmptyState
        icon="🔧"
        title="Migration Rule Engine"
        description="Define and manage migration rules for your VBA project transformations. This feature will be available in a future phase."
        action={undefined}
      />
    </div>
  )
}
