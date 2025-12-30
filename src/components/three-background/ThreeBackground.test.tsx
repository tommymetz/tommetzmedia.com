import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ThreeBackground } from './ThreeBackground'
import { useRef } from 'react'

// Mock @react-three/fiber Canvas component since WebGL isn't available in test environment
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="three-canvas">{children}</div>,
  useFrame: vi.fn(),
}))

describe('ThreeBackground', () => {
  it('renders the canvas component', () => {
    const TestWrapper = () => {
      const scrollRef = useRef<number>(0)
      return <ThreeBackground scrollRef={scrollRef} />
    }

    const { container } = render(<TestWrapper />)
    const canvas = container.querySelector('[data-testid="three-canvas"]')

    expect(canvas).toBeInTheDocument()
  })

  it('renders without crashing', () => {
    const TestWrapper = () => {
      const scrollRef = useRef<number>(0)
      return <ThreeBackground scrollRef={scrollRef} />
    }

    expect(() => render(<TestWrapper />)).not.toThrow()
  })
})
