import { create } from 'zustand';

// Store del carrito de compras usando Zustand
export const useCartStore = create((set, get) => ({
  // Cargar items guardados en localStorage o empezar vacío
  items: JSON.parse(localStorage.getItem('cart')) || [],

  // Calcular total de artículos en el carrito
  totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),

  // Calcular precio total del carrito
  totalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),

  // Añadir un producto al carrito (si ya existe, sumar cantidad)
  addItem: product =>
    set(state => {
      const existingItem = state.items.find(item => item.id === product.id);
      let newItems;

      if (existingItem) {
        // Si el producto ya está, incrementar cantidad
        newItems = state.items.map(item => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        // Si es nuevo, añadirlo con cantidad 1
        newItems = [...state.items, { ...product, quantity: 1 }];
      }

      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    }),

  // Eliminar un producto del carrito
  removeItem: productId =>
    set(state => {
      const newItems = state.items.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    }),

  // Actualizar cantidad de un producto (+1 o -1). Si llega a 0, se elimina
  updateQuantity: (productId, delta) =>
    set(state => {
      const newItems = state.items
        .map(item => {
          if (item.id === productId) {
            const newQuantity = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(item => item.quantity > 0);

      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    }),

  // Vaciar todo el carrito
  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [] });
  },
}));
