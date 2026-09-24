import { describe, it, expect } from 'vitest'
import { backgroundOpacity } from './backgroundOpacity'

// 1000px viewport, 10000px content (max scrollTop 9000), fade-out target at 3000px
const base = { scrollHeight: 10000, viewportHeight: 1000, fadeOutEnd: 3000 }

describe('backgroundOpacity', () => {
  it('is fully visible before the fade-out window', () => {
    expect(backgroundOpacity({ ...base, scrollTop: 0 })).toBe(1)
    expect(backgroundOpacity({ ...base, scrollTop: 1500 })).toBe(1)
  })

  it('fades out linearly as the target approaches the viewport top', () => {
    expect(backgroundOpacity({ ...base, scrollTop: 2250 })).toBeCloseTo(0.5)
  })

  it('is fully hidden once the target reaches the viewport top', () => {
    expect(backgroundOpacity({ ...base, scrollTop: 3000 })).toBe(0)
    expect(backgroundOpacity({ ...base, scrollTop: 8500 })).toBe(0)
  })

  it('fades back in over the last half viewport of scroll', () => {
    expect(backgroundOpacity({ ...base, scrollTop: 8750 })).toBeCloseTo(0.5)
    expect(backgroundOpacity({ ...base, scrollTop: 9000 })).toBe(1)
  })
})
