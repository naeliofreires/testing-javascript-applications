import { screen, render, waitFor, fireEvent, getByRole } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
      expect(screen.getAllByTestId('product-card')).toHaveLength(10);
    });
  });

  it('should render the "no products message"', async () => {
    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByTestId('no-products')).toBeInTheDocument();
    });
  });

  it('should display error message when promise rejects', async () => {
    server.get('products', () => {
      throw new Error();
    });

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.queryByTestId('no-products')).toBeNull();
      expect(screen.queryByTestId('error-message')).toBeInTheDocument();

      expect(screen.queryAllByTestId('product-card')).toHaveLength(0);
    });
  });

  it('should filter the product list when a search is performed', async () => {
    const searchValue = 'relogio x';
    server.createList('product', 2);

    server.create('product', { title: searchValue });

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(3);
    });

    const form = screen.getByRole('form');
    const input = screen.getByRole('searchbox');

    await userEvent.type(input, searchValue);
    await fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(1);
    });
  });
});
