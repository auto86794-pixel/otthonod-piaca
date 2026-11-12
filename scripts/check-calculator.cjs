const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const filename = process.cwd() + '/valuation-check.cjs';
const source = ts.transpileModule(fs.readFileSync('app/lib/valuation.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const model = new Module(filename, module);
model.filename = filename; model.paths = module.paths; model._compile(source, filename);
const { calculateValue, DISTRICTS, CONDITIONS } = model.exports;
const base = { district: 'belvaros', area: '62', rooms: '2', condition: 'jo' };
const result = calculateValue(base);
assert.equal(result.total, 46_500_000);
assert.equal(result.min, 42_800_000);
assert.equal(result.max, 50_200_000);
assert.equal(result.pricePerSqm, 750_000); // guards against the draft's 1000-fold unit error
assert.equal(calculateValue({ ...base, rooms: '' }).total, result.total);
assert.equal(calculateValue({ ...base, rooms: '1' }).total, result.total * 1.04);
assert.equal(calculateValue({ ...base, rooms: '4' }).total, result.total * 0.97);
assert.equal(calculateValue({ ...base, condition: 'felujitando' }).total, result.total * 0.78);
assert.equal(calculateValue({ ...base, condition: 'uj' }).total, result.total * 1.25);
assert.equal(calculateValue({ ...base, area: '62,5' }).area, 62.5);
assert(calculateValue({ ...base, rooms: '2.5' }));
for (const patch of [{ district: '' }, { district: '__proto__' }, { condition: '' }, { condition: '__proto__' }, { area: '' }, { area: 'NaN' }, { area: 'Infinity' }, { area: '-1' }, { area: '14.9' }, { area: '500.1' }, { rooms: '0' }, { rooms: '10.5' }, { rooms: '1.2' }, { rooms: 'NaN' }]) assert.equal(calculateValue({ ...base, ...patch }), null);
for (const district of DISTRICTS) for (const condition of CONDITIONS) for (const area of ['15', '500']) {
  const value = calculateValue({ ...base, district: district.id, condition: condition.id, area });
  assert(value && Number.isFinite(value.min) && value.min > 0 && value.max >= value.min);
}
console.log('Calculator checks passed: Ft/m² units, rounding, room/condition multipliers, decimal areas, unknown options, optional rooms and input limits.');
