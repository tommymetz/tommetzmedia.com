import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Section } from './Section';

vi.mock('../text/Text', () => ({
  Text: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

describe('Section', () => {
  it('renders the headline and children', () => {
    const headline = 'Test Headline';
    const childText = 'Test Child';
    render(
      <Section headline={headline}>
        <div>{childText}</div>
      </Section>
    );

    expect(screen.getByRole('heading', { level: 2, name: headline })).toBeInTheDocument();
    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  it('renders with the default number of columns', () => {
    render(<Section><div>Child</div></Section>);
    const sectionContent = screen.getByText('Child').parentElement;
    expect(sectionContent).toHaveClass('section-content columns-2');
  });

  it('renders with a specified number of columns', () => {
    render(<Section columns={3}><div>Child</div></Section>);
    const sectionContent = screen.getByText('Child').parentElement;
    expect(sectionContent).toHaveClass('section-content columns-3');
  });

  it('renders without a headline', () => {
    render(<Section><div>Child</div></Section>);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
