import create from 'zustand';

const initialState = {
  open: false,
  products: [],
};

export const useCartStore = create((set) => ({
  state: { ...initialState },
  actions: {
    reset: () =>
      set((store) => {
        return { ...store, state: { ...initialState } };
      }),

    add: (product) =>
      set((store) => {
        const included = !!store.state.products.find((item) => item.id === product.id);

        if (included) {
          return store;
        }

        return {
          state: {
            ...store.state,
            open: true,
            products: [...store.state.products, product],
          },
        };
      }),

    toogle: () =>
      set((store) => {
        return {
          ...store,
          state: { ...store.state, open: !store.state.open },
        };
      }),
  },
}));
