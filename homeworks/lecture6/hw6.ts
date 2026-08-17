/**
 * 🟡 Mini-Project — bridges L2 (object operations) → L6 (TS) → L17 (TS+React).
 *
 * Goal: take the four functions you wrote in L2 hw1 (`extend`, `union`, `restrict`, `intersection`)
 * and rewrite them in TypeScript with PROPER generic types.
 *
 * Why this matters:
 *   - You'll feel the value of generics first-hand: `extend(o, p)` should accept any two object types
 *     and return a precisely typed result, not just `any` or `object`.
 *   - The patterns you discover here (`Pick`, `Omit`, intersection types) are exactly what you'll
 *     need in L17 when typing React component props and API responses.
 *
 * Requirements:
 *   1. Define each function's signature using generics. Avoid `any`.
 *   2. The return type must accurately reflect the result. For example:
 *        - `extend<O, P>(o: O, p: P): O & P`
 *        - `union<O, P>(o: O, p: P): O & P`         // P fields override only when O lacks them — think about how to type this
 *        - `restrict<O, P>(o: O, p: P): Partial<O>`  // is Partial right? what's the most precise type?
 *        - `intersection<O, P>(o: O, p: P): Pick<O, ???>`  // research keyof + conditional types if needed
 *   3. Write at least 4 test cases (using `console.assert` or a tiny test harness) that show:
 *        - The runtime behavior matches L2 hw1.
 *        - The TypeScript compiler catches at least one mistake (e.g., accessing a removed field).
 *
 * Submit `learning-log.md`:
 *   - Which return type was hardest? Why?
 *   - What error did the TS compiler catch that you wouldn't have noticed in plain JS?
 *   - Looking ahead to L17: where do you think these typing patterns will show up in React code?
 */

// 1. extend: copy enumerable properties of p to o, return o (o's existing props win)
export function extend</* generics */>(/* params */): /* return type */ {
    // implement
    throw new Error('not implemented');
}

// 2. union: new object with both o's and p's properties (o wins on conflicts)
export function union</* generics */>(/* params */): /* return type */ {
    throw new Error('not implemented');
}

// 3. restrict: remove properties from o that don't exist in p, return o
export function restrict</* generics */>(/* params */): /* return type */ {
    throw new Error('not implemented');
}

// 4. intersection: new object with only the properties that appear in both o and p (values from o)
export function intersection</* generics */>(/* params */): /* return type */ {
    throw new Error('not implemented');
}

// ---- Test cases below ----
// Add your assertions here. Both runtime correctness AND type-level correctness are graded.
