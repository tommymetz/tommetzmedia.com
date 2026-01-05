import { renderHook } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useWhenVisible } from './useWhenVisible'
import { useRef } from 'react'

describe('useWhenVisible', () => {
  let intersectionCallback: IntersectionObserverCallback | null = null
  let observedElement: Element | null = null

  const triggerIntersection = (isIntersecting: boolean) => {
    if (intersectionCallback && observedElement) {
      intersectionCallback(
        [{ isIntersecting, target: observedElement } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
    }
  }

  beforeEach(() => {
    // Mock IntersectionObserver
    window.IntersectionObserver = class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback
      }

      observe(element: Element) {
        observedElement = element
      }

      disconnect() {
        observedElement = null
      }

      unobserve() {}
      takeRecords() {
        return []
      }
      root = null
      rootMargin = ''
      thresholds = []
    } as any
  })

  afterEach(() => {
    vi.restoreAllMocks()
    intersectionCallback = null
    observedElement = null
  })

  it('returns false initially', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(document.createElement('div'))
      return useWhenVisible(ref)
    })

    expect(result.current).toBe(false)
  })

  it('returns true when element becomes visible', () => {
    const { result, rerender } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(document.createElement('div'))
      return useWhenVisible(ref)
    })

    expect(result.current).toBe(false)

    // Trigger intersection
    triggerIntersection(true)
    rerender()

    expect(result.current).toBe(true)
  })

  it('sets up IntersectionObserver with correct threshold', () => {
    let observerOptions: IntersectionObserverInit | undefined

    window.IntersectionObserver = class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        intersectionCallback = callback
        observerOptions = options
      }

      observe(element: Element) {
        observedElement = element
      }

      disconnect() {
        observedElement = null
      }

      unobserve() {}
      takeRecords() {
        return []
      }
      root = null
      rootMargin = ''
      thresholds = []
    } as any

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(document.createElement('div'))
      return useWhenVisible(ref)
    })

    expect(observerOptions).toEqual({ threshold: 0 })
  })

  it('handles null ref gracefully', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      return useWhenVisible(ref)
    })

    expect(result.current).toBe(false)
    expect(observedElement).toBeNull()
  })
})
