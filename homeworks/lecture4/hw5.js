/**
 * 🔴 Perception Phase — Do NOT use AI to generate code.
 * Naive recursion will stack-overflow on circular refs. The `WeakMap` trick is the point.
 *
 * Submit `learning-log.md`:
 *   - What was the error output on your first naive attempt?
 *   - Why WeakMap instead of Map? (hint: garbage collection)
 */

// write a function to deep clone an object with circular reference
// 
// const data = {
//     name: 'foo',
//     child: null
// }
// data.child = data;

const cloneDeepWithLoop = (obj) => {
    // Implement the function here
}