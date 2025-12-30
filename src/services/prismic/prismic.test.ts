import { describe, it, expect } from 'vitest';
import { prismicClient } from './prismic';

describe('Prismic Service', () => {
  it('should have a defined prismicClient', () => {
    expect(prismicClient).toBeDefined();
  });
});
