const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');

process.env.NODE_ENV = 'test';
process.env.OPENAI_API_KEY = '';
process.env.GEMINI_API_KEY = '';
const app = require('../server');

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
});

test('reports API health without exposing credentials', async () => {
  const response = await fetch(`${baseUrl}/healthz`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.status, 'ok');
  assert.equal(typeof body.providers.openai, 'boolean');
  assert.equal(typeof body.providers.gemini, 'boolean');
  assert.deepEqual(Object.keys(body).sort(), ['providers', 'status']);
});

test('rejects an empty translation request before calling a provider', async () => {
  const response = await fetch(`${baseUrl}/api/translate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: '' }),
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.error, 'Text is required');
  assert.equal(typeof body.requestId, 'string');
});
