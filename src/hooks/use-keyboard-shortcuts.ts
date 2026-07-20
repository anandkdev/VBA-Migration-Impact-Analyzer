import { useEffect } from 'react'

interface KeyboardShortcut {
  keys: string[]
  handler: () => void
  description: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(({ keys, handler }) => {
        const isMatched = keys.every((key) => {
          if (key.toLowerCase() === 'ctrl') return event.ctrlKey || event.metaKey
          if (key.toLowerCase() === 'shift') return event.shiftKey
          if (key.toLowerCase() === 'alt') return event.altKey
          return event.key.toLowerCase() === key.toLowerCase()
        })

        if (isMatched) {
          event.preventDefault()
          handler()
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}
