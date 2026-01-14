/**
 * Tests for lib/utils.ts utility functions
 */

import { formatPrice, cn } from '@/lib/utils';

describe('formatPrice', () => {
  it('should format standard prices correctly', () => {
    expect(formatPrice(100)).toBe('$100.00');
    expect(formatPrice(1999.99)).toBe('$1,999.99');
    expect(formatPrice(599)).toBe('$599.00');
  });

  it('should handle zero correctly', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('should handle decimal prices correctly', () => {
    expect(formatPrice(0.50)).toBe('$0.50');
    expect(formatPrice(99.99)).toBe('$99.99');
    expect(formatPrice(1.01)).toBe('$1.01');
  });

  it('should handle very large numbers', () => {
    expect(formatPrice(99999.99)).toBe('$99,999.99');
    expect(formatPrice(1000000)).toBe('$1,000,000.00');
  });

  it('should round to 2 decimal places', () => {
    expect(formatPrice(10.999)).toBe('$11.00');
    expect(formatPrice(10.994)).toBe('$10.99');
    expect(formatPrice(10.995)).toBe('$11.00');
  });

  it('should handle negative numbers', () => {
    expect(formatPrice(-100)).toBe('-$100.00');
    expect(formatPrice(-0.50)).toBe('-$0.50');
  });
});

describe('cn (className utility)', () => {
  it('should merge single classes', () => {
    expect(cn('foo')).toBe('foo');
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', true && 'bar')).toBe('foo bar');
    expect(cn('foo', false && 'bar')).toBe('foo');
    expect(cn('foo', undefined)).toBe('foo');
    expect(cn('foo', null)).toBe('foo');
  });

  it('should handle arrays of classes', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
    expect(cn('base', ['foo', 'bar'])).toBe('base foo bar');
  });

  it('should handle object syntax', () => {
    expect(cn({ foo: true, bar: false })).toBe('foo');
    expect(cn({ foo: true, bar: true })).toBe('foo bar');
  });

  it('should merge Tailwind classes correctly', () => {
    // tailwind-merge should handle conflicting classes
    expect(cn('p-4', 'p-2')).toBe('p-2');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('mt-4', 'mt-2')).toBe('mt-2');
  });

  it('should preserve non-conflicting Tailwind classes', () => {
    expect(cn('p-4', 'mt-2')).toBe('p-4 mt-2');
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
  });

  it('should handle empty input', () => {
    expect(cn()).toBe('');
    expect(cn('')).toBe('');
    expect(cn('', '')).toBe('');
  });

  it('should handle complex combinations', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn(
      'base-class',
      isActive && 'active',
      isDisabled && 'disabled',
      { 'hover:bg-blue-500': true }
    )).toBe('base-class active hover:bg-blue-500');
  });
});
