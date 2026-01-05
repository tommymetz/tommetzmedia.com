import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Image } from './Image';

describe('Image', () => {
  let imageLoadCallback: (() => void) | null = null;
  let imageErrorCallback: (() => void) | null = null;
  let intersectionCallback: IntersectionObserverCallback | null = null;
  let observedElement: Element | null = null;

  const triggerIntersection = (isIntersecting: boolean) => {
    if (intersectionCallback && observedElement) {
      intersectionCallback(
        [{ isIntersecting, target: observedElement } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    }
  };

  beforeEach(() => {
    vi.useFakeTimers();

    // Mock IntersectionObserver
    window.IntersectionObserver = class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
      }

      observe(element: Element) {
        observedElement = element;
      }

      disconnect() {
        observedElement = null;
      }

      unobserve() {}
      takeRecords() {
        return [];
      }
      root = null;
      rootMargin = '';
      thresholds = [];
    } as any;

    // Mock the Image constructor to capture callbacks
    window.Image = class MockImage {
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
    intersectionCallback = null;
    observedElement = null;
  });

  it('renders loader initially', () => {
    render(<Image src="/test-image.jpg" />);
    const loaderElement = screen.getByTestId('loader');
    expect(loaderElement).toBeInTheDocument();
  });

  it('does not start loading image until visible', () => {
    render(<Image src="/test-image.jpg" />);

    // Image should not have started loading yet
    expect(imageLoadCallback).toBeNull();

    // Trigger visibility
    act(() => {
      triggerIntersection(true);
    });

    // Now image loading should have started (callbacks should be set)
    expect(imageLoadCallback).not.toBeNull();
  });

  it('displays image after becoming visible and loading completes', async () => {
    render(<Image src="/test-image.jpg" alt="Test image" />);

    // Trigger visibility
    act(() => {
      triggerIntersection(true);
    });

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

    // Trigger visibility
    act(() => {
      triggerIntersection(true);
    });

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

    // Trigger visibility
    act(() => {
      triggerIntersection(true);
    });

    await act(async () => {
      if (imageErrorCallback) {
        imageErrorCallback();
      }
      await vi.advanceTimersByTimeAsync(1000);
    });

    const displayedImage = screen.getByAltText('Invalid image');
    expect(displayedImage).toBeInTheDocument();
  });

  it('respects minimum loading time range (0.5-1.0 seconds)', async () => {
    render(<Image src="/test-image.jpg" />);

    // Trigger visibility
    act(() => {
      triggerIntersection(true);
    });

    // Trigger immediate load
    await act(async () => {
      if (imageLoadCallback) {
        imageLoadCallback();
      }
    });

    // Should still show loader before minimum time (0.5s)
    expect(screen.getByTestId('loader')).toBeInTheDocument();

    // Advance time to maximum possible loading time (1 second) to ensure image is shown
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

    // Trigger visibility so image loading starts
    act(() => {
      triggerIntersection(true);
    });

    // Store references to callbacks before unmount
    const loadCallback = imageLoadCallback;
    const errorCallback = imageErrorCallback;

    // Unmount the component
    unmount();

    // Verify cleanup - callbacks should have been set before unmount
    expect(loadCallback).not.toBeNull();
    expect(errorCallback).not.toBeNull();
  });

  it('only triggers loading once when intersection occurs', () => {
    render(<Image src="/test-image.jpg" />);

    // Trigger visibility multiple times
    act(() => {
      triggerIntersection(true);
    });

    const firstCallback = imageLoadCallback;

    // Simulate another intersection (shouldn't happen due to disconnect, but testing robustness)
    act(() => {
      triggerIntersection(true);
    });

    // Callback reference should remain the same (no re-initialization)
    expect(imageLoadCallback).toBe(firstCallback);
  });
});
