/**
 * 🔴 Perception Phase — Do NOT use AI to generate code.
 * Closures are "seeing but invisible state" — the only way to get it is to build one.
 *
 * Submit `learning-log.md`:
 *   - What variable does the closure capture? Where is it stored in memory?
 *   - Why doesn't calling `counter()` twice share state?
 */

function counter() {
    // implement here
}

let count = counter();
console.log(count(3));  // Output: 3
console.log(count(5));  // Output: 8 (3 + 5)
console.log(count());   // Output: 8