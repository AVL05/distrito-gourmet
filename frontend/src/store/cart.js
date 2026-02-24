import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem("cart")) || [],

  // Selectors
  totalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),
  totalPrice: () =>
    get().items.reduce((total, item) => total + item.price * item.quantity, 0),

  // Actions
  addItem: (product) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      let newItems;

      if (existingItem) {
        newItems = state.items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        newItems = [...state.items, { ...product, quantity: 1 }];
      }

      localStorage.setItem("cart", JSON.stringify(newItems));
      return { items: newItems };
    }),

  removeItem: (productId) =>
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(newItems));
      return { items: newItems };
    }),

  updateQuantity: (productId, delta) =>
    set((state) => {
      const newItems = state.items
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = Math.max(0, item.quantity + delta);
            // Return item with new quantity, don't filter here to avoid jumping UI if it goes to 0 immediately
            // Wait, standard behavior is remove if 0? Let's check logic.
            // The prompt said "updateQuantity" usually implies +1/-1.
            // If it goes to 0 it should probably be removed.
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      localStorage.setItem("cart", JSON.stringify(newItems));
      return { items: newItems };
    }),

  clearCart: () => {
    localStorage.removeItem("cart");
    set({ items: [] });
  },
}));
