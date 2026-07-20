import { useState, useCallback } from 'react'

export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)

      const timeout = setTimeout(() => {
        setCopiedText(null)
      }, 2000)

      return () => clearTimeout(timeout)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return undefined
    }
  }, [])

  const isCopied = (text: string) => copiedText === text

  return { copy, isCopied, copiedText }
}
