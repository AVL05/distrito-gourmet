import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getReturnTo } from './authReturn.js';

test('returns to the original flow without accepting external destinations', () => {
  assert.equal(getReturnTo('/reservations?tab=history'), '/reservations?tab=history');
  assert.equal(getReturnTo('/cart'), '/cart');
  for (const destination of ['//evil.test', 'https://evil.test', '/login', '/\\evil.test', null]) assert.equal(getReturnTo(destination), '/dashboard');
});
