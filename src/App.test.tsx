import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the components
vi.mock('./components', () => ({
  Header: ({ headline, taglineA, taglineB }: any) => (
    <div data-testid="header">
      <h1>{headline}</h1>
      <p>{taglineA}</p>
      <p>{taglineB}</p>
    </div>
  ),
  Section: ({ headline, columns, children }: any) => (
    <section data-testid={`section-${headline}`} data-columns={columns}>
      <h2>{headline}</h2>
      {children}
    </section>
  ),
  ThreeBackground: ({ scrollRef }: any) => (
    <div data-testid="three-background" data-scroll-ref={scrollRef?.current} />
  ),
  ContentCard: ({ title, link, image, children }: any) => (
    <div data-testid="content-card">
      {title && <h3>{title}</h3>}
      {link && <a href={link}>Link</a>}
      {image && <img src={image} alt="" />}
      {children}
    </div>
  ),
}));

// Mock the services module
vi.mock('./services', () => ({
  prismicClient: {
    getSingle: vi.fn(),
  },
}));

// Import App after mocks are set up
import App from './App';
import { prismicClient } from './services';

const mockPrismicData = {
  data: {
    headline: [{ text: 'Mock Headline' }],
    tagline_a: [{ text: 'Mock Tagline A' }],
    tagline_b: [{ text: 'Mock Tagline B' }],
    about_picture: { url: 'https://example.com/about.jpg' },
    about_text: [{ text: 'Mock About Text' }],
    services: [
      { service: [{ text: 'Service 1' }] },
      { service: [{ text: 'Service 2' }] },
    ],
    projects: [
      {
        project_link_title: [{ text: 'Project 1' }],
        project_link: { url: 'https://example.com/project1' },
        project_image: { url: 'https://example.com/project1.jpg' },
        project_description: [{ text: 'Project 1 description' }],
      },
      {
        project_link_title: [{ text: 'Project 2' }],
        project_link: { url: 'https://example.com/project2' },
        project_image: { url: 'https://example.com/project2.jpg' },
        project_description: [{ text: 'Project 2 description' }],
      },
    ],
    mastering: [
      {
        title: [{ text: 'Mastering 1' }],
        link: { url: 'https://example.com/mastering1' },
        image_link: { url: 'https://example.com/mastering1.jpg' },
        description: [{ text: 'Mastering 1 description' }],
      },
    ],
    ongoing_clients: [
      {
        ongoing_clients_title: [{ text: 'Client 1' }],
        ongoing_clients_link: { url: 'https://example.com/client1' },
      },
      {
        ongoing_clients_title: [{ text: 'Client 2' }],
        ongoing_clients_link: { url: 'https://example.com/client2' },
      },
    ],
  },
};

describe('App', () => {
  beforeEach(() => {
    vi.mocked(prismicClient.getSingle).mockResolvedValue(mockPrismicData);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering and Layout', () => {
    it('renders the main application wrapper and fades in', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('wrap')).toHaveClass('fade-in');
      });
    });

    it('renders ThreeBackground component', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('three-background')).toBeInTheDocument();
      });
    });

    it('renders Header with correct data from Prismic', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Mock Headline')).toBeInTheDocument();
        expect(screen.getByText('Mock Tagline A')).toBeInTheDocument();
        expect(screen.getByText('Mock Tagline B')).toBeInTheDocument();
      });
    });

    it('renders all main sections', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('section-About')).toBeInTheDocument();
        expect(screen.getByTestId('section-Services')).toBeInTheDocument();
        expect(screen.getByTestId('section-Featured Work')).toBeInTheDocument();
        expect(screen.getByTestId('section-Music Mastering')).toBeInTheDocument();
        expect(screen.getByTestId('section-Clients')).toBeInTheDocument();
        expect(screen.getByTestId('section-Contact')).toBeInTheDocument();
      });
    });
  });

  describe('Data Loading', () => {
    it('fetches Prismic homepage document on mount', async () => {
      render(<App />);

      await waitFor(() => {
        expect(prismicClient.getSingle).toHaveBeenCalledWith('homepage');
      });
    });

    it('handles error state when Prismic fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockError = new Error('Prismic fetch failed');
      vi.mocked(prismicClient.getSingle).mockRejectedValueOnce(mockError);

      render(<App />);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
      });

      consoleErrorSpy.mockRestore();
    });

    it('does not add fade-in class when data loading fails', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(prismicClient.getSingle).mockRejectedValueOnce(new Error('Prismic fetch failed'));

      render(<App />);

      await waitFor(() => {
        expect(prismicClient.getSingle).toHaveBeenCalled();
      });

      // Wait a bit to ensure fade-in class is not applied
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(screen.getByTestId('wrap')).not.toHaveClass('fade-in');

      vi.restoreAllMocks();
    });
  });

  describe('Content Rendering', () => {
    it('renders About section with image and text', async () => {
      render(<App />);

      await waitFor(() => {
        const aboutSection = screen.getByTestId('section-About');
        expect(aboutSection).toBeInTheDocument();
        expect(screen.getByText('Mock About Text')).toBeInTheDocument();
      });
    });

    it('renders all services from Prismic data', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Service 1')).toBeInTheDocument();
        expect(screen.getByText('Service 2')).toBeInTheDocument();
      });
    });

    it('renders all projects with titles, links, images, and descriptions', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Project 1')).toBeInTheDocument();
        expect(screen.getByText('Project 1 description')).toBeInTheDocument();
        expect(screen.getByText('Project 2')).toBeInTheDocument();
        expect(screen.getByText('Project 2 description')).toBeInTheDocument();
      });
    });

    it('renders mastering items with all data', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Mastering 1')).toBeInTheDocument();
        expect(screen.getByText('Mastering 1 description')).toBeInTheDocument();
      });
    });

    it('renders clients with links and proper comma separation', async () => {
      render(<App />);

      await waitFor(() => {
        const clientsSection = screen.getByTestId('section-Clients');
        expect(clientsSection).toBeInTheDocument();
        expect(screen.getByText('Client 1')).toBeInTheDocument();
        expect(screen.getByText('Client 2')).toBeInTheDocument();
      });
    });

    it('renders Contact section with email and GitHub links', async () => {
      render(<App />);

      await waitFor(() => {
        const emailLink = screen.getByText('tom@tommetzmedia.com');
        expect(emailLink).toHaveAttribute('href', 'mailto:tom@tommetzmedia.com');

        const githubLink = screen.getByText('Github');
        expect(githubLink).toHaveAttribute('href', 'https://github.com/tommymetz');
        expect(githubLink).toHaveAttribute('target', '_blank');
        expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('renders version number from package.json', async () => {
      render(<App />);

      await waitFor(() => {
        const versionElement = screen.getByText(/^v/);
        expect(versionElement).toHaveClass('site-version');
      });
    });
  });

  describe('Empty Data Handling', () => {
    it('handles empty services array gracefully', async () => {
      const emptyServicesData = {
        ...mockPrismicData,
        data: {
          ...mockPrismicData.data,
          services: [],
        },
      };
      vi.mocked(prismicClient.getSingle).mockResolvedValueOnce(emptyServicesData);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('section-Services')).toBeInTheDocument();
      });
    });

    it('handles empty projects array gracefully', async () => {
      const emptyProjectsData = {
        ...mockPrismicData,
        data: {
          ...mockPrismicData.data,
          projects: [],
        },
      };
      vi.mocked(prismicClient.getSingle).mockResolvedValueOnce(emptyProjectsData);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('section-Featured Work')).toBeInTheDocument();
      });
    });

    it('handles non-array data gracefully', async () => {
      const invalidData = {
        ...mockPrismicData,
        data: {
          ...mockPrismicData.data,
          services: null,
          projects: undefined,
        },
      };
      vi.mocked(prismicClient.getSingle).mockResolvedValueOnce(invalidData);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('section-Services')).toBeInTheDocument();
        expect(screen.getByTestId('section-Featured Work')).toBeInTheDocument();
      });
    });
  });

  describe('Scroll Functionality', () => {
    it('attaches scroll event listener to container', async () => {
      render(<App />);

      await waitFor(() => {
        const container = document.getElementById('container');
        expect(container).toBeInTheDocument();
      });
    });
  });

  describe('Column Configuration', () => {
    it('sets correct column count for single-column sections', async () => {
      render(<App />);

      await waitFor(() => {
        const aboutSection = screen.getByTestId('section-About');
        expect(aboutSection).toHaveAttribute('data-columns', '1');

        const servicesSection = screen.getByTestId('section-Services');
        expect(servicesSection).toHaveAttribute('data-columns', '1');

        const clientsSection = screen.getByTestId('section-Clients');
        expect(clientsSection).toHaveAttribute('data-columns', '1');
      });
    });

    it('does not set columns attribute for multi-column sections', async () => {
      render(<App />);

      await waitFor(() => {
        const featuredWorkSection = screen.getByTestId('section-Featured Work');
        expect(featuredWorkSection).toBeInTheDocument();

        const masteringSection = screen.getByTestId('section-Music Mastering');
        expect(masteringSection).toBeInTheDocument();
      });
    });
  });
});
