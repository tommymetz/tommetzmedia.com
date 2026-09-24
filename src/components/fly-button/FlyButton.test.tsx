import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FlyButton } from './FlyButton';

describe('FlyButton', () => {
  it('renders an accessible button reflecting the active state', () => {
    render(<FlyButton active={false} onClick={() => {}} />);
    const button = screen.getByRole('button', { name: 'Release the flies' });
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<FlyButton active onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Release the flies' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
