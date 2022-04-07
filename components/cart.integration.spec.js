import { render, screen } from '@testing-library/react';
const { renderHook, act } = require('@testing-library/react-hooks');
import userEvent from '@testing-library/user-event';

import Cart from './cart';
import { useCartStore } from '../store/cart';
import { makeServer } from '../miragejs/server';

describe('Cart Store', () => {
  let spy;
  let server;
  let result;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    result = renderHook(() => useCartStore()).result;
    spy = jest.spyOn(result.current.actions, 'toogle');
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

    expect(spy).toHaveBeenCalledTimes(2);
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
});
