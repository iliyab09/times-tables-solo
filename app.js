import { makeQuestions, getBest } from './quiz.js';

const $ = (id) => document.getElementById(id);
const storage = window.localStorage;

function show(id) {
  for (const el of document.querySelectorAll('.screen')) el.hidden = el.id !== id;
}

function renderHome() {
  const grid = $('tables');
  grid.textContent = '';
  for (let t = 1; t <= 10; t++) {
    const best = getBest(storage, t);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = `${t}× — ${best === null ? 'Not played yet' : `Best ${best}/10`}`;
    btn.addEventListener('click', () => startQuiz(t));
    grid.append(btn);
  }
  show('home');
}

function startQuiz(table) {
  const questions = makeQuestions(table);
  const q = questions[0];
  $('progress').textContent = `Question 1 of ${questions.length}`;
  $('question').textContent = `${q.a} × ${q.b} = ?`;
  show('quiz');
}

$('home-btn').addEventListener('click', renderHome);
renderHome();
