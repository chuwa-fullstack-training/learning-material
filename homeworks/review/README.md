# Comprehensive Review & Interview Prep

> 🔴 **AI policy — different rules for different files.** Read carefully:
>
> | Material | AI rule |
> |----------|---------|
> | `javascript-review.md` | 🔴 **No AI.** Pen, paper, or comments only. JS fundamentals must be answered from your own head. |
> | `react-review.md` | 🟡 **Mostly no AI**, with one exception: AI may generate **mock data, seed JSON, or fake API endpoints** to bootstrap a challenge. All React/Hook/component code must be written by you. See the file's intro for the full breakdown. |
> | `mock-interview-js.md` | 🔴 **Strict no AI.** This is interview simulation. |
> | `mock-interview-react.md` | 🔴 **Strict no AI.** Including mock data — interview conditions don't let you generate fixtures. |
>
> If in doubt: would a senior engineer ask you to **explain** this code in an interview? If yes → write it yourself. If it's pure data plumbing → AI is OK on the React challenges file only.

This folder contains comprehensive review questions covering everything taught in the course (JavaScript L1–L6 and React L12–L17). Use them for two purposes:

1. **Knowledge consolidation** — work through the topic-organized review files (`javascript-review.md`, `react-review.md`) to spot gaps in your understanding.
2. **Interview rehearsal** — use the timed mock files (`mock-interview-js.md`, `mock-interview-react.md`) to simulate real conditions.

## Files

| File | Purpose | Time | When to use |
|------|---------|------|-------------|
| `javascript-review.md` | Topic-organized JS questions (L1–L6) | 4–6 hours total | After L6 |
| `react-review.md` | Comprehensive React coding challenges (L12–L17) | 15–25 hours total | After L17 |
| `mock-interview-js.md` | 30-min timed JS mock | 30 min | After L6 / before interviews |
| `mock-interview-react.md` | 30-min timed React mock | 30 min | After L17 / before interviews |

## How to use

### For topic review files

1. Open in a non-distracting view. **Close ChatGPT, Copilot, etc.** (Exception: React challenges may use AI for mock data only — see the file's intro.)
2. For each section, attempt every question on paper or in a comment first.
3. Only after submitting your answer, check the relevant lecture slides or run the code.
4. Track which sections felt weak and revisit those lectures.

### For mock interviews

1. Set a timer. No tabs except a code editor (no AI, no Stack Overflow, no mock-data generation).
2. Speak your reasoning aloud (even alone) — interviewers care about your thought process.
3. After finishing, write a brief retrospective:
   - Which questions stumped you?
   - Where did you blank out vs. just run out of time?
   - What concepts will you re-study?

## Question types

Each section mixes:
- **Concept Q** — explain in plain English (interviewers ask these to check understanding)
- **Output prediction** — read code, predict result (tests scope/closure/async mental model)
- **Find the bug** — code review (tests judgment, the most under-practiced skill)
- **Implement** — small coding task (tests fluency)
- **Design / Compare** — when would you use X vs. Y? (tests architectural thinking)

## Coverage map

```
JavaScript:  L1-L2 basics → L3 closures → L4 prototype/Class → L5 async → L6 TypeScript
React:       L12 basics → L13 effects/refs → L14 custom hooks → L15 router/perf → L16 state mgmt → L17 TS+testing
```

If a question references a topic you've never seen, it means you skipped a lecture — go back.
