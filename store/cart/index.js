import create from 'zustand';

export const useCartStore = create((set) => ({
  state: {
    open: false,
  },
  actions: {
    toogle: () =>
      set((store) => {
        return { state: { open: !store.state.open } };
      }),
  },
}));
