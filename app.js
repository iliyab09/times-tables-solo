import { makeQuestions, checkAnswer, getBest, saveBest, QUESTION_COUNT } from './quiz.js';

const $ = (id) => document.getElementById(id);
const FEEDBACK_MS = 1200;
const MAX_DIGITS = 3;

// localStorage can throw (private mode, blocked storage); fall back to memory.
const storage = (() => {
  try {
    const s = window.localStorage;
    s.getItem('ttq-best');
    return s;
  } catch {
    const mem = {};
    return { getItem: (k) => mem[k] ?? null, setItem: (k, v) => { mem[k] = String(v); } };
  }
})();

const state = { table: 0, questions: [], index: 0, score: 0, typed: '', locked: false, timer: 0 };

function show(id) {
  for (const el of document.querySelectorAll('.screen')) el.hidden = el.id !== id;
  window.scrollTo(0, 0);
}

function renderHome() {
  clearTimeout(state.timer);
  const grid = $('tables');
  grid.textContent = '';
  for (let t = 1; t <= 10; t++) {
    const best = getBest(storage, t);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `table-btn c${t}`;
    btn.innerHTML = `<span class="table-num">${t}×</span><span class="table-best"></span>`;
    btn.querySelector('.table-best').textContent = best === null ? 'Not played yet' : `Best ${best}/10`;
    btn.addEventListener('click', () => startQuiz(t));
    grid.append(btn);
  }
  show('home');
}

function startQuiz(table) {
  clearTimeout(state.timer);
  Object.assign(state, { table, questions: makeQuestions(table), index: 0, score: 0 });
  $('play').hidden = false;
  $('results').hidden = true;
  show('quiz');
  renderQuestion();
}

function renderQuestion() {
  const q = state.questions[state.index];
  state.typed = '';
  state.locked = false;
  $('progress').textContent = `Question ${state.index + 1} of ${QUESTION_COUNT}`;
  $('question').textContent = `${q.a} × ${q.b} = ?`;
  $('feedback').textContent = '';
  $('feedback').className = 'feedback';
  renderTyped();
}

function renderTyped() {
  $('answer').textContent = state.typed || ' ';
  $('answer').classList.toggle('empty', !state.typed);
}

function press(key) {
  if (state.locked) return;
  if (/^\d$/.test(key)) {
    if (state.typed.length < MAX_DIGITS) state.typed = state.typed === '0' ? key : state.typed + key;
  } else if (key === 'Backspace') {
    state.typed = state.typed.slice(0, -1);
  } else if (key === 'Enter') {
    if (state.typed) check();
    return;
  }
  renderTyped();
}

function check() {
  const q = state.questions[state.index];
  const right = checkAnswer(q, state.typed);
  state.locked = true;
  if (right) state.score++;
  const fb = $('feedback');
  fb.textContent = right ? 'Yes! 🎉' : `Not quite. ${q.a} × ${q.b} = ${q.answer}`;
  fb.className = `feedback ${right ? 'good' : 'bad'}`;
  state.timer = setTimeout(next, FEEDBACK_MS);
}

function next() {
  state.index++;
  if (state.index < QUESTION_COUNT) renderQuestion();
  else finish();
}

function finish() {
  saveBest(storage, state.table, state.score);
  $('score').textContent = `You got ${state.score} out of ${QUESTION_COUNT}!`;
  $('progress').textContent = `${state.table}× table`;
  $('play').hidden = true;
  $('results').hidden = false;
  $('again-btn').focus();
}

$('keypad').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-key]');
  if (btn) press(btn.dataset.key);
});

document.addEventListener('keydown', (e) => {
  if ($('quiz').hidden || !$('results').hidden) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (/^\d$/.test(e.key) || e.key === 'Backspace' || e.key === 'Enter') {
    e.preventDefault();
    press(e.key);
  }
});

$('again-btn').addEventListener('click', () => startQuiz(state.table));
$('home-btn').addEventListener('click', renderHome);
$('quit-btn').addEventListener('click', renderHome);

renderHome();
