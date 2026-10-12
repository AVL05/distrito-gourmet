const validItem = (item) => item && ['string', 'number'].includes(typeof item.id)
  && String(item.id).length > 0 && typeof item.name === 'string'
  && Number.isFinite(item.price) && item.price >= 0
  && Number.isInteger(item.quantity) && item.quantity > 0
  && ['plato', 'vino', 'bebida', 'menu_degustacion'].includes(item.item_type || 'plato');

export const loadCart = (storage) => {
  try {
    const data = JSON.parse((storage ?? globalThis.localStorage).getItem('cart'));
    return Array.isArray(data) ? data.filter(validItem) : [];
  } catch {
    return [];
  }
};

export const saveCart = (items, storage) => {
  try {
    (storage ?? globalThis.localStorage).setItem('cart', JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
};
