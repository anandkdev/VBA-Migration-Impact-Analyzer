'use client'

import * as React from 'react'

interface ThemeProviderProps {
  attribute: string
  defaultTheme: string
  enableSystem: boolean
  children: React.ReactNode
}

export function ThemeProvider({
  enableSystem,
  children,
}: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const isDark =
      enableSystem &&
      window.matchMedia('(prefers-color-scheme: dark)').matches

    const htmlElement = document.documentElement
    if (isDark) {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
  }, [enableSystem])

  if (!mounted) {
    return children
  }

  return children
}
