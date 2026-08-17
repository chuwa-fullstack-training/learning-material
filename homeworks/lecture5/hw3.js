/**
 * 🔴 Perception Phase — Strictly NO AI, NO running the code first.
 * Predict the order on paper. The whole point is building the Event Loop mental model.
 *
 * Two-step submission:
 *   1. Write predicted output with a 1-line reason (which queue? microtask vs macrotask?).
 *   2. Run to verify.
 *
 * Submit `learning-log.md`:
 *   - Where did you confuse microtask vs macrotask?
 *   - In snippet 1, why does `reject('f')` after `resolve('d')` have no effect?
 */

// what is the output in order? and explain why?

// 1
console.log('a');
setTimeout(() => console.log('b'), 0);
console.log('c');
new Promise((resolve, reject) => {
  resolve('d');
  console.log('e');
  reject('f');
}).then(result => console.log(result));

// 2
const fn = () =>
  new Promise((resolve, reject) => {
    console.log(1);
    resolve('success');
  });

fn().then(res => {
  console.log(res);
});

console.log('start');
