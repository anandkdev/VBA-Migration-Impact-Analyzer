'use client'

import React from 'react'
import { AlertCircle } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <AlertCircle className="w-12 h-12 text-muted-foreground" />
      <div className="text-center">
        <h3 className="font-semibold">No Content</h3>
        <p className="text-sm text-muted-foreground mt-1">
          This section is not available yet
        </p>
      </div>
    </div>
  )
}
