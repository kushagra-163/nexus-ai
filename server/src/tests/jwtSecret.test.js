import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../config/jwt.js';
import { protect } from '../middleware/auth.middleware.js';

describe('JWT secret handling', () => {
  let original;
  beforeEach(() => {
    original = process.env.JWT_SECRET;
  });
  afterEach(() => {
    if (original === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = original;
  });

  test('getJwtSecret throws when JWT_SECRET is unset', () => {
    delete process.env.JWT_SECRET;
    assert.throws(() => getJwtSecret(), /JWT_SECRET is not set/);
  });

  test('getJwtSecret throws when JWT_SECRET is blank', () => {
    process.env.JWT_SECRET = '   ';
    assert.throws(() => getJwtSecret(), /JWT_SECRET is not set/);
  });

  test('getJwtSecret returns the configured value', () => {
    process.env.JWT_SECRET = 'abc123';
    assert.equal(getJwtSecret(), 'abc123');
  });

  test('protect rejects a token signed with the old hardcoded secret', async () => {
    delete process.env.JWT_SECRET;
    const forged = jwt.sign({ id: 'someone' }, 'nexus_ai_super_secret_jwt_key_2026');
    const req = { headers: { authorization: `Bearer ${forged}` } };
    let status;
    const res = {
      status(c) { status = c; return this; },
      json() { return this; },
    };
    let called = false;
    await protect(req, res, () => { called = true; });
    assert.equal(status, 401);
    assert.equal(called, false);
  });
});
