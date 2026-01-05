import { useEffect, useState, RefObject } from 'react'

export const useWhenVisible = (containerRef: RefObject<HTMLElement | null>) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0 }
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [containerRef])

  return isVisible
}
