import test from 'node:test';
import assert from 'node:assert/strict';
import { IS_PUBLIC_DEMO, USE_STATIC_DEMO_DATA } from '../config/demo.js';

test('the full application never enables demo sessions or static data', () => {
  assert.equal(IS_PUBLIC_DEMO, false);
  assert.equal(USE_STATIC_DEMO_DATA, false);
});
