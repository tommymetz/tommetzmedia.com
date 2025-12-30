import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';


describe('App', () => {
  it('renders the main application wrapper and fades in', async () => {
    render(<App />);

    // Wait for the fade-in class to be applied, which indicates loading is complete
    await waitFor(() => {
      expect(screen.getByTestId('wrap')).toHaveClass('fade-in');
    });
  });
});
