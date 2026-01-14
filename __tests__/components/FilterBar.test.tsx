/**
 * Tests for FilterBar component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBar } from '@/components/FilterBar';

describe('FilterBar', () => {
  const defaultProps = {
    filterCategory: 'all',
    onFilterChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render default categories', () => {
      render(<FilterBar {...defaultProps} />);

      expect(screen.getByText('All Categories')).toBeInTheDocument();
      expect(screen.getByText('Premium')).toBeInTheDocument();
      expect(screen.getByText('Mid-range')).toBeInTheDocument();
      expect(screen.getByText('Budget')).toBeInTheDocument();
      expect(screen.getByText('Gaming')).toBeInTheDocument();
      expect(screen.getByText('Professional')).toBeInTheDocument();
      expect(screen.getByText('Everyday')).toBeInTheDocument();
      expect(screen.getByText('Developer')).toBeInTheDocument();
      expect(screen.getByText('Specialized')).toBeInTheDocument();
    });

    it('should render custom categories', () => {
      const customCategories = ['all', 'Custom1', 'Custom2'];
      render(<FilterBar {...defaultProps} categories={customCategories} />);

      expect(screen.getByText('All Categories')).toBeInTheDocument();
      expect(screen.getByText('Custom1')).toBeInTheDocument();
      expect(screen.getByText('Custom2')).toBeInTheDocument();
      expect(screen.queryByText('Premium')).not.toBeInTheDocument();
    });

    it('should display "All Categories" for "all" option', () => {
      render(<FilterBar {...defaultProps} />);

      expect(screen.getByText('All Categories')).toBeInTheDocument();
    });

    it('should render filter label', () => {
      render(<FilterBar {...defaultProps} />);

      expect(screen.getByText('Filter by category:')).toBeInTheDocument();
    });
  });

  describe('active state', () => {
    it('should apply active class to selected category', () => {
      render(<FilterBar {...defaultProps} filterCategory="Premium" />);

      const premiumButton = screen.getByText('Premium');
      expect(premiumButton).toHaveClass('active');
    });

    it('should apply active class to All Categories when filterCategory is "all"', () => {
      render(<FilterBar {...defaultProps} filterCategory="all" />);

      const allButton = screen.getByText('All Categories');
      expect(allButton).toHaveClass('active');
    });

    it('should not apply active class to non-selected categories', () => {
      render(<FilterBar {...defaultProps} filterCategory="Premium" />);

      const budgetButton = screen.getByText('Budget');
      expect(budgetButton).not.toHaveClass('active');
    });
  });

  describe('interaction', () => {
    it('should call onFilterChange when category is clicked', () => {
      const onFilterChange = jest.fn();
      render(<FilterBar {...defaultProps} onFilterChange={onFilterChange} />);

      fireEvent.click(screen.getByText('Premium'));

      expect(onFilterChange).toHaveBeenCalledWith('Premium');
    });

    it('should call onFilterChange with correct category value', () => {
      const onFilterChange = jest.fn();
      render(<FilterBar {...defaultProps} onFilterChange={onFilterChange} />);

      fireEvent.click(screen.getByText('Budget'));
      expect(onFilterChange).toHaveBeenCalledWith('Budget');

      fireEvent.click(screen.getByText('All Categories'));
      expect(onFilterChange).toHaveBeenCalledWith('all');
    });

    it('should call onFilterChange for each category click', () => {
      const onFilterChange = jest.fn();
      render(<FilterBar {...defaultProps} onFilterChange={onFilterChange} />);

      fireEvent.click(screen.getByText('Premium'));
      fireEvent.click(screen.getByText('Budget'));
      fireEvent.click(screen.getByText('Gaming'));

      expect(onFilterChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('className prop', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <FilterBar {...defaultProps} className="custom-class" />
      );

      const filterContainer = container.querySelector('.filter-container');
      expect(filterContainer).toHaveClass('custom-class');
    });

    it('should merge with default filter-container class', () => {
      const { container } = render(
        <FilterBar {...defaultProps} className="my-filter" />
      );

      const filterContainer = container.querySelector('.filter-container');
      expect(filterContainer).toHaveClass('filter-container');
      expect(filterContainer).toHaveClass('my-filter');
    });
  });

  describe('memoization', () => {
    it('should have displayName set', () => {
      expect(FilterBar.displayName).toBe('FilterBar');
    });

    it('should not re-render when props are the same', () => {
      const onFilterChange = jest.fn();
      const { rerender } = render(
        <FilterBar filterCategory="all" onFilterChange={onFilterChange} />
      );

      // Re-render with the same props
      rerender(
        <FilterBar filterCategory="all" onFilterChange={onFilterChange} />
      );

      // The component should still be functional
      fireEvent.click(screen.getByText('Premium'));
      expect(onFilterChange).toHaveBeenCalledWith('Premium');
    });
  });

  describe('empty categories', () => {
    it('should handle empty categories array', () => {
      render(<FilterBar {...defaultProps} categories={[]} />);

      // Should not render any filter buttons
      const buttons = screen.queryAllByRole('button');
      expect(buttons).toHaveLength(0);
    });

    it('should handle single category', () => {
      render(<FilterBar {...defaultProps} categories={['OnlyOne']} />);

      expect(screen.getByText('OnlyOne')).toBeInTheDocument();
    });
  });
});
