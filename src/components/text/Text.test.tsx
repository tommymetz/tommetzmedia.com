import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Text } from './Text';
import { act } from 'react';

describe('Text', () => {
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
    intersectionCallback = null
    observedElement = null
  })

  it('renders a paragraph by default', () => {
    render(<Text>Hello World</Text>);
    const pElement = screen.getByText('Hello World');
    expect(pElement.tagName).toBe('P');
    expect(pElement).toHaveClass('text text--body');
  });

  it('renders the correct heading level', () => {
    render(<Text level="h1">Heading 1</Text>);
    const h1Element = screen.getByRole('heading', { level: 1, name: 'Heading 1' });
    expect(h1Element).toBeInTheDocument();
    expect(h1Element).toHaveClass('text text--h1');
  });

  it('applies the headline class', () => {
    render(<Text headline>Headline Text</Text>);
    expect(screen.getByText('Headline Text')).toHaveClass('text--headline');
  });

  it('applies a custom className', () => {
    render(<Text className="custom-class">Custom Text</Text>);
    expect(screen.getByText('Custom Text')).toHaveClass('custom-class');
  });

  describe('Animation', () => {
    it('wraps each character in a span when animated', () => {
      render(<Text animate>Animate Me</Text>);
      const textElement = screen.getByTestId('text-component');
      const spans = textElement.querySelectorAll('.animated-letter');
      expect(spans).toHaveLength('Animate Me'.length);
      expect(textElement.textContent).toBe('Animate\u00A0Me');
    });

    it('replaces spaces with non-breaking spaces when animated', () => {
      const textWithSpace = 'Hello World';
      render(<Text animate>{textWithSpace}</Text>);
      const textElement = screen.getByTestId('text-component');
      expect(textElement.textContent).toBe('Hello\u00A0World');
    });

    it('applies animation delay to each character', () => {
      const animationDelaySeconds = 0.5;
      render(<Text animate animationDelaySeconds={animationDelaySeconds}>Hi</Text>);
      const textElement = screen.getByTestId('text-component');
      const spans = textElement.querySelectorAll('.animated-letter');

      expect(spans[0]).toHaveStyle(`animation-delay: ${animationDelaySeconds}s`);
      expect(spans[1]).toHaveStyle(`animation-delay: ${animationDelaySeconds + 0.05}s`);
    });

    it('does not animate non-string children', () => {
      render(<Text animate><div>Not a string</div></Text>);
      const divElement = screen.getByText('Not a string');
      expect(divElement.tagName).toBe('DIV');
      expect(divElement.querySelector('.animated-letter')).not.toBeInTheDocument();
    });
  });

  it('renders children without animation when animate is false', () => {
    render(<Text>No Animation</Text>);
    const textElement = screen.getByText('No Animation');
    expect(textElement.querySelector('.animated-letter')).not.toBeInTheDocument();
  });

  describe('animateWhenVisible', () => {
    it('does not animate initially when animateWhenVisible is true', () => {
      render(<Text animate animateWhenVisible>Animate When Visible</Text>);
      const textElement = screen.getByTestId('text-component');
      // Should not have animated letters initially since it's not visible yet
      expect(textElement.querySelector('.animated-letter')).not.toBeInTheDocument();
    });

    it('animates after element becomes visible', async () => {
      const { rerender } = render(<Text animate animateWhenVisible>Animate When Visible</Text>);
      const textElement = screen.getByTestId('text-component');
      
      // Initially not animated
      expect(textElement.querySelector('.animated-letter')).not.toBeInTheDocument();
      
      // Trigger visibility
      await act(async () => {
        triggerIntersection(true);
      });
      
      // Re-render to apply state changes
      rerender(<Text animate animateWhenVisible>Animate When Visible</Text>);
      
      // After becoming visible, should have animated letters
      const spans = textElement.querySelectorAll('.animated-letter');
      expect(spans.length).toBeGreaterThan(0);
    });

    it('does not animate if animate is false even when visible', async () => {
      const { rerender } = render(<Text animateWhenVisible>No Animate Prop</Text>);
      const textElement = screen.getByTestId('text-component');
      
      // Trigger visibility
      await act(async () => {
        triggerIntersection(true);
      });
      
      // Re-render to apply state changes
      rerender(<Text animateWhenVisible>No Animate Prop</Text>);
      
      // Should still not animate since animate prop is false
      expect(textElement.querySelector('.animated-letter')).not.toBeInTheDocument();
    });

    it('animates immediately when animate is true but animateWhenVisible is false', () => {
      render(<Text animate>Immediate Animation</Text>);
      const textElement = screen.getByTestId('text-component');
      // Should have animated letters immediately
      const spans = textElement.querySelectorAll('.animated-letter');
      expect(spans.length).toBeGreaterThan(0);
    });
  });
});
