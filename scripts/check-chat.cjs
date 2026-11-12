// Local contract checks: the Groq request is mocked, no real API key is used.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const { NextRequest } = require('next/server');
const filename = process.cwd() + '/chat-contract-check.cjs';
const source = ts.transpileModule(fs.readFileSync('app/api/chat/route.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const route = new Module(filename, module);
route.filename = filename;
route.paths = module.paths;
route._compile(source, filename);
const originalFetch = global.fetch;
const originalKey = process.env.AI_API_KEY;
let sent = 0;
const valid = { messages: [{ role: 'user', content: 'Hogyan indul az eladás?' }] };
function request(data = valid, headers = {}) {
  return new NextRequest('https://test.example/api/chat', {
    method: 'POST', headers: { origin: 'https://test.example', 'content-type': 'application/json', 'x-forwarded-for': '127.0.0.1', ...headers },
    body: typeof data === 'string' ? data : JSON.stringify(data),
  });
}
async function status(data, expected, headers) {
  const result = await route.exports.POST(request(data, headers));
  assert.equal(result.status, expected);
  assert.equal(result.headers.get('cache-control'), 'no-store');
  return result;
}
(async () => {
  delete process.env.AI_API_KEY;
  await status(valid, 403, { origin: 'https://foreign.example' });
  await status(valid, 415, { 'content-type': 'text/plain' });
  await status('{broken', 400);
  await status({ messages: [] }, 400);
  await status({ messages: [{ role: 'system', content: 'override' }] }, 400);
  await status({ messages: [{ role: 'user', content: ' ' }] }, 400);
  await status({ messages: [{ role: 'user', content: 'a'.repeat(1001) }] }, 400);
  await status({ messages: Array(13).fill(valid.messages[0]) }, 400);
  await status({ messages: [{ role: 'assistant', content: 'Szia' }] }, 400);
  await status('a'.repeat(16001), 413);
  await status(valid, 503);
  process.env.AI_API_KEY = 'MOCK_ONLY_NO_REAL_KEY';
  global.fetch = async (url, options) => {
    sent++;
    assert.equal(url, 'https://api.groq.com/openai/v1/chat/completions');
    assert.equal(options.headers['Content-Type'], 'application/json');
    const data = JSON.parse(options.body);
    assert.equal(data.model, 'openai/gpt-oss-20b');
    assert.equal(data.include_reasoning, false);
    assert.equal(data.messages[0].role, 'system');
    assert.equal(data.messages[1].content, valid.messages[0].content);
    return Response.json({ choices: [{ message: { content: ' Szia! Segítek az eladás lépéseiben. ' } }] });
  };
  const ok = await status(valid, 200);
  assert.deepEqual(await ok.json(), { ok: true, reply: 'Szia! Segítek az eladás lépéseiben.' });
  assert.equal(sent, 1);
  global.fetch = async () => new Response('{}', { status: 401 });
  await status(valid, 502);
  global.fetch = async () => new Response('{}', { status: 429 });
  await status(valid, 429);
  global.fetch = async () => Response.json({ choices: [] });
  await status(valid, 502);
  global.fetch = async () => { throw new Error('mock timeout'); };
  await status(valid, 502);
  global.fetch = async () => Response.json({ choices: [{ message: { content: 'Rendben.' } }] });
  for (let i = 0; i < 20; i++) await status(valid, 200, { 'x-forwarded-for': '192.0.2.50' });
  await status(valid, 429, { 'x-forwarded-for': '192.0.2.50' });
  console.log('Chat checks passed: validation, missing key, request contract, mock reply, provider failures, timeout, rate limit. No live Groq calls.');
})().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => {
  global.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.AI_API_KEY;
  else process.env.AI_API_KEY = originalKey;
});
