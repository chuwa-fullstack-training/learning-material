# Preface

This repo is **ONLY** for Chuwa FullStack training. If you are not a trainee within Chuwa, Please do not clone this repo.

Slides, homework, and sample codes will be uploaded here.

# Course Outline

The training is organized into 17 lectures, moving from JavaScript fundamentals through backend development into React. Slide decks live in `pre_slides/` (source) and `slides/` (rendered PDF); runnable examples for each lecture live under `sample_code/lectureN/`.

| Lecture | Topics |
|---|---|
| L1 | Course overview, dev environment setup, how AI is used in this course, intro to JavaScript |
| L2 | Control flow (conditionals/loops), objects & prototypes, arrays |
| L3 | Functions & scope, hoisting, closures, functions as values |
| L4 | Constructor functions, `this`, `__proto__` vs `prototype`, ES6 classes |
| L5 | Asynchronous JavaScript: event loop, callbacks, Promises/`async`-`await`, timers & network events |
| L6 | TypeScript: types, type assertions, unions, `tsconfig.json` |
| L7 | Backend JavaScript: Node.js, modules (CommonJS vs ESModule), npm |
| L8 | Express.js & MVC pattern: routing, middleware, templating (Pug) |
| L9 | Databases & data modeling: relational vs NoSQL, ACID, PostgreSQL, MongoDB |
| L10 | RESTful API design: resources, URIs, HTTP status codes |
| L11 | Authentication & authorization: cookies & sessions, JWT, common vulnerabilities (CSRF) |
| L12 | React fundamentals: JSX, function components, `useState`, conditional/list rendering |
| L13 | Side effects, refs & data fetching: `useEffect`, `useRef`, controlled components |
| L14 | Custom Hooks & component composition: extracting Hooks, `children`, Error Boundary |
| L15 | React Router + performance optimization: nested routes, Protected Routes, `lazy`/`memo` |
| L16 | State management: Redux (native → Toolkit), Context API, when to use what |
| L17 | Fullstack integration + TypeScript + testing + AI workflow |

See the "Final Project" section below for what comes after L17.

# Homework

Please follow the instructions below to submit your homework.

1. Provide your github account to the instructor to add you to the remote repo as a collaborator.
2. Pull this repo to your local machine.
3. Create a branch with your name, `firstname-lastname`.
4. Once the homework is done, push your branch to the remote repo.
5. Keep in mind that please do NOT mess up any other branches.
6. If you have any questions regarding git, please contact the instructor.

# Using AI Responsibly During This Training

AI is part of this training, not something to avoid or something to lean on blindly — the goal is to build the judgment to know when each is appropriate.

The course follows a three-phase model:

| Phase | Lectures | AI's role |
|---|---|---|
| 🔴 Awareness | L1–L6 | Disabled — build intuition through struggle before AI enters the picture |
| 🟡 Comparison | L7–L13 | Mirror — write your own solution first, then compare it against AI's |
| 🟢 Ownership | L14–L17 + Final Project | Accelerator — use AI freely, but you review, judge, and are accountable for the result |

A few things to keep in mind as you move through it:

- **Check each lecture's AI banner.** Every slide deck (`pre_slides/lectureN.md`) opens with a colored callout (🔴/🟡/🟢) telling you exactly how much AI is appropriate for that lecture's homework — read it before you start, don't assume.
- **Rule of thumb**: closures, scope, async, and core algorithm logic should be done by hand — the struggle is where the learning happens. System design and architecture decisions must be *yours*, even if AI writes the resulting code — you have to be able to explain why. Boilerplate and config are fine to get AI's help with. Obscure API parameters aren't worth memorizing either way — just look them up.
- **In the Ownership phase, keep an AI Usage Log** with your homework, documenting what AI helped with and what judgment calls you made.
- **The review/interview prep materials have their own, stricter AI policy** that varies file-by-file — check the table in `homeworks/review/README.md` before using AI there (some files, like the mock interviews, are strict no-AI).

# Slides and Sample Codes

If you find any typo or mistake in the slides, please let me know. I will fix it as soon as possible.

# Demo Project - Mini Tweet

I will go through a demo project, Mini Tweet, from the scratch, to give you a clearer picture and better idea of how to build a web application, both backend and frontend. If you are new to web development, this demo project will be a good start for you and you can follow my suggestions to finish your final projects. Otherwise, you can follow your own way to build your final projects.

[Demo](https://demo.chuwaweb.com/)

# Final Project

There are two final projects. You have to finish them all to pass the training.

You will be asked to make teams to conquer these two projects. The group size is 2-3 people. You can choose your own group members. If you don't have any group members eventually, TA will help you find a group.

## Product Management

You will get details in the class

## Employee Management

You will get details in the class

# Questions & Contributions

Have a question, spotted an issue, or found a mistake? Feel free to open a GitHub issue. If you'd like to contribute a fix or improvement, open a PR against `main`.

