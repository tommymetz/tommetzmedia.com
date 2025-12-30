import { vi } from 'vitest';

vi.mock('../../services', () => ({
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
