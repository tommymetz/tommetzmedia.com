import './mocks/prismic';
import '@testing-library/jest-dom';
import ResizeObserver from 'resize-observer-polyfill';

window.ResizeObserver = ResizeObserver;

// Mock IntersectionObserver for all tests
class MockIntersectionObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
  root = null
  rootMargin = ''
  thresholds = []
}

(window as any).IntersectionObserver = MockIntersectionObserver;
