import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('renders the headline and taglines', () => {
    const headline = 'Test Headline';
    const taglineA = 'Test Tagline A';
    const taglineB = 'Test Tagline B';

    render(<Header headline={headline} taglineA={taglineA} taglineB={taglineB} />);

    const headings = screen.getAllByRole('heading', { level: 1 });

    // The Text component replaces spaces with non-breaking spaces ('\u00A0')
    // and wraps each character in a span. We check the textContent of the heading elements.
    expect(headings[0].textContent).toBe(headline.replace(/ /g, '\u00A0'));
    expect(headings[1].textContent).toBe(taglineA.replace(/ /g, '\u00A0'));
    expect(headings[2].textContent).toBe(taglineB.replace(/ /g, '\u00A0'));
  });
});
