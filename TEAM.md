# TEAM.md — Times Table Quiz

**Goal:** a tiny phone-first static web app (vanilla HTML/CSS/JS, no build step, no backend, no tracking) for kids 7–10: Home (pick table 1–10, each shows best score) and Quiz (10 questions, big keypad, instant friendly feedback with the right answer when wrong, "You got N out of 10!" + Play again; best score per table in localStorage). Live on GitHub Pages at https://iliyab09.github.io/times-tables-solo/ . Ship the two screens, nothing more.

**Builder (Dev):** owns everything in the repo: `index.html`, `style.css`, `app.js`, `quiz.js` (pure logic: question generation, scoring, best-score storage), `test/quiz.test.js` (node:test), `.github/workflows/ci.yml` (conflict-marker check + `node --test`) and `.github/workflows/pages.yml` (deploy repo root to GitHub Pages on push to main). Works in small PRs on branches `dev/<topic>`.

**Reviewer (QA):** reviews every PR (`gh pr diff`, run it with Playwright at phone width ~390px only for PRs that change screens or deploy), replies with `gh pr review <n> --comment -b "APPROVED"` or `"CHANGES REQUESTED: <repro>"`. Light testing level: CI is the baseline, one full manual play-through once the app is live.

**Review flow:** Dev opens PR → messages QA with the link → QA comments APPROVED / CHANGES REQUESTED → Dev fixes or merges (`gh pr merge <n> --squash`, never `--delete-branch`) → Dev tells the Director when something is merged or live.
