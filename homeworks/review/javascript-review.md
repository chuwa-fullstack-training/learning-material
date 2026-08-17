# JavaScript Comprehensive Review (L1–L6)

> 🔴 **No AI. No running code first. Pen, paper, or comments only.**
> After answering each question, then verify with a runtime / docs / lecture slides.

Topics: types & coercion · scope & hoisting · closures · `this` · prototype/Class · array methods · Event Loop · Promise · TypeScript

---

## Section 1 — Types, Equality, Coercion (L1–L2)

### Concept

1. List all 7 primitive types in JavaScript. Which ones are passed by reference?
2. Explain the difference between `==` and `===`. Give an example where they disagree.
3. What is the difference between `null` and `undefined`? When does each occur naturally?
4. Why is `typeof null === 'object'`?

### Output prediction

```js
// 1
console.log([] == ![]);           // ?
console.log([] == false);          // ?
console.log({} == {});             // ?

// 2
console.log(NaN === NaN);          // ?
console.log([1] == 1);             // ?
console.log([1, 2] + [3, 4]);      // ?

// 3
console.log(1 + '2' + 3);          // ?
console.log(1 + +'2' + 3);         // ?
console.log('5' - 3);              // ?
console.log('5' + 3);              // ?
```

### Find the bug

```js
function isEqual(a, b) {
  return a == b;
}

isEqual(0, '');         // returns true — is that what we want?
isEqual(0, false);      // returns true — is that what we want?
isEqual(null, undefined); // returns true — is that what we want?
```

What's wrong with this design? Rewrite using `===` and explain when you'd ever want `==`.

---

## Section 2 — Scope & Hoisting (L2)

### Concept

1. What is the Temporal Dead Zone? Which keywords have it?
2. Explain hoisting in your own words. What gets hoisted, and what doesn't?
3. Difference between function declarations and function expressions in terms of hoisting.

### Output prediction

```js
// 1
console.log(a);
var a = 1;
console.log(a);

// 2
console.log(b);
let b = 2;

// 3
function test() {
  console.log(x);
  if (true) {
    var x = 10;
  }
}
test();

// 4
var foo = 1;
function bar() {
  console.log(foo);
  var foo = 2;
}
bar();

// 5
console.log(typeof undeclaredVariable);
console.log(undeclaredVariable);
```

### Implement

Without using `let` or `const`, fix this code so it logs 0,1,2,3,4 (one per second):

```js
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 1000 * i);
}
```

Provide two solutions

---

## Section 3 — Closures & Higher-Order Functions (L3)

### Concept

1. Define a closure in one sentence. Give a real-world use case where you'd reach for one.
2. Why does each call to a factory function create a separate closure? (e.g., calling `counter()` twice)
3. Memory implications of closures — what's the risk if you create many closures over a large object?

### Output prediction

```js
// 1
function makeAdder(x) {
  return function (y) {
    return x + y;
  };
}
const add5 = makeAdder(5);
const add10 = makeAdder(10);
console.log(add5(2));     // ?
console.log(add10(2));    // ?
console.log(add5(add10(1))); // ?

// 2
function counter() {
  let count = 0;
  return {
    inc: () => ++count,
    get: () => count,
  };
}
const c1 = counter();
const c2 = counter();
c1.inc(); c1.inc(); c2.inc();
console.log(c1.get(), c2.get());

// 3
const fns = [];
for (let i = 0; i < 3; i++) {
  fns.push(() => i);
}
console.log(fns.map((f) => f()));

// repeat with var:
const fns2 = [];
for (var i = 0; i < 3; i++) {
  fns2.push(() => i);
}
console.log(fns2.map((f) => f()));
```

### Implement

1. Write `once(fn)` which returns a function that only ever calls `fn` once and caches the result.
2. Write `memoize(fn)` which caches results by stringified arguments.

---

## Section 4 — `this`, Prototype Chain, Class (L4)

### Concept

1. Four ways `this` can be bound. Which one wins when multiple apply?
2. Difference between `__proto__` and `prototype`. Which exists on instances vs. constructors?
3. How does `class extends` desugar to ES5 prototype code?
4. Why are arrow functions said to "not have their own `this`"? Is this exactly true?

### Output prediction

```js
// 1
const obj = {
  name: 'Aaron',
  greet: function () { console.log(this.name); },
  greetArrow: () => console.log(this.name),
};
obj.greet();
obj.greetArrow();
const fn = obj.greet;
fn();

// 2
function Animal() { this.legs = 4; }
Animal.prototype.move = function () { return 'moving on ' + this.legs + ' legs'; };
function Dog() { Animal.call(this); }
Dog.prototype = Object.create(Animal.prototype);
const d = new Dog();
console.log(d.move());
console.log(d instanceof Animal, d instanceof Dog);

// 3
class A {
  constructor() { this.x = 1; }
  getX() { return this.x; }
}
class B extends A {
  constructor() { super(); this.x = 2; }
}
const b = new B();
console.log(b.getX(), b instanceof A);

// 4
const arr = [1, 2, 3];
console.log(arr.__proto__ === Array.prototype);
console.log(Array.prototype.__proto__ === Object.prototype);
console.log(Object.prototype.__proto__);
```

### Find the bug

```js
class Timer {
  constructor() { this.seconds = 0; }
  start() {
    setInterval(function () {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  }
}
new Timer().start();
```

Why does this print `NaN`? Show two ways to fix it.

### Implement

1. Implement `Function.prototype.myBind` (your own version of `bind`).
2. Implement `instanceof` as a function: `myInstanceof(obj, Constructor)`.

---

## Section 5 — Array Methods & Functional Patterns (L4)

### Concept

1. What does `reduce` need its initial value for? When can you safely omit it?

### Implement (only `map`/`filter`/`reduce`, no loops)

```js
// 1. Doubled even numbers
doubleEvens([1, 2, 3, 4]); // [4, 8]

// 2. Group by a key
groupBy(
  [{ type: 'a', val: 1 }, { type: 'b', val: 2 }, { type: 'a', val: 3 }],
  'type'
); // { a: [{...}, {...}], b: [{...}] }

// 3. Flatten one level (without Array.prototype.flat)
flatten([[1, 2], [3], [4, 5]]); // [1, 2, 3, 4, 5]

// 4. Implement your own `map` using `reduce`.

// 5. Sum of all numbers in a deeply nested array (e.g. [1, [2, [3, [4]]]] → 10)
//    HINT: recursion + reduce
```

---

## Section 6 — Event Loop, Promise, async/await (L5)

### Concept

1. Describe the Event Loop in your own words: call stack, task queue, microtask queue. Where does `Promise.then` go vs. `setTimeout`?
2. Difference between `Promise.all`, `Promise.allSettled`, `Promise.race`. Give a use case for each.
3. Is `async/await` really equivalent to `.then` chains? Where do they differ?
4. What happens if you `throw` inside an `async` function? What about inside a `setTimeout` callback?

### Output prediction (the ✨ classic interview territory ✨)

```js
// 1
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');

// 2
async function foo() {
  console.log('A');
  await Promise.resolve();
  console.log('B');
}
console.log('start');
foo();
console.log('end');

// 3
Promise.resolve(1)
  .then((v) => { console.log(v); return 2; })
  .then((v) => { console.log(v); throw new Error('oops'); })
  .then((v) => console.log('skipped?', v))
  .catch((e) => { console.log('caught:', e.message); return 3; })
  .then((v) => console.log(v));

// 4
async function delay(ms, label) {
  return new Promise((r) => setTimeout(() => { console.log(label); r(); }, ms));
}
async function go() {
  await delay(100, 'a');
  await delay(50, 'b');
  console.log('done');
}
go();
console.log('after go()');
```

### Implement

1. `sleep(ms)` — returns a Promise that resolves after `ms` milliseconds.
2. `promisify(fn)` — converts a Node-style `(err, data) => ...` callback function to a Promise-returning one.
3. `runInSequence(tasks)` — given an array of async functions, run them one after another, returning an array of results.
4. `runWithConcurrency(tasks, n)` — run `tasks` (array of async fns), at most `n` running at once.
5. `retry(fn, times)` — call `fn`. If it rejects, retry up to `times` times before giving up.

### Find the bug

```js
async function fetchAll(urls) {
  const results = [];
  urls.forEach(async (url) => {
    const res = await fetch(url);
    results.push(await res.json());
  });
  return results;
}
```

`fetchAll` always returns `[]`. Why? Fix it two ways: (a) sequential, (b) parallel.

---

## Section 7 — TypeScript (L6)

### Concept

1. Explain the difference between `interface` and `type`. When would you use one over the other?
2. What is structural typing? Contrast with nominal typing.
3. What is a "literal type", and what does `as const` do?
4. Difference between `unknown` and `any`. When should you use which?
5. What does a generic constraint (`T extends ...`) buy you?

### Output prediction (TypeScript compile errors are the "output" here)

For each snippet, will it compile? If not, what's the error?

```ts
// 1
type User = { id: number; name: string };
const u: User = { id: 1, name: 'Aaron', extra: true };

// 2
function len(s: string | string[]) {
  return s.length;
}

// 3
function first<T>(arr: T[]): T {
  return arr[0];
}
const x = first([1, 2, 3]);   // type of x?
const y = first<string>([]);  // type of y? runtime value?

// 4
const obj = { a: 1, b: 2 } as const;
obj.a = 5;

// 5
type A = { kind: 'circle'; r: number } | { kind: 'square'; side: number };
function area(a: A) {
  if (a.kind === 'circle') return Math.PI * a.r * a.r;
  return a.side * a.side;
}
```

### Implement

1. Type a generic `pluck<T, K extends keyof T>(items: T[], key: K): T[K][]` — extract one field across an array.
2. Type a generic `partition<T>(items: T[], predicate: (x: T) => boolean): [T[], T[]]`.
3. Without using `any`, write a typed `compose` function that composes any number of unary functions: `compose(f, g, h)(x)` = `f(g(h(x)))`. (Hard — generics + variadic.)

---

## Section 8 — Browser & DOM (touched in L7-L8 context)

1. What's the difference between `localStorage`, `sessionStorage`, and cookies? When would you reach for each?
2. What is event bubbling? How does `event.stopPropagation()` differ from `event.preventDefault()`?
3. Explain CORS in plain English. What HTTP headers does the browser send/expect?
4. What's the difference between `XMLHttpRequest`, `fetch`, and `axios`? Do they handle errors the same way? (Hint: `fetch` doesn't reject on 4xx/5xx.)

---

## Self-assessment

After completing this file, write a `js-review-log.md` rating yourself on each section:

| Section | Confidence (1–5) | Topics to revisit |
|---------|------------------|-------------------|
| Types & Coercion | | |
| Scope & Hoisting | | |
| Closures | | |
| `this` & Prototype | | |
| Array Methods | | |
| Async / Event Loop | | |
| TypeScript | | |

Anything below 4 → re-read the relevant lecture slide and redo the failed questions a week later.
