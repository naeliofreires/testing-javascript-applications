import { screen, render, fireEvent } from '@testing-library/react';
import { useCartStore } from '../store/cart';
const { renderHook, act } = require('@testing-library/react-hooks');

import CartItem from './cart-item';

const product = {
  title: 'Rélogio do Nana',
  price: '99.00',
  image:
    'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
};

describe('CartItem', () => {
  let spy;
  let result;

  beforeEach(() => {
    result = renderHook(() => useCartStore()).result;
    spy = jest.spyOn(result.current.actions, 'remove');
  });

  afterEach(async () => {
    jest.clearAllMocks();

    act(() => {
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

  it('should display 1 as initial quantity', () => {
    render(<CartItem product={product} />);

    expect(screen.getByTestId('quantity').textContent).toBe('1');
  });

  it('should increase quantity by 1 when second button is clicked', async () => {
    render(<CartItem product={product} />);

    const [, button] = screen.getAllByRole('button');

    await fireEvent.click(button);

    expect(screen.getByTestId('quantity').textContent).toBe('2');
  });

  it('should decrease quantity by 1 when first button is clicked', async () => {
    render(<CartItem product={product} />);

    const [decreaseButton, increaseButton] = screen.getAllByRole('button');

    await fireEvent.click(increaseButton);

    expect(screen.getByTestId('quantity').textContent).toBe('2');

    await fireEvent.click(decreaseButton);

    expect(screen.getByTestId('quantity').textContent).toBe('1');
  });

  it('should remove the product if the quantity is equals 1', async () => {
    render(<CartItem product={product} />);

    const [decreaseButton] = screen.getAllByRole('button');

    expect(screen.getByTestId('quantity').textContent).toBe('1');

    await fireEvent.click(decreaseButton);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
