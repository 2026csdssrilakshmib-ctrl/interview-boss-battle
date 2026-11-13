# 🎮 The Interview Boss Battle

An interactive, gamified technical & behavioral interview simulator where questions are presented as a high-stakes RPG boss battle against "Lord Syntax" (Level 99 Principal Architect).

---

## 📜 Complete Evaluation Documentation Vault (DOC-01 to DOC-06)

### 🏷️ DOC-01: README & Quickstart
- **Project Purpose**: Gamify the software engineering final-round interview into a tactical turn-based battle, teaching candidates how to protect composure (Confidence HP), structure STAR behavioral answers, and communicate senior trade-offs.
- **Core Features**:
  1. 10 interactive dilemmatic questions presented one per page.
  2. Reactive Confidence HP bar vs Boss Skepticism bar with floating combat text.
  3. Interactive STAR framework blueprint helper for behavioral questions.
  4. S/A/B/C Tier Scorecard with 2 dynamic improvement tips and motivational quote.
  5. 24×24 pixel-art form boss emoji mascot with Web Audio API sound effects.
  6. 5-Path Landing Portal including Judge Verification Suite.
- **No-Secret Setup Steps**:
  1. Run `python -m http.server 8080` in the directory, or double-click `index.html`.
  2. Zero API keys, environment variables, or cloud dependencies required.
- **Demo Data**: 10 real-world engineering scenarios covering traffic scaling, live incident triage, tech debt negotiation, and cross-functional leadership.
- **30-Second Judge Action Plan**: Click the **Judge Demo** tab -> Click **Step 01** to test HP meter -> Click **Step 02** to test STAR helper -> Click **Step 03** to verify Rank & Tips.
- **Known Limitations**: Single-player client-side simulation, static question pool of 10 curated questions (extendable via JSON database), synthetic Web Audio sounds.

---

### 🏷️ DOC-02: Judge Runbook (60-Second Demo Script)
1. **Starting State (0:00 - 0:10)**: Open `http://localhost:8080`. Notice the 5-Path Portal, active class badge, and the interactive pixel boss emoji.
2. **Action 1 (0:10 - 0:25)**: Click **Judge Demo** -> Click `[🚀 Jump to Step 01]`. Select **Option B**. Observe the green `+10 Confidence` float, Boss Skepticism damage, and instant hiring committee rationale.
3. **Action 2 & THE TWIST (0:25 - 0:45)**: Click `[🏠 Portal]` -> Click `[⭐ Jump to Step 02 (Q5)]`.
   - **The Twist**: Boss unleashes a Critical Behavioral Attack! The purple **STAR Blueprint Box** demands Situation, Task, Action, and Result structure.
   - Click **Option D** to show what happens on a passive-aggressive answer: violent screen shake and `-30 HP` damage!
   - Inspect **Option B** to observe the structured `[S]`, `[T]`, `[A]`, `[R]` benchmark breakdown.
4. **Action 3 (0:45 - 0:60)**: Click `[🏠 Portal]` -> Click `[🏆 Jump to Step 03 (Results)]`. Verify the S/A/B/C Tier badge, 2 tailored tips, motivational quote with refresh toggle, and 10-question review drawer.
- **Simulated Features**: Web Audio API oscillator synthesis, state-driven SVG boss expressions, and algorithmic candidate ranking.

---

### 🏷️ DOC-03: Five-Test Checklist
1. **Test 1: Invalid / Spam Input Check**:
   - *Steps*: Rapidly double-click multiple choices on any question.
   - *Expected*: All 4 choice buttons instantly disable on the first selection (`disabled = true`), preventing double-counting.
2. **Test 2: Happy Path Test (Optimal Run)**:
   - *Steps*: Select Option B (or correct answer) across all 10 questions.
   - *Expected*: Candidate finishes with 100/100 Confidence HP, Boss HP at 0, Rank S "Principal Offer Extended", and STAR Mastery rated "Master (S)".
3. **Test 3: The Twist Check (STAR Blueprint Enforcement)**:
   - *Steps*: Navigate to Question 5.
   - *Expected*: The STAR Blueprint helper automatically expands, and Option B displays formatted `[S]`, `[T]`, `[A]`, `[R]` chips contrasted with unstructured answers.
4. **Test 4: Reset / Refresh Check**:
   - *Steps*: Mid-battle on Question 7, click "🏠 Portal" in HUD or "Play Again" on results.
   - *Expected*: State completely purges: HP resets to 100/100, score resets to 0, question index resets to 0, returning to initial landing hub.
5. **Test 5: Boundary Case Test (Zero HP Clamping)**:
   - *Steps*: Intentionally pick wrong answers consecutively.
   - *Expected*: Confidence HP safely clamps at a minimum floor (10 HP), bar color shifts from Green (>65%) to Yellow (35-65%) to Red (<35%) without negative number overflow.

---

### 🏷️ DOC-04: User Quickstart
1. **What the App Does**: An interactive simulator that teaches you how real hiring committees evaluate technical trade-offs and behavioral STAR questions through an RPG boss battle.
2. **What Input to Provide**: Click any of the 4 multiple choice options per page representing your answer strategy (concise metrics, architecture trade-offs, or STAR answers).
3. **What Result to Expect**: Immediate HP & confidence adjustments with audio-visual feedback, boss reaction dialogues, and in-depth hiring manager debriefs. At the end, you receive an S/A/B/C Rank, two personalized growth tips, and a motivational quote.
4. **How to Recover from a Mistake**: When you pick a flawed answer, read the hiring manager breakdown to diagnose the issue. Subsequent correct answers award +10 to +15 Confidence HP recovery. You can also click `🏠 Portal` to restart or review tips.

---

### 🏷️ DOC-05: Data & Privacy Note
- **Stored Fields**: In-memory session variables only: `currentQuestionIndex`, `candidateHp`, `bossHp`, `score`, `userAnswers` (chosen keys and correctness), `playerClass`, and `soundEnabled`.
- **Local Browser Storage**: Does **NOT** use `localStorage`, `sessionStorage`, or cookies. Everything resides in memory during the page session.
- **Demo / Fake Data**: All question prompts, company scenarios, boss dialogues, and scores are simulated educational mock data.
- **Outbound Data Transmission**: Zero telemetry, zero analytics tracking, zero third-party network requests. Operates 100% offline.
- **Confirmation of No Secrets**: Confirmed 100% secret-free. Zero API keys, passwords, tokens, or credentials exist in the codebase.

---

### 🏷️ DOC-06: Handoff & Limitations
- **Main Files / Components**:
  - `index.html`: Layout, 5-path portal tabs, boss HUD meters, question viewport, scorecard, and Docs Vault.
  - `style.css`: Cyberpunk/RPG visual system, pixel-art styling, responsive layouts, DOC badge palettes.
  - `app.js`: Sound synthesizer (`SoundFX`), question database (`QUESTIONS_DB`), state machine, and dynamic tips engine.
- **Where Core Logic Lives**: HP delta math, question transitions, and score calculations reside in `handleChoiceSelect()`, `goToNextQuestion()`, and `finishBattle()` in `app.js`.
- **How Demo Data is Reset**: Handled by `resetGame()` and `returnToPortal()` which reinitialize state variables to baseline values (100 HP, 0 score).
- **What is Deliberately Mocked**: AI voice synthesis is mocked using client-side Web Audio oscillators; multi-player ranking is mocked using percentile math.
- **Top 3 Improvements Needed for Real Deployment**:
  1. *Dynamic Question Engine*: Backend database with role-specific pools (Frontend, Backend, DevOps, AI Engineer).
  2. *Speech-to-Text Voice Analysis*: Allow candidates to speak answers aloud and evaluate conversational pacing and STAR filler-word ratios.
  3. *Persistent User Dashboard*: Cloud user authentication with progress analytics and exportable PDF interview performance reports.

---

## 🚀 Live Access

- **Local Web Server**: [http://localhost:8080](http://localhost:8080)
- **Direct File**: [index.html](file:///C:/Users/dv_sr/.gemini/antigravity/scratch/interview-boss-battle/index.html)
- **Artifact Copy**: [interview-boss-battle.html](file:///C:/Users/dv_sr/.gemini/antigravity/brain/bebce529-fd1b-48ff-9682-f00025915b83/interview-boss-battle.html)
