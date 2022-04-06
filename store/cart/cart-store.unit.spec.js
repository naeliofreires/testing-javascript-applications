const { renderHook, act } = require('@testing-library/react-hooks');
import { useCartStore } from './index';
import { makeServer } from '../../miragejs/server';

describe('Cart Store', () => {
  let store;
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
    store = renderHook(() => useCartStore()).result;
  });

  afterEach(() => {
    server.shutdown();

    act(() => {
      store.current.actions.reset();
    });
  });

  it('should return open equals false on initial state', async () => {
    expect(store.current.state.open).toBe(false);
  });

  it('should return an empty array for products on initial state', () => {
    expect(Array.isArray(store.current.state.products)).toBe(true);
    expect(store.current.state.products).toHaveLength(0);
  });

  it('should not add same product twice', async () => {
    const productA = server.create('product');
    const productB = server.create('product');

    act(() => store.current.actions.add(productA));
    act(() => store.current.actions.add(productB));
    act(() => store.current.actions.add(productB));

    expect(store.current.state.products).toHaveLength(2);
  });

  it('should add 2 products to the list', async () => {
    const products = server.createList('product', 2);

    const { actions } = store.current;

    for (const product of products) {
      act(() => actions.add(product));
    }

    expect(store.current.state.products).toHaveLength(2);
  });

  it('should toggle open state', async () => {
    const {
      actions: { toogle },
    } = store.current;

    expect(store.current.state.open).toBe(false);
    expect(store.current.state.products).toHaveLength(0);

    act(() => toogle());
    expect(store.current.state.open).toBe(true);

    act(() => store.current.actions.toogle());
    expect(store.current.state.open).toBe(false);
    expect(store.current.state.products).toHaveLength(0);
  });
});
