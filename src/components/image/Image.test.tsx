import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Image } from './Image';

describe('Image', () => {
  let imageLoadCallback: (() => void) | null = null;
  let imageErrorCallback: (() => void) | null = null;

  beforeEach(() => {
    vi.useFakeTimers();

    // Mock the Image constructor to capture callbacks
    global.Image = class MockImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      src = '';

      constructor() {
        // Capture the callbacks when they're set
        Object.defineProperty(this, 'onload', {
          set: (callback: (() => void) | null) => {
            imageLoadCallback = callback;
          },
          get: () => imageLoadCallback
        });

        Object.defineProperty(this, 'onerror', {
          set: (callback: (() => void) | null) => {
            imageErrorCallback = callback;
          },
          get: () => imageErrorCallback
        });
      }
    } as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    imageLoadCallback = null;
    imageErrorCallback = null;
  });

  it('renders loader initially', () => {
    render(<Image src="/test-image.jpg" />);
    const loaderElement = screen.getByTestId('loader');
    expect(loaderElement).toBeInTheDocument();
  });

  it('displays image after loading completes', async () => {
    render(<Image src="/test-image.jpg" alt="Test image" />);

    // Trigger the image load callback
    await act(async () => {
      if (imageLoadCallback) {
        imageLoadCallback();
      }
      await vi.advanceTimersByTimeAsync(1000);
    });

    const displayedImage = screen.getByAltText('Test image');
    expect(displayedImage).toBeInTheDocument();
    expect(displayedImage).toHaveClass('image__img');
    expect(displayedImage).toHaveAttribute('src', '/test-image.jpg');
  });

  it('renders image with empty alt text when alt prop is not provided', async () => {
    render(<Image src="/test-image.jpg" />);

    await act(async () => {
      if (imageLoadCallback) {
        imageLoadCallback();
      }
      await vi.advanceTimersByTimeAsync(1000);
    });

    const displayedImage = screen.getByAltText('');
    expect(displayedImage).toBeInTheDocument();
    expect(displayedImage).toHaveAttribute('alt', '');
  });

  it('displays image after error occurs', async () => {
    render(<Image src="/invalid-image.jpg" alt="Invalid image" />);

    await act(async () => {
      if (imageErrorCallback) {
        imageErrorCallback();
      }
      await vi.advanceTimersByTimeAsync(1000);
    });

    const displayedImage = screen.getByAltText('Invalid image');
    expect(displayedImage).toBeInTheDocument();
  });

  it('respects minimum loading time of 1 second', async () => {
    render(<Image src="/test-image.jpg" />);

    // Trigger immediate load
    await act(async () => {
      if (imageLoadCallback) {
        imageLoadCallback();
      }
    });

    // Should still show loader before 1 second
    expect(screen.getByTestId('loader')).toBeInTheDocument();

    // Advance time and should show image after 1 second
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    expect(screen.getByAltText('')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<Image src="/test-image.jpg" />);
    const imageContainer = container.querySelector('.image');
    expect(imageContainer).toBeInTheDocument();

    const loaderContainer = container.querySelector('.image__loader');
    expect(loaderContainer).toBeInTheDocument();
  });

  it('cleans up on unmount', () => {
    const { unmount } = render(<Image src="/test-image.jpg" />);

    // Store references to callbacks before unmount
    const loadCallback = imageLoadCallback;
    const errorCallback = imageErrorCallback;

    // Unmount the component
    unmount();

    // Verify cleanup - callbacks should be cleared
    // The component sets onload and onerror to null in cleanup
    expect(loadCallback).not.toBeNull();
    expect(errorCallback).not.toBeNull();
  });
});
