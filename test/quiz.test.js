import test from 'node:test';
import assert from 'node:assert/strict';
import { makeQuestions, checkAnswer, getBest, saveBest, BEST_KEY } from '../quiz.js';

function fakeStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
    data,
  };
}

test('makeQuestions: 10 unique multipliers 1–10 with correct products', () => {
  for (let table = 1; table <= 10; table++) {
    const qs = makeQuestions(table);
    assert.equal(qs.length, 10);
    assert.deepEqual(qs.map((q) => q.b).sort((x, y) => x - y), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    for (const q of qs) {
      assert.equal(q.a, table);
      assert.equal(q.answer, table * q.b);
    }
  }
});

test('checkAnswer accepts only the right whole number', () => {
  const q = { a: 7, b: 4, answer: 28 };
  assert.equal(checkAnswer(q, '28'), true);
  assert.equal(checkAnswer(q, 28), true);
  assert.equal(checkAnswer(q, '27'), false);
  assert.equal(checkAnswer(q, ''), false);
});

test('best score only increases and is stored under ttq-best', () => {
  const s = fakeStorage();
  assert.equal(getBest(s, 7), null);
  assert.equal(saveBest(s, 7, 6), true);
  assert.equal(saveBest(s, 7, 4), false);
  assert.equal(getBest(s, 7), 6);
  assert.equal(saveBest(s, 7, 8), true);
  assert.deepEqual(JSON.parse(s.data[BEST_KEY]), { 7: 8 });
  assert.equal(getBest(fakeStorage({ [BEST_KEY]: 'not json' }), 7), null);
});
