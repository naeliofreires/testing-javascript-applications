import create from 'zustand';

export const useCartStore = create((set) => ({
  state: {
    open: false,
    products: [],
  },
  actions: {
    add: (product) =>
      set((store) => {
        const included = store.state.products.find((i) => i.id === product.id);

        return {
          ...store,
          state: {
            ...store.state,
            open: true,
            products: included ? [...store.state.products] : [...store.state.products, product],
          },
        };
      }),

    toogle: () =>
      set((store) => {
        return { ...store, state: { ...store.state, open: !store.state.open } };
      }),

    reset: () =>
      set((store) => {
        return { ...store, state: { ...store.state, open: false, products: [] } };
      }),
  },
}));
