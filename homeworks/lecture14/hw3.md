# Custom Hooks Practice

> 🟢 Build reusable hooks — AI can assist, but explain the abstraction logic.

## Requirements

Implement the following custom hooks and demonstrate each with a small component:

### 1. `useLocalStorage(key, initialValue)`

- [ ] Reads from and writes to `localStorage`
- [ ] Returns `[value, setValue]` like `useState`
- [ ] Demo: a theme toggle (light/dark) that persists across page refreshes

### 2. `useDebounce(value, delay)`

- [ ] Returns a debounced version of the input value
- [ ] Demo: a search input that only updates the displayed query after the user stops typing for 500ms

### 3. `useWindowSize()`

- [ ] Returns `{ width, height }` of the current browser window
- [ ] Updates on window resize (don't forget cleanup!)
- [ ] Demo: display "Mobile", "Tablet", or "Desktop" based on window width
