import { render, screen } from '@testing-library/react';
const { renderHook, act } = require('@testing-library/react-hooks');
import userEvent from '@testing-library/user-event';

import Cart from './cart';
import { useCartStore } from '../store/cart';
import { makeServer } from '../miragejs/server';

describe('Cart Store', () => {
  let toogleSpy;
  let clearSpy;
  let server;
  let result;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    result = renderHook(() => useCartStore()).result;

    clearSpy = jest.spyOn(result.current.actions, 'clear');
    toogleSpy = jest.spyOn(result.current.actions, 'toogle');
  });

  afterEach(async () => {
    server.shutdown();
    jest.clearAllMocks();

    act(() => {
      result.current.actions.reset();
    });
  });

  it('should  add css class "hidden" in the component', async () => {
    render(<Cart />);

    expect(screen.getByTestId('cart')).toHaveClass('hidden');
  });

  it('should not add css class "hidden" in the component', async () => {
    act(() => {
      result.current.actions.toogle();
    });

    render(<Cart />);

    expect(screen.getByTestId('cart')).not.toHaveClass('hidden');
  });

  it('should call store toggle() twice ', async () => {
    render(<Cart />);

    const button = screen.getByTestId('close-button');

    await userEvent.click(button);
    await userEvent.click(button);

    expect(toogleSpy).toHaveBeenCalledTimes(2);
  });

  it('should call store toggle() twice ', async () => {
    render(<Cart />);

    const products = server.createList('product', 2);

    act(() => {
      for (const product of products) {
        result.current.actions.add(product);
      }
    });

    expect(screen.getAllByTestId('cart-item')).toHaveLength(2);
  });

  it('should show empty message if have not selected any product', async () => {
    render(<Cart />);

    expect(screen.getByTestId('empty-cart-message')).toBeInTheDocument();
  });

  it('should show checkout button if have at least 1 product', async () => {
    render(<Cart />);

    const product = server.create('product');

    act(() => {
      result.current.actions.add(product);
    });

    expect(screen.getByTestId('checkout-button')).toBeInTheDocument();
  });

  it('should clear the all products after the click on the clear button', async () => {
    render(<Cart />);

    const products = server.createList('product', 10);

    act(() => {
      for (const product of products) {
        result.current.actions.add(product);
      }
    });

    expect(result.current.state.products).toHaveLength(10);

    const clearButton = screen.getByTestId('clear-button');

    await userEvent.click(clearButton);

    expect(result.current.state.products).toHaveLength(0);
    expect(clearSpy).toHaveBeenCalledTimes(1);
  });
});
