// Contract tests only. Every outbound request is mocked; no live submission or e-mail is sent.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const { NextRequest } = require('next/server');
const filename = process.cwd() + '/lead-contract-check.cjs';
const source = ts.transpileModule(fs.readFileSync('app/api/lead/route.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const route = new Module(filename, module);
route.filename = filename;
route.paths = module.paths;
route._compile(source, filename);
const originalFetch = global.fetch;
const originalError = console.error;
console.error = () => {}; // expected rejection logs contain no personal data
const valid = { email: 'teszt@example.com', consent: 'yes', contact: 'no', source: 'pdf-lead-magnet', website: '' };
let calls = 0;
function request(data = valid, headers = {}) {
  return new NextRequest('https://test.example/api/lead', {
    method: 'POST', headers: { origin: 'https://test.example', 'content-type': 'application/json', ...headers },
    body: typeof data === 'string' ? data : JSON.stringify(data),
  });
}
async function check(data, status, headers) {
  const result = await route.exports.POST(request(data, headers));
  assert.equal(result.status, status);
  assert.equal(result.headers.get('cache-control'), 'no-store');
  return result;
}
(async () => {
  global.fetch = async () => { calls++; throw Error('invalid input must not reach provider'); };
  await check(valid, 403, { origin: 'https://foreign.example' });
  await check(valid, 415, { 'content-type': 'text/plain' });
  await check('{broken', 400);
  await check('null', 400);
  await check([], 400);
  await check('x'.repeat(4097), 413);
  for (const email of ['', 'nem-email', 'a@b', 'a b@example.com', 'a\r\nb@example.com', 'a'.repeat(250)+'@x.hu']) await check({ ...valid, email }, 400);
  await check({ ...valid, source: 'other' }, 400);
  await check({ ...valid, contact: 'maybe' }, 400);
  await check({ ...valid, consent: 'no' }, 400);
  await check({ ...valid, website: 'spam' }, 400);
  assert.equal(calls, 0);
  // A valid submission succeeds without Resend or contact-profile environment variables.
  for (const key of ['RESEND_API_KEY', 'LEAD_FROM_EMAIL', 'LEAD_TO_EMAIL', 'NEXT_PUBLIC_CONTACT_NAME', 'NEXT_PUBLIC_CONTACT_EMAIL', 'NEXT_PUBLIC_CONTROLLER_ADDRESS']) delete process.env[key];
  global.fetch = async (url, options) => {
    calls++;
    assert.equal(url, 'https://formspree.io/f/myewzjjg');
    assert.equal(options.method, 'POST');
    assert.equal(options.headers.Accept, 'application/json');
    assert.equal(options.headers.Referer, 'https://test.example/');
    assert.equal(options.headers.Authorization, undefined);
    const payload = JSON.parse(options.body);
    assert.equal(payload.email, valid.email);
    assert.equal(payload.source, 'pdf-lead-magnet');
    assert.equal(payload.contact_consent, 'Nem kérek megkeresést.');
    assert.equal(payload.consent_version, 'pdf-guide-v1');
    assert(!Number.isNaN(Date.parse(payload.requested_at)));
    assert.equal(payload._subject, 'PDF útmutató igénylés – Otthonod Piaca');
    return Response.json({ ok: true, next: '/thanks' });
  };
  const success = await check(valid, 200);
  assert.deepEqual(await success.json(), { ok: true });
  assert.equal(calls, 1);
  global.fetch = async (url, options) => {
    assert.equal(JSON.parse(options.body).contact_consent, 'Igen, kérek egyszeri e-mailes megkeresést.');
    return Response.json({ ok: true });
  };
  await check({ ...valid, contact: 'yes' }, 200);
  global.fetch = async () => Response.json({});
  await check(valid, 502);
  global.fetch = async () => new Response('{}', { status: 429 });
  await check(valid, 429);
  global.fetch = async () => new Response('{}', { status: 422 });
  await check(valid, 502);
  global.fetch = async () => Response.json({ ok: false, errors: [{ message: 'rejected' }] });
  await check(valid, 502);
  global.fetch = async () => new Response('<html>Challenge</html>', { headers: { 'Content-Type': 'text/html' } });
  await check(valid, 502);
  global.fetch = async () => { throw new Error('mock timeout'); };
  await check(valid, 502);
  console.log('PDF lead checks passed: email validation, separate consent, payload, fixed destination, failures and timeout. No live submission.');
})().catch(error => { originalError(error); process.exitCode = 1; }).finally(() => { global.fetch = originalFetch; console.error = originalError; });
