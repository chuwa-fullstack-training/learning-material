/**
 * 🟡 Understanding Phase — architecture first, AI-assisted boilerplate OK.
 * You MUST be able to explain:
 *   - What does each middleware do, and in what order do they run?
 *   - Why does Express use routers (vs a giant switch/case)?
 *
 * Submit `design-decisions.md`:
 *   - Your router organization and why.
 *   - Which middleware did you use and what does each guarantee?
 */

/**
 * Refactor hw1 and hw2 in lecture 7 in Express.js.
 * Requirements:
 * 1. make two routers, one for hw1 and one for hw2;
 * 2. hw1 should be able to handle requests with url params, rather than command-line arguments;
 *  - e.g. http://localhost:3000/hw1/<dir>/<ext>
 *  - `dir` only support one level down from the current repository,
 *    i.e http://localhost:3000/hw1/test/txt.
 *    You don't need to handle the case like http://localhost:3000/hw1/test/test/txt.
 * 3. hw2 should be able to handle requests with query strings like it did in lecture 7;
 */