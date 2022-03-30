import { screen, render, waitFor } from '@testing-library/react';
import ProductList from '../pages';

describe('ProductList', () => {
  it('should render ProductList', () => {
    render(<ProductList />);

    expect(screen.getByTestId('product-list')).toBeInTheDocument();
  });

  it('should render the ProductCard component 10 times', async () => {
    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(10);
    });
  });
});
