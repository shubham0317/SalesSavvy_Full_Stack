import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductList from '../ProductList';

describe('ProductList component', () => {
  it('renders empty state message when no products are passed', () => {
    render(<ProductList products={[]} onAddToCart={vi.fn()} />);
    expect(screen.getByText('No Products Available')).toBeInTheDocument();
  });

  it('renders product items correctly and handles Add to Cart', () => {
    const products = [
      {
        product_id: 101,
        name: 'Classic White Shirt',
        description: 'Cotton slim fit shirt',
        price: 999,
        images: ['https://example.com/shirt.jpg'],
      },
    ];
    const handleAddToCart = vi.fn();

    render(<ProductList products={products} onAddToCart={handleAddToCart} />);

    expect(screen.getByText('Classic White Shirt')).toBeInTheDocument();
    expect(screen.getByText('Cotton slim fit shirt')).toBeInTheDocument();

    const button = screen.getByText('Add to Cart');
    fireEvent.click(button);
    expect(handleAddToCart).toHaveBeenCalledWith(101);
  });
});
