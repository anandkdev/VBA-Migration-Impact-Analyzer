'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingState({ message = 'Loading...', size = 'md' }: LoadingStateProps) {
  const iconSize = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size]

  const textSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }[size]

  return (
    <div className="h-full flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${iconSize} animate-spin text-blue-500`} />
      <p className={`${textSize} text-muted-foreground font-medium`}>{message}</p>
    </div>
  )
}
