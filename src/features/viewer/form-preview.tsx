'use client'

import React from 'react'

interface FormPreviewProps {
  fileId: string
}

export function FormPreview({}: FormPreviewProps) {
  return (
    <div className="h-40 bg-muted/50 border-b border-border flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl mb-2">🖥️</div>
        <p className="text-sm text-muted-foreground">UserForm preview coming soon</p>
      </div>
    </div>
  )
}
