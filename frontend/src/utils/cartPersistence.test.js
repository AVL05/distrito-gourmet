import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCart, saveCart } from './cartPersistence.js';

test('rejects corrupt data and invalid quantities without losing valid items', () => {
  const valid = { id: 1, name: 'Croqueta', price: 3, quantity: 2, item_type: 'plato' };
  const storage = (value) => ({ getItem: () => value });
  for (const data of ['{', '{}', 'null', '"text"']) assert.deepEqual(loadCart(storage(data)), []);
  assert.deepEqual(loadCart(storage(JSON.stringify([valid, { ...valid, quantity: -1 }, { ...valid, price: 'wrong' }, null]))), [valid]);
});

test('blocked storage keeps the cart usable in memory', () => {
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  assert.deepEqual(loadCart(blocked), []);
  assert.equal(saveCart([], blocked), false);
});

test('cart actions still update memory when storage is unavailable', async () => {
  const { useCartStore } = await import('../store/cart.js');
  useCartStore.getState().clearCart();
  useCartStore.getState().addItem({ id: 1, name: 'Croqueta', price: 3, item_type: 'plato' });
  useCartStore.getState().updateQuantity(1, 1);
  assert.equal(useCartStore.getState().totalItems(), 2);
  assert.equal(useCartStore.getState().totalPrice(), 6);
  assert.equal(useCartStore.getState().storageAvailable, false);
  useCartStore.getState().removeItem(1);
  assert.equal(useCartStore.getState().totalItems(), 0);
});
