import { useEffect, useRef } from 'react'

/**
 * Hook for smart scrolling to an element
 * Centers the element and optionally highlights it
 */
export function useSmartScroll(
  targetLineNumber: number | null,
  containerRef: React.RefObject<HTMLDivElement>
) {
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!targetLineNumber || !containerRef.current) return

    // Clear any pending timeouts
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // Delay scroll to ensure DOM is ready
    scrollTimeoutRef.current = setTimeout(() => {
      const lineElement = document.querySelector(
        `[data-line="${targetLineNumber}"]`
      )

      if (lineElement && containerRef.current) {
        // Calculate scroll position to center the line
        const containerHeight = containerRef.current.clientHeight
        const elementTop = (lineElement as HTMLElement).offsetTop
        const elementHeight = (lineElement as HTMLElement).offsetHeight

        const scrollTop =
          elementTop - containerHeight / 2 + elementHeight / 2

        containerRef.current.scrollTop = Math.max(0, scrollTop)

        // Add highlight animation
        const highlightElement = lineElement as HTMLElement
        highlightElement.classList.add('animate-pulse')

        // Remove highlight after 3 seconds
        setTimeout(() => {
          highlightElement.classList.remove('animate-pulse')
        }, 3000)
      }
    }, 50)

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [targetLineNumber, containerRef])
}
