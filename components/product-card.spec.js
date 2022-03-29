import { screen, render, fireEvent } from '@testing-library/react';
import ProductCard from './product-card';

const product = {
  title: 'Rélogio do Nana',
  price: '99.00',
  image:
    'https://images.unsplash.com/photo-1495856458515-0637185db551?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
};

const addToCard = jest.fn();

describe('ProductCard', () => {
  it('should render ProductCard', () => {
    render(<ProductCard product={product} addToCard={addToCard} />);

    expect(screen.getByTestId('product-card')).toBeInTheDocument();
  });

  it('should display proper content', () => {
    render(<ProductCard product={product} addToCard={addToCard} />);

    expect(screen.getByText(new RegExp(product.title, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(product.price, 'i'))).toBeInTheDocument();

    expect(screen.getByTestId('image')).toHaveStyle({
      backgroundImage: product.image,
    });
  });

  it('should call props.addToCard when button gets clicked', async () => {
    render(<ProductCard product={product} addToCard={addToCard} />);

    const button = screen.getByRole('button');

    await fireEvent.click(button);

    expect(addToCard).toHaveBeenCalledTimes(1);
    expect(addToCard).toHaveBeenCalledWith(product);
  });
});
