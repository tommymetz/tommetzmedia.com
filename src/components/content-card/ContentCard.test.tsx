import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ContentCard from './ContentCard'

// Mock the Image component to simplify testing
vi.mock('../image/Image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

describe('ContentCard', () => {
  it('renders the title', () => {
    render(<ContentCard title="Test Title" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('renders the image', () => {
    render(<ContentCard image="test-image.jpg" title="Test Title" />)
    const image = screen.getByAltText('Test Title')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'test-image.jpg')
  })

  it('renders string children', () => {
    render(<ContentCard>Test Children</ContentCard>)
    expect(screen.getByText('Test Children')).toBeInTheDocument()
  })

  it('renders React node children', () => {
    render(
      <ContentCard>
        <p>React Node Child</p>
      </ContentCard>,
    )
    expect(screen.getByText('React Node Child')).toBeInTheDocument()
  })

  it('renders a link when a link is provided', () => {
    render(<ContentCard link="https://example.com" />)
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  it('does not render a link when no link is provided', () => {
    render(<ContentCard />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders html children correctly', () => {
    const htmlContent = '<p>This is <strong>html</strong> content</p>'
    render(<ContentCard>{htmlContent}</ContentCard>)
    const strongElement = screen.getByText('html')
    expect(strongElement.tagName).toBe('STRONG')
    expect(strongElement.parentElement?.textContent).toBe('This is html content')
  })
})
