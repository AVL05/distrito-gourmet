import test from 'node:test';
import assert from 'node:assert/strict';
import { getApiErrorMessage, getApiFieldErrors } from './apiErrors.js';

test('server failures never expose internal details while validation remains useful', () => {
  assert.equal(getApiErrorMessage({ response: { status: 500, data: { message: 'SQLSTATE private database details' } } }), 'No pudimos completar la operación. Inténtelo más tarde.');
  const validation = { response: { status: 422, data: { errors: { email: ['Este correo ya está registrado.'] } } } };
  assert.equal(getApiErrorMessage(validation), 'Este correo ya está registrado.');
  assert.deepEqual(getApiFieldErrors(validation), { email: 'Este correo ya está registrado.' });
});
