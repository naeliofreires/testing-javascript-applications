import { screen, render, waitFor } from '@testing-library/react';
import ProductList from '../pages';
import { makeServer } from '../miragejs/server';

describe('ProductList', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should render ProductList', () => {
    render(<ProductList />);

    expect(screen.getByTestId('product-list')).toBeInTheDocument();
  });

  it('should render the ProductCard component 10 times', async () => {
    server.createList('product', 10);

    render(<ProductList />);

    await waitFor(() => {
      // screen.debug(screen.getAllByTestId('product-card'));
      expect(screen.getAllByTestId('product-card')).toHaveLength(10);
    });
  });
});
