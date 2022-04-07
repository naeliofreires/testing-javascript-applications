import { useCartStore } from './index';
const { renderHook, act: HooksAction } = require('@testing-library/react-hooks');
import { makeServer } from '../../miragejs/server';

describe('Cart Store', () => {
  let server;
  let result;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    result = renderHook(() => useCartStore()).result;
  });

  afterEach(() => {
    server.shutdown();

    HooksAction(() => {
      result.current.actions.reset();
    });
  });

  /**
   * @state.open
   */
  it('should return open equals false on initial state', async () => {
    const { result } = renderHook(() => useCartStore());

    expect(result.current.state.open).toBe(false);
  });

  it('should toggle open state', async () => {
    const { result } = renderHook(() => useCartStore());
    const {
      actions: { toogle },
    } = result.current;

    expect(result.current.state.open).toBe(false);

    HooksAction(() => toogle());
    expect(result.current.state.open).toBe(true);

    HooksAction(() => result.current.actions.toogle());
    expect(result.current.state.open).toBe(false);
  });

  /**
   * state.products
   */

  it('should return an empty array for products on initial state', async () => {
    const { result } = renderHook(() => useCartStore());

    expect(Array.isArray(result.current.state.products)).toBe(true);
    expect(result.current.state.products).toHaveLength(0);
  });

  it('should add (2) products to the products list', async () => {
    const products = server.createList('product', 2);
    const { result } = renderHook(() => useCartStore());

    for (const product of products) {
      HooksAction(() => {
        result.current.actions.add(product);
      });
    }

    expect(result.current.state.open).toBe(true);
    expect(result.current.state.products).toHaveLength(2);
  });

  it('should not add the same product twice', async () => {
    const productA = server.create('product');
    const productB = server.create('product');

    const { result } = renderHook(() => useCartStore());

    HooksAction(() => result.current.actions.add(productA));
    HooksAction(() => result.current.actions.add(productA));
    HooksAction(() => result.current.actions.add(productB));

    expect(result.current.state.products).toHaveLength(2);
  });
});
