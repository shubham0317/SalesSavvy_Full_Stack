import { describe, it, expect } from 'vitest';
import { formatCurrency, capitalize } from '../formatters';

describe('formatters utility', () => {
  it('formats numeric values into INR currency format', () => {
    const formatted = formatCurrency(1200);
    expect(formatted).toContain('1,200');
  });

  it('handles 0 and undefined inputs gracefully', () => {
    expect(formatCurrency(0)).toContain('0');
    expect(formatCurrency(null)).toContain('0');
  });

  it('capitalizes string inputs correctly', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('WORLD')).toBe('World');
    expect(capitalize('')).toBe('');
  });
});
