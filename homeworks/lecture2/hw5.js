/**
 * 🔴 Perception Phase — Predict by hand first. NO running, NO AI.
 * Trace the hoisting step by step in a comment. Then run to verify.
 *
 * Submit `learning-log.md`:
 *   - Draw (in ASCII or text) the pre-hoisting and post-hoisting scope.
 *   - Which line surprised you and why?
 */

// Hoisting

// 1.
var x;

if (x !== 3) {
  console.log(y);
  var y = 5;
  if (y === 5) {
    var x = 3;
  }
  console.log(y);
}
if (x === 3) {
  console.log(y);
}


// 2.
var x = 3;
if (x === 3) {
  var x = 2;
  console.log(x);
}
console.log(x);

