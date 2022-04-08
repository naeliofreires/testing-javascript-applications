import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCartStore } from '../store/cart';
const { renderHook, act: hookAct } = require('@testing-library/react-hooks');
import TestRenderer from 'react-test-renderer';
import { makeServer } from '../miragejs/server';
const { act: componentAct } = TestRenderer;

import CartItem from './cart-item';

const product = {
  title: 'Rélogio do Nana',
  quantity: 1,
  price: '99.00',
  image:
    'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
};

describe('CartItem', () => {
  let server;
  let result;
  let decreaseSpy;
  let increaseSpy;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    result = renderHook(() => useCartStore()).result;
    decreaseSpy = jest.spyOn(result.current.actions, 'decrease');
    increaseSpy = jest.spyOn(result.current.actions, 'increase');
  });

  afterEach(async () => {
    jest.clearAllMocks();

    server.shutdown();
    hookAct(() => {
      result.current.actions.reset();
    });
  });

  it('should render CartItem', () => {
    render(<CartItem product={product} />);

    expect(screen.getByTestId('cart-item')).toBeInTheDocument();
  });

  it('should display proper content', () => {
    render(<CartItem product={product} />);

    const image = screen.getByTestId('image');

    expect(screen.getByText(new RegExp(product.title, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(product.price, 'i'))).toBeInTheDocument();
    expect(image).toHaveProperty('src', product.image);
    expect(image).toHaveProperty('alt', product.title);
  });

  it('should remove item from the cart when decrease() is called and quantity is equals 1', async () => {
    const _product = server.create('product');

    hookAct(() => result.current.actions.add(_product));

    render(<CartItem product={_product} />);
    const button = screen.getByTestId('decrease-button');

    await componentAct(async () => await userEvent.click(button));

    expect(decreaseSpy).toHaveBeenCalledTimes(1);
  });

  it('should increase of the quantity when user clicks in the increase button', async () => {
    const _product = server.create('product');

    hookAct(() => result.current.actions.add(_product));
    expect(result.current.state.products).toHaveLength(1);
    expect(result.current.state.products[0].quantity).toBe(1);

    render(<CartItem product={_product} />);
    const button = screen.getByTestId('increase-button');

    await componentAct(async () => await userEvent.click(button));

    expect(increaseSpy).toHaveBeenCalledTimes(1);
    expect(result.current.state.products[0].quantity).toBe(2);
  });
});
