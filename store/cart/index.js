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

        let draft = product;
        if (!product.quantity) {
          draft.quantity = 1;
        }

        return {
          ...store,
          state: {
            ...store.state,
            open: true,
            products: included ? [...store.state.products] : [...store.state.products, draft],
          },
        };
      }),

    increase: (product) =>
      set((store) => {
        const checkMatch = (i) => i.id === product.id;
        const checkNoMatch = (i) => i.id !== product.id;

        const selectedProduct = store.state.products.find(checkMatch);
        const productsWithoutSelectedProduct = store.state.products.filter(checkNoMatch);

        selectedProduct.quantity = selectedProduct.quantity + 1;

        return {
          ...store,
          state: {
            ...store.state,
            open: true,
            products: [...productsWithoutSelectedProduct, selectedProduct],
          },
        };
      }),

    decrease: (product) =>
      set((store) => {
        const checkMatch = (i) => i.id === product.id;
        const checkNoMatch = (i) => i.id !== product.id;

        let products = [];

        const selectedProduct = store.state.products.find(checkMatch);
        const productsWithoudSelectedProduct = store.state.products.filter(checkNoMatch);

        if (selectedProduct.quantity === 1) {
          products = productsWithoudSelectedProduct;
        } else {
          product.quantity -= 1;
          products = [...productsWithoudSelectedProduct, selectedProduct];
        }

        return {
          ...store,
          state: {
            ...store.state,
            products,
            open: true,
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

    remove: (product) =>
      set((store) => {
        const _filteredStore = store.state.products.filter((i) => i.id !== product.id);

        return {
          ...store,
          state: {
            ...store.state,
            products: _filteredStore,
          },
        };
      }),

    clear: () =>
      set((store) => {
        return {
          ...store,
          state: {
            ...store.state,
            products: [],
          },
        };
      }),
  },
}));
