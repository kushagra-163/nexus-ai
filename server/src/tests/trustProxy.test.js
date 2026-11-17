import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { getTrustProxySetting } from '../config/proxy.js';
import { createRateLimiter } from '../middleware/rateLimit.middleware.js';

describe('trust proxy configuration', () => {
  test('defaults to off', () => {
    assert.equal(getTrustProxySetting(undefined), false);
    assert.equal(getTrustProxySetting(''), false);
    assert.equal(getTrustProxySetting('0'), false);
  });

  test('parses a hop count', () => {
    assert.equal(getTrustProxySetting('1'), 1);
    assert.equal(getTrustProxySetting('2'), 2);
  });

  test('rejects invalid values', () => {
    assert.throws(() => getTrustProxySetting('yes'));
    assert.throws(() => getTrustProxySetting('-1'));
  });

  const hit = async (trustProxy, forwardedFor) => {
    const app = express();
    app.set('trust proxy', getTrustProxySetting(trustProxy));
    const limiter = createRateLimiter({ windowMs: 60000, max: 1, message: 'limited' });
    app.use(limiter);
    app.get('/', (req, res) => res.json({ ok: true }));
    const server = app.listen(0);
    try {
      const { port } = server.address();
      const out = [];
      for (const ip of forwardedFor) {
        const r = await fetch(`http://127.0.0.1:${port}/`, { headers: { 'X-Forwarded-For': ip } });
        out.push(r.status);
      }
      return out;
    } finally {
      limiter.cleanup?.();
      server.close();
    }
  };

  test('with trust proxy on, different forwarded clients get separate buckets', async () => {
    assert.deepEqual(await hit('1', ['10.0.0.1', '10.0.0.2']), [200, 200]);
  });

  test('with trust proxy off, forwarded addresses are ignored', async () => {
    assert.deepEqual(await hit(undefined, ['10.0.0.1', '10.0.0.2']), [200, 429]);
  });
});
