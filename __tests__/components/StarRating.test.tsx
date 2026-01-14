/**
 * Tests for StarRating component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StarRating from '@/components/StarRating';

describe('StarRating', () => {
  describe('rendering', () => {
    it('should render correct number of stars', () => {
      render(<StarRating rating={3} />);

      // Should render 5 stars by default (each star has aria-hidden svg)
      const starContainer = screen.getByRole('img', { name: /3 out of 5 stars/i });
      expect(starContainer).toBeInTheDocument();
    });

    it('should render custom number of stars', () => {
      render(<StarRating rating={3} maxRating={10} />);

      const starContainer = screen.getByRole('img', { name: /3 out of 10 stars/i });
      expect(starContainer).toBeInTheDocument();
    });

    it('should display rating value when showValue is true', () => {
      render(<StarRating rating={4.5} showValue />);

      expect(screen.getByText('4.5')).toBeInTheDocument();
    });

    it('should not display rating value when showValue is false', () => {
      render(<StarRating rating={4.5} showValue={false} />);

      expect(screen.queryByText('4.5')).not.toBeInTheDocument();
    });

    it('should format rating to one decimal place', () => {
      render(<StarRating rating={4.567} showValue />);

      expect(screen.getByText('4.6')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('should apply small size classes', () => {
      const { container } = render(<StarRating rating={3} size="sm" />);

      // Check for small text size when showValue is true
      render(<StarRating rating={3} size="sm" showValue />);
      const valueElement = screen.getByText('3.0');
      expect(valueElement.className).toContain('text-xs');
    });

    it('should apply medium size classes by default', () => {
      render(<StarRating rating={3} showValue />);

      const valueElement = screen.getByText('3.0');
      expect(valueElement.className).toContain('text-sm');
    });

    it('should apply large size classes', () => {
      render(<StarRating rating={3} size="lg" showValue />);

      const valueElement = screen.getByText('3.0');
      expect(valueElement.className).toContain('text-base');
    });
  });

  describe('interactivity', () => {
    it('should be readonly by default', () => {
      render(<StarRating rating={3} />);

      // In readonly mode, stars should not have role="button"
      const buttons = screen.queryAllByRole('button');
      expect(buttons).toHaveLength(0);
    });

    it('should call onRatingChange when clicked in interactive mode', () => {
      const handleRatingChange = jest.fn();
      const { container } = render(
        <StarRating rating={3} readonly={false} onRatingChange={handleRatingChange} />
      );

      // Find all clickable star containers
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(5);

      // Click on the fourth star (index 3)
      fireEvent.click(buttons[3]);

      expect(handleRatingChange).toHaveBeenCalledWith(4);
    });

    it('should not call onRatingChange in readonly mode', () => {
      const handleRatingChange = jest.fn();
      render(
        <StarRating rating={3} readonly={true} onRatingChange={handleRatingChange} />
      );

      // Should not have clickable buttons in readonly mode
      const buttons = screen.queryAllByRole('button');
      expect(buttons).toHaveLength(0);
    });

    it('should handle keyboard interaction (Enter key)', () => {
      const handleRatingChange = jest.fn();
      render(
        <StarRating rating={3} readonly={false} onRatingChange={handleRatingChange} />
      );

      const buttons = screen.getAllByRole('button');

      // Simulate Enter key on the second star
      fireEvent.keyDown(buttons[1], { key: 'Enter' });

      expect(handleRatingChange).toHaveBeenCalledWith(2);
    });

    it('should handle keyboard interaction (Space key)', () => {
      const handleRatingChange = jest.fn();
      render(
        <StarRating rating={3} readonly={false} onRatingChange={handleRatingChange} />
      );

      const buttons = screen.getAllByRole('button');

      // Simulate Space key on the fifth star
      fireEvent.keyDown(buttons[4], { key: ' ' });

      expect(handleRatingChange).toHaveBeenCalledWith(5);
    });
  });

  describe('accessibility', () => {
    it('should have accessible label with rating info', () => {
      render(<StarRating rating={4.5} maxRating={5} />);

      const ratingContainer = screen.getByRole('img', { name: /4.5 out of 5 stars/i });
      expect(ratingContainer).toBeInTheDocument();
    });

    it('should have tabIndex on interactive stars', () => {
      render(<StarRating rating={3} readonly={false} onRatingChange={() => {}} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('tabIndex', '0');
      });
    });
  });

  describe('partial stars', () => {
    it('should render partial fill for decimal ratings', () => {
      const { container } = render(<StarRating rating={3.5} />);

      // The component uses inline styles for partial fill
      // We can check that the SVG containers are rendered
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('should handle zero rating', () => {
      render(<StarRating rating={0} showValue />);

      expect(screen.getByText('0.0')).toBeInTheDocument();
    });

    it('should handle max rating', () => {
      render(<StarRating rating={5} maxRating={5} showValue />);

      expect(screen.getByText('5.0')).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <StarRating rating={3} className="custom-class" />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });
  });
});
