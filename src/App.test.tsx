import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the prismic client
vi.mock('./services', () => ({
  prismicClient: {
    getSingle: vi.fn().mockResolvedValue({
      data: {
        headline: [{ text: 'Mock Headline' }],
        tagline_a: [{ text: 'Mock Tagline A' }],
        tagline_b: [{ text: 'Mock Tagline B' }],
        about_picture: { url: 'mock-url' },
        about_text: [{ text: 'Mock About Text' }],
        services: [],
        projects: [],
        mastering: [],
        ongoing_clients: [],
      },
    }),
  },
}));

describe('App', () => {
  it('renders the main application wrapper and fades in', async () => {
    render(<App />);

    // Wait for the fade-in class to be applied, which indicates loading is complete
    await waitFor(() => {
      expect(screen.getByTestId('wrap')).toHaveClass('fade-in');
    });
  });
});
