import { screen, render } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useCartStore } from '../store/cart';
import { makeServer } from '../miragejs/server';
import Cart from './cart';
import useEvent from '@testing-library/user-event';

describe('Cart', () => {
  let server;
  let result;
  let spy;
  let add;
  let reset;
  let toggle;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    result = renderHook(() => useCartStore()).result;

    add = result.current.actions.add;
    reset = result.current.actions.reset;
    toggle = result.current.actions.toogle;
    spy = jest.spyOn(result.current.actions, 'toogle');
  });

  afterEach(() => {
    server.shutdown();
    jest.clearAllMocks();
  });

  it('should add css class "hidden" in the component', () => {
    render(<Cart />);

    expect(screen.getByTestId('cart')).toHaveClass('hidden');
  });

  it('should call store toggle() twice', () => {
    render(<Cart />);

    const button = screen.getByTestId('close-button');

    act(() => {
      useEvent.click(button);
      useEvent.click(button);
    });

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should display 2 products cards', () => {
    render(<Cart />);

    const products = server.createList('product', 2);

    act(() => {
      for (const product of products) {
        add(product);
      }
    });

    expect(screen.getAllByTestId('cart-item')).toHaveLength(2);
  });
});
