import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// This will hold the instance created by the mock constructor
let imageInstance: MockImage;

// A mock class to be used as the Image constructor
class MockImage {
  onload: () => void = () => {};
  onerror: () => void = () => {};
  src: string = '';
  constructor() {
    imageInstance = this; // Capture the instance for the test to use
  }
}

// Stub the global Image constructor BEFORE the component is imported
vi.stubGlobal('Image', MockImage);

import { Image } from './Image'; // Now import the component

vi.mock('../loader/Loader', () => ({
  Loader: () => <div>Loader</div>,
}));

describe('Image', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout'] });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders the loader initially and then the image', () => {
    const src = 'test-image.jpg';
    const alt = 'Test Image';

    render(<Image src={src} alt={alt} />);

    expect(screen.getByText('Loader')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    expect(imageInstance).toBeDefined();

    act(() => {
      imageInstance.onload();
    });

    act(() => {
      vi.runAllTimers();
    });

    expect(screen.queryByText('Loader')).not.toBeInTheDocument();

    const imgElement = screen.getByRole('img');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', src);
    expect(imgElement).toHaveAttribute('alt', alt);
  });

  it('renders the image even if it fails to load', () => {
    const src = 'test-image.jpg';
    const alt = 'Test Image';

    render(<Image src={src} alt={alt} />);

    expect(screen.getByText('Loader')).toBeInTheDocument();
    expect(imageInstance).toBeDefined();

    act(() => {
      imageInstance.onerror();
    });

    act(() => {
      vi.runAllTimers();
    });

    expect(screen.queryByText('Loader')).not.toBeInTheDocument();
    const imgElement = screen.getByRole('img');
    expect(imgElement).toBeInTheDocument();
  });
});
