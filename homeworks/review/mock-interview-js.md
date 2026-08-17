# Mock Interview #1 — JavaScript (30 minutes)

> 🔴 **Strict rules:** No AI. No Stack Overflow. No googling. Editor only. Set a 30-minute timer.
> Speak your reasoning aloud — interviewers explicitly look for thought process, not just answers.

This is structured like a real phone screen for a JS-heavy frontend role. It has 3 parts:

| Part | Time | Format |
|------|------|--------|
| Concept Q&A | 8 min | Verbal answers |
| Live coding | 15 min | Editor, no docs |
| Code review | 7 min | Find bugs, explain |

When the timer rings, **stop**. Then write a retro (template at bottom).

---

## Part 1 — Concept Q&A (8 minutes)

Answer aloud (or in writing if practicing solo). Time-box each: ~90 seconds per question.

1. **Closures** — Define a closure in your own words. Why are they useful? Give one real-world example.

2. **`var` vs `let` vs `const`** — Three differences beyond "you can't reassign const". When would you intentionally choose `var`?

3. **Event Loop** — Walk through what happens when this code runs:
   ```js
   console.log('1');
   setTimeout(() => console.log('2'), 0);
   Promise.resolve().then(() => console.log('3'));
   console.log('4');
   ```

4. **`==` vs `===`** — Give an example where `==` returns true but `===` returns false. Why does that happen?

5. **`this`** — Explain what `this` refers to in:
   ```js
   const obj = {
     name: 'a',
     greet() { return this.name; },
     greetArrow: () => this.name,
   };
   obj.greet();
   obj.greetArrow();
   const fn = obj.greet;
   fn();
   ```

---

## Part 2 — Live Coding (15 minutes)

You have an editor. No tests provided — write your own as you go. Aim to finish in 15 minutes.

### Problem: Implement `debounce`

```js
/**
 * debounce(fn, delay)
 *
 * Returns a new function that, when called, delays invoking `fn`
 * until `delay` milliseconds have elapsed since the LAST time it was called.
 *
 * Example:
 *   const log = debounce(() => console.log('called'), 300);
 *   log(); log(); log();   // only one "called" prints, 300ms after the LAST call
 *
 * Bonus 1: support `fn` arguments — `debounce` should pass them through.
 * Bonus 2: support `this` — the wrapped fn should preserve the original `this`.
 * Bonus 3: add a `.cancel()` method that aborts a pending call.
 */
function debounce(fn, delay) {
  // your code here
}
```

**Process the interviewer expects:**
1. Clarify edge cases (what if delay is 0? what if called once?).
2. Write the simple version first.
3. Test it mentally with example calls.
4. Tackle bonuses in order.
5. Discuss tradeoffs (memory: closure holds `timer`; whether to use leading/trailing edge).

---

## Part 3 — Code Review (7 minutes)

Read the code. Identify **all** bugs, performance issues, or code smells. Explain each in 1–2 sentences.

```js
async function getUserStats(userIds) {
  const results = [];
  for (let i = 0; i <= userIds.length; i++) {
    const id = userIds[i];
    fetch('/api/users/' + id)
      .then(res => res.json())
      .then(data => {
        results.push({ id, posts: data.posts.length });
      });
  }
  return results;
}

async function main() {
  const ids = [1, 2, 3];
  const stats = await getUserStats(ids);
  console.log('user with most posts:', stats.sort((a, b) => a.posts - b.posts)[0]);
}
```

> Hint: there are at least 5 distinct issues. Look for off-by-ones, mixing async paradigms,
> race conditions, mutation, defensive coding gaps, and incorrect sort direction.

---

## After the timer

Write `mock-1-retro.md` answering:

1. **What did you finish?** What was incomplete?
2. **Which question stumped you?** What would you have needed to research?
3. **For each concept question**, did you give a clean 90-second answer or did you ramble?
4. **For the coding problem**, did you start with the simple case or jump to bonuses?
5. **For code review**, how many issues did you catch out of ~5? What did you miss?
6. **Action items** — which 2 lectures will you re-read this week?

---

## Reference: bugs in the code review section

(Don't read this until after your timer ends!)

<details>
<summary>Spoiler — expand only after attempting</summary>

1. **Off-by-one**: `i <= userIds.length` should be `i < userIds.length`.
2. **Async paradigm mix**: function is `async` but doesn't `await` the fetches — `results` is empty when returned.
3. **Race condition**: results may finish in any order, so `results[]` order doesn't match `userIds`.
4. **Sort direction**: `a.posts - b.posts` sorts ascending — `[0]` gives the user with the FEWEST posts.
5. **Defensive coding**: no error handling if fetch fails or `data.posts` is undefined.
6. **Mutation in async callback**: `results.push` is fine but order-dependent; `Promise.all` + `map` is cleaner and order-preserving.

A clean rewrite:
```js
async function getUserStats(userIds) {
  return Promise.all(
    userIds.map(async (id) => {
      const res = await fetch('/api/users/' + id);
      if (!res.ok) throw new Error(`Failed for ${id}`);
      const data = await res.json();
      return { id, posts: data.posts?.length ?? 0 };
    })
  );
}
async function main() {
  const stats = await getUserStats([1, 2, 3]);
  console.log('user with most posts:', stats.sort((a, b) => b.posts - a.posts)[0]);
}
```
</details>
