/**
 * 🟡 Understanding Phase — basic types by hand, advanced types may reference AI.
 * Try to fix by hand FIRST. Only consult AI after your own attempt.
 *
 * Submit `learning-log.md`:
 *   - Explain why TypeScript rejects the return in #1 (hint: generic type preservation).
 *   - For #2, describe the `overloads` solution and why `string | number` alone fails.
 */

// 1. why there would be error in the following code? and how to fix it?
type User = {
  id: number;
  type: string;
};

function makeCustomer<T extends User>(u: T): T {
  return {
    id: u.id,
    type: "customer",
  };
}

// 2. fix the following code
// requirement: the function should accept either two strings or two numbers at the same time,
// so if parameters are one string and one number, it should throw an error
function f(a: string | number, b: string | number) {
  if (typeof a === "string") {
    return `${a} : ${b}`;
  } else {
    return a + b;
  }
}
