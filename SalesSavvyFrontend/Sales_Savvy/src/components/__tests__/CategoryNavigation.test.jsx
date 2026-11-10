import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CategoryNavigation from '../CategoryNavigation';

describe('CategoryNavigation component', () => {
  it('renders all product categories correctly', () => {
    const handleCategoryClick = vi.fn();
    render(<CategoryNavigation onCategoryClick={handleCategoryClick} activeCategory="Shirts" />);

    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Shirts')).toBeInTheDocument();
    expect(screen.getByText('Pants')).toBeInTheDocument();
    expect(screen.getByText('Accessories')).toBeInTheDocument();
  });

  it('triggers onCategoryClick when a category is clicked', () => {
    const handleCategoryClick = vi.fn();
    render(<CategoryNavigation onCategoryClick={handleCategoryClick} activeCategory="Shirts" />);

    fireEvent.click(screen.getByText('Pants'));
    expect(handleCategoryClick).toHaveBeenCalledWith('Pants');
  });
});
