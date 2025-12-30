import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThreeBackground } from './ThreeBackground';
import React from 'react';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, className }: { children: React.ReactNode, className: string }) => <div data-testid="canvas" className={className}>{children}</div>,
  useFrame: () => {},
}));

describe('ThreeBackground', () => {
  it('renders the canvas element', () => {
    const scrollRef = React.createRef<number>();
    render(<ThreeBackground scrollRef={scrollRef} />);
    const canvasElement = screen.getByTestId('canvas');
    expect(canvasElement).toBeInTheDocument();
    expect(canvasElement).toHaveClass('three-background');
  });
});
