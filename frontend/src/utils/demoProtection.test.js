import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isDemoWrite } from './demoProtection.js';

test('public demo rejects all write verbs while allowing reads', () => {
  for (const method of ['post', 'put', 'patch', 'delete', 'POST']) assert.equal(isDemoWrite(method, true), true);
  for (const method of ['get', 'head', 'options', undefined]) assert.equal(isDemoWrite(method, true), false);
  assert.equal(isDemoWrite('post', false), false);
});
