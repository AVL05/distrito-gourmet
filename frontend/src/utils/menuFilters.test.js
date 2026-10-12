import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterDishes, getAllergens } from './menuFilters.js';

const dishes = [
  { name: 'Croqueta Ibérica', description: 'Jamón', allergens: 'Gluten, Lácteos, Huevo', availableTakeaway: true },
  { name: 'Pulpo', description: 'Patata y pimentón', allergens: 'Moluscos, Lácteos', availableTakeaway: false },
  { name: 'Otro', allergens: null, availableTakeaway: true },
];
test('search ignores accents and excludes named allergens', () => {
  assert.equal(filterDishes(dishes, 'iberica', '', false).length, 1);
  assert.equal(filterDishes(dishes, 'patata', 'gluten', false).length, 1);
  assert.equal(filterDishes(dishes, '', 'lacteos', false).length, 0);
  assert.equal(filterDishes(dishes, '', '', true).length, 2);
  assert.deepEqual(getAllergens(dishes), ['gluten', 'huevo', 'lácteos', 'moluscos']);
});

test('milk and dairy use the same allergen filter', () => {
  const dishes = [{ name: 'Croqueta', allergens: 'Leche, gluten' }];
  assert.equal(filterDishes(dishes, '', 'lácteos', false).length, 0);
  assert.deepEqual(getAllergens(dishes), ['gluten', 'lácteos']);
});
