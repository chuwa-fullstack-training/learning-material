/**
 * 🟡 Understanding Phase — compose promises sequentially.
 * (Async review — ensure L5 is still solid before doing this.)
 *
 * Submit `learning-log.md`:
 *   - Why does the reduce-based sequential pattern work?
 *   - Contrast with Promise.all — what would go wrong if you used it here?
 */

// 1. use `promise` to print 1, 2, 3 in every 1 second
function print() {
  // your code here
}

// improved: print every single numbers in a list in every 1 second
// hint: `reduce`
const nums = [3, 1, 6, 9, 2];

function printList() {
  // your code here
}

// 2. traffic light
// output: red -> green -> yellow -> red -> ...
// the delay time is up to you, but the order has to be correct
function trafficLight() {
  // your code here
}
