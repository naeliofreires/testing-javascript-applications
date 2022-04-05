import { screen, render } from '@testing-library/react';
import Cart from './cart';

describe('CartItem', () => {
  it('should render CartItem', () => {
    render(<Cart />);

    expect(screen.getByTestId('cart')).toBeInTheDocument();
  });
});
