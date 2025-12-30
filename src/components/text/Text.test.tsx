import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Text } from './Text';

describe('Text', () => {
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
});
