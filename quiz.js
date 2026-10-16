// Pure quiz logic. No DOM here, so it runs in node:test too.

export const BEST_KEY = 'ttq-best';
export const QUESTION_COUNT = 10;

// 10 questions for one table: multipliers 1–10, shuffled, no repeats.
export function makeQuestions(table, random = Math.random) {
  const multipliers = Array.from({ length: QUESTION_COUNT }, (_, i) => i + 1);
  for (let i = multipliers.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [multipliers[i], multipliers[j]] = [multipliers[j], multipliers[i]];
  }
  return multipliers.map((b) => ({ a: table, b, answer: table * b }));
}

// input is what the child typed (string or number).
export function checkAnswer(question, input) {
  const text = String(input).trim();
  if (!/^\d+$/.test(text)) return false;
  return Number(text) === question.answer;
}

// storage is anything with getItem/setItem (localStorage, or a fake in tests).
export function loadBest(storage) {
  try {
    const data = JSON.parse(storage.getItem(BEST_KEY) || '{}');
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

export function getBest(storage, table) {
  const value = loadBest(storage)[String(table)];
  return Number.isInteger(value) ? value : null;
}

// Saves only if higher than the stored best. Returns true when it saved.
export function saveBest(storage, table, score) {
  const best = loadBest(storage);
  const old = best[String(table)];
  if (Number.isInteger(old) && old >= score) return false;
  best[String(table)] = score;
  try {
    storage.setItem(BEST_KEY, JSON.stringify(best));
  } catch {
    return false;
  }
  return true;
}
