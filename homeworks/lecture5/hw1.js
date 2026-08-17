/**
 * 🔴 Perception Phase — Strictly NO AI, NO running the code.
 * This is a classic interview question. You MUST predict the output and execution order
 * on paper / in a comment, in your head — the value of this homework is simulating the Event Loop yourself.
 *
 * Two-step submission:
 *   1. Write your predicted output + a one-line explanation next to each snippet.
 *   2. THEN run the code to verify. DO NOT skip step 1.
 *
 * Submit `learning-log.md`:
 *   - Which snippet broke your mental model?
 *   - Explain the `var` vs `let` difference using the closure-over-loop-variable concept.
 */

// what is the output of the following code? and explain why?

// 1
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 1000);
}

// 2
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 1000);
}

// 3
for (var i = 0; i < 5; i++) {
  (function (i) {
    setTimeout(() => console.log(i), 1000);
  })(i);
}

// 4
let fn = () => {
  console.log('I am fn');
}
setTimeout(fn, 1000);
fn = () => {
  console.log('I am another fn');
}

// 5
let obj = {
  name: 'obj',
}
setTimeout(() => console.log(obj), 1000);
obj.name = 'another obj';