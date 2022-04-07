import create from 'zustand';

const initialState = {
  open: false,
  products: [],
};

export const useCartStore = create((set) => ({
  state: { ...initialState },
  actions: {
    reset: () =>
      set(() => {
        return { state: { ...initialState } };
      }),
    add: (product) =>
      set((store) => ({
        state: {
          ...store.state,
          open: true,
          products: [...store.state.products, product],
        },
      })),
    toogle: () =>
      set((store) => {
        return { state: { open: !store.state.open } };
      }),
  },
}));
