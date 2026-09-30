// Self-check for srsEngine streak + custom-word logic.
// Run: npx tsx src/engine/srsEngine.check.ts   (or: node --experimental-strip-types)
import assert from 'node:assert/strict';
import { getStreakFromStats, computeSm2, createSrsCard, type DailyStats } from './srsEngine';

const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
};

const s = (date: string, reviewed = 1): DailyStats => ({
  date, reviewed, correct: reviewed, newLearned: 0, streak: 0, longestStreak: 0,
});

// ── streak: consecutive days ending today
assert.deepEqual(getStreakFromStats([s(day(0)), s(day(-1)), s(day(-2))]), { current: 3, longest: 3 });

// ── streak: gap breaks the run; longest remembers the old run
assert.deepEqual(
  getStreakFromStats([s(day(0)), s(day(-1)), s(day(-3)), s(day(-4)), s(day(-5))]),
  { current: 2, longest: 3 },
);

// ── streak: no activity today, but yesterday → still alive
assert.deepEqual(getStreakFromStats([s(day(-1)), s(day(-2))]), { current: 2, longest: 2 });

// ── streak: nothing today or yesterday → broken
assert.deepEqual(getStreakFromStats([s(day(-2)), s(day(-3))]), { current: 0, longest: 2 });

// ── streak: days with zero reviews do not count
assert.deepEqual(getStreakFromStats([s(day(0)), s(day(-1), 0)]), { current: 1, longest: 1 });

// ── streak: empty
assert.deepEqual(getStreakFromStats([]), { current: 0, longest: 0 });

// ── SM-2: correct answers grow the interval
let card = createSrsCard('t1');
card = computeSm2(card, 4);
assert.equal(card.interval, 1, 'first success = 1 day');
card = computeSm2(card, 4);
assert.equal(card.interval, 6, 'second success = 6 days');
const before = card.interval;
card = computeSm2(card, 5);
assert.ok(card.interval > before, 'third success extends interval');

// ── SM-2: failure resets repetitions but keeps history counters
card = computeSm2(card, 0);
assert.equal(card.repetitions, 0, 'failure resets repetitions');
assert.ok(card.totalReviews >= 4, 'totalReviews keeps counting');
assert.equal(card.easeFactor >= 1.3, true, 'ease factor floors at 1.3');

console.log('srsEngine self-check: OK');
