'use client'

import React from 'react'
import { Spinner } from '@/components/loaders/spinner'

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  fullScreen?: boolean
}

/**
 * Loading overlay with spinner and message
 * Can be full screen or overlay current element
 */
export function LoadingOverlay({
  isLoading,
  message = 'Loading...',
  fullScreen = false,
}: LoadingOverlayProps) {
  if (!isLoading) return null

  const baseClasses = 'flex items-center justify-center gap-3 bg-background/80 backdrop-blur-sm'
  const positionClasses = fullScreen
    ? 'fixed inset-0 z-50'
    : 'absolute inset-0 rounded-lg'

  return (
    <div className={`${baseClasses} ${positionClasses}`}>
      <Spinner size="md" />
      {message && <span className="text-sm text-muted-foreground">{message}</span>}
    </div>
  )
}
