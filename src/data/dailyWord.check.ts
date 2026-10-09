// Self-check for daily-word determinism.
// Run: npx tsx src/data/dailyWord.check.ts
import assert from 'node:assert/strict';
import { getWordsByLevels } from './hskMasterData';

// Mirrors getDaySeed() in DailyWordPage.tsx
const getDaySeed = (d: Date) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();

const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return getDaySeed(d);
};

const pick = (seed: number) => {
  const pool = getWordsByLevels([1]);
  return pool[seed % pool.length];
};

// ── same day → same word (no Math.random anywhere in the path)
assert.equal(pick(day(0)), pick(day(0)), 'same day yields same word');

// ── word actually exists and is non-empty
const w = pick(day(0));
assert.ok(w && w.hanzi.length > 0, 'picked word has hanzi');
assert.ok(w.pinyin.length > 0, 'picked word has pinyin');
assert.ok(w.meaning.length > 0, 'picked word has meaning');
assert.equal(w.sentences.length, 2, 'picked word has 2 example sentences');

// ── consecutive days walk the pool forward (no repeat until pool exhausted)
const poolSize = getWordsByLevels([1]).length;
const seen = new Set<string>();
for (let i = 0; i < poolSize; i++) seen.add(pick(day(i)).id);
assert.equal(seen.size, poolSize, `first ${poolSize} days cover every word exactly once`);

// ── index stays in bounds for multi-level pools too
for (const levels of [[1], [1, 2], [3, 4, 5], [6]]) {
  const pool = getWordsByLevels(levels);
  assert.ok(pool.length > 0, `levels ${levels} is non-empty`);
  const idx = day(0) % pool.length;
  assert.ok(idx >= 0 && idx < pool.length, `index in bounds for ${levels}`);
}

console.log('dailyWord self-check: OK');
