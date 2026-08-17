# React Comprehensive Training

> 🔴 **AI policy — read carefully.** This is NOT "no AI at all" — but the line is sharp.
>
> **❌ Strictly forbidden — generate with AI:**
>   - Any React code: components, Hooks, Context, reducers, Redux slices, Router setup, tests
>   - State design, prop typing, effect logic, performance optimizations
>   - Architecture sketches and design discussion answers
>   - Anything that appears in the lectures (L12–L17)
>
> **✅ Allowed — AI may help with:**
>   - **Mock/seed data generation** — e.g., "give me a JSON array of 1000 fake users" for Challenge 1
>   - **Mock API server scaffolding** — `json-server`/MSW config, fake endpoint stubs (the *shape*, not the React code that consumes them)
>   - **CSS/styling boilerplate** — colors, layout, classnames (visual polish only)
>   - **One-off utilities unrelated to React** — e.g., a function that generates a UUID, formats a date
>
> If in doubt: would a senior engineer ask you to **explain** this code in an interview? If yes → write it yourself. If it's just data plumbing → AI is fine.
>
> Build everything React-related from memory. Real interviews don't let you Google `useEffect` syntax.

This file is **not** organized lecture-by-lecture. Each challenge tests multiple React skills at once — that's how real frontend work happens. Pick a challenge, give yourself a time budget, and build it.

## How to use

1. Pick a challenge that matches your time budget (each lists an estimated duration).
2. Build it in a fresh Vite + React project. Don't peek at past homework.
3. **Bootstrap data with AI if needed** (mock users, seed JSON, fake API endpoints) — but stop using AI the moment you start writing React.
4. After finishing (or hitting the time limit), self-grade against the **success criteria** at the end of each challenge.
5. The **Skill Coverage Matrix** at the bottom shows which challenges cover which topics — if you scored low on a topic in `react-review-log.md`, head to the matching challenge.

## Files in this folder

- `react-review.md` (this file) — comprehensive coding challenges
- `mock-interview-react.md` — timed 30-min mock interview format (🔴 zero AI, including mock data — interview conditions)
- `react-output-puzzles.md` (in this file, Section B) — output prediction & code review

---

# A. Coding Challenges

Each challenge has a **spec**, **stretch goals**, and **success criteria**. Don't move on until you can check most boxes.

---

## Challenge 1 — Searchable, Sortable, Paginated Data Table (~3 hours)

You're given an array of 1,000 users:

```js
const users = generateUsers(1000);
// each user: { id, name, email, role: 'admin' | 'user' | 'guest', createdAt: Date, isActive: boolean }
```

### Spec

- Render the users in a table with columns: Name, Email, Role, Created, Status.
- A **search box** filters by name or email (case-insensitive, "contains" match).
- Search input is **debounced** by 300ms (extract a `useDebounce` hook).
- Click a column header to **sort** by that column. Click again to reverse. Click a third time to clear the sort.
- **Pagination**: 25 rows per page. Show "Page X of Y" and Prev/Next buttons.
- Reflect search/sort/page in the **URL query string** (so refreshing or sharing preserves state). Use `useSearchParams`.
- Avoid re-filtering on every render — `useMemo` should only recompute when relevant inputs change.
- Each row component uses `React.memo` so unrelated state changes don't re-render rows.

### Stretch

- Add row selection (multi-select checkboxes), with a "select all" header checkbox.
- TypeScript: type the `User` interface, the column config, and the `<DataTable<T>>` so it could render any data shape.
- Bulk action: "Delete selected" with optimistic UI + undo toast.
- Write 3 RTL tests: rendering, searching, sorting.

### Success criteria

- [ ] Typing in search doesn't lag, even with 10,000 rows
- [ ] Sort handles all 5 column types (string, date, boolean) correctly
- [ ] Refreshing the page preserves search/sort/page
- [ ] React DevTools profiler: row components don't re-render on unrelated state changes
- [ ] Pagination is correct at the boundaries (last page may have <25 rows)

### What this trains

`useState` · `useEffect` · `useMemo` · `useCallback` · `React.memo` · custom Hooks · `useSearchParams` · controlled inputs · key prop · TypeScript generics

---

## Challenge 2 — Multi-Step Form Wizard (~2 hours)

Build a 3-step signup wizard:

- **Step 1**: Account info (email, password, confirm password)
- **Step 2**: Profile (name, birthdate, avatar URL)
- **Step 3**: Preferences (newsletter checkbox, role dropdown, notification frequency radio)
- **Step 4**: Review screen — shows all entered data, has "Submit" button

### Spec

- Each step has its own component but shares form state.
- Decide: where does shared state live? (`useState` lifted to parent? `useReducer`? Context? Redux?) Justify your choice in 2 sentences in a comment.
- Validation **per step**:
  - Email is well-formed
  - Password is 8+ chars, has 1 number
  - Confirm password matches
  - Birthdate is a valid date in the past
- Cannot proceed to next step if current step is invalid. Show field errors inline (next to each invalid input) on attempted "Next".
- "Back" button returns to the previous step **without losing entered data**.
- Auto-focus the first input of each step on entry (use `useRef`).
- Refreshing the page **preserves progress** (use `localStorage`, wrap in a `useLocalStorage` hook). Clear on successful submit.
- On final submit, simulate an API call (sleep 2s, then 50% chance of success/failure). Show loading and final state.

### Stretch

- Convert to TypeScript with a discriminated union for step state.
- Prevent navigating away mid-wizard without confirmation (`beforeunload` event).
- Make the wizard component reusable: a `<Wizard>` that takes `steps` as a prop array and renders the right one.

### Success criteria

- [ ] Validation only blocks "Next", not typing
- [ ] Back/forward preserves all entered values
- [ ] First input auto-focuses on each step
- [ ] Browser refresh mid-wizard restores state
- [ ] Submission flow shows loading, then success or error UI
- [ ] No prop drilling — state is accessed cleanly across step components

### What this trains

State architecture decisions · `useReducer` or Context · controlled forms · validation patterns · `useRef` for focus · `useEffect` for persistence · custom Hooks · loading/error states

---

## Challenge 3 — Real-Time Dashboard with Independent Panels (~2.5 hours)

Build a dashboard page with 3 panels that load independently:

- **Profile Panel** — fetches `/api/me` (mock with delay)
- **Notifications Panel** — fetches `/api/notifications`, polls every 10 seconds
- **Activity Feed** — fetches `/api/activity` once, paginated "Load more" at the bottom

### Spec

- Each panel has its own loading spinner, error state, and retry button.
- A failure in one panel must NOT break the others (Error Boundaries).
- Extract a generic `useFetch<T>(url, options?)` hook used by all three panels. Returns `{ data, loading, error, refetch }`.
- The polling panel must **clean up** its interval on unmount.
- The polling panel must **handle race conditions**: if a slow response arrives after a newer response, ignore it.
- Use `React.lazy` to code-split each panel — only load each panel's component when it becomes visible.
- Use `<Suspense fallback={...}>` properly.
- Prevent unnecessary re-renders: typing in an unrelated search box on the page must not re-render the dashboard panels.

### Stretch

- Add visibility-aware polling: pause polling when the browser tab is hidden (`document.visibilityState`).
- Add an `<ErrorBoundary>` that logs to a fake error reporter and renders a "Try again" UI.
- Refactor `useFetch` into a small library: support `enabled` flag, `select` transform, and `staleTime` cache.
- Compare your hand-rolled `useFetch` with TanStack Query — write 3 sentences on what TQ adds.

### Success criteria

- [ ] One panel failing doesn't affect the others
- [ ] Polling stops when component unmounts (verify with React DevTools Profiler / network tab)
- [ ] No race-condition bugs (use `AbortController` or an "ignore stale response" flag)
- [ ] Code splitting verified in network tab (lazy chunks load when needed)
- [ ] Error boundary catches a thrown render error in one panel only

### What this trains

`useEffect` cleanup · `useRef` for tracking stale requests · custom Hooks (`useFetch`) · Error Boundaries · `React.lazy` + `<Suspense>` · race condition handling · `AbortController`

---

## Challenge 4 — Authenticated SPA with Deep Linking (~3 hours)

Build a small app with:

- `/login` (public)
- `/dashboard` (protected)
- `/users` (protected, list with `?q=` search filter)
- `/users/:id` (protected, detail page nested under `/users`)
- `/users/:id/posts/:postId` (deeply nested)
- `*` (404)

### Spec

- A **Login form** that POSTs (mock) and gets back a fake JWT token.
- Token stored in **memory + sessionStorage** (decide which, justify in a comment).
- A `<ProtectedRoute>` component that redirects to `/login` if not authenticated.
- After login, redirect to the page the user originally tried to visit (use `location.state.from`).
- A `<UserMenu>` in the header showing the logged-in name and a Logout button.
- Logout clears auth and redirects to `/login`.
- Auth state lives in a **`useAuth` hook backed by Context** — no prop drilling.
- The user list page reads/writes the search query to `?q=...` via `useSearchParams`.
- Nested routes use `<Outlet>` for shared layout (e.g., user detail page shows user header + Outlet for posts).

### Stretch

- Mock JWT expiry: token "expires" after 60 seconds. On expiry, automatically redirect to login on the next protected request and preserve the current URL.
- Implement a `<RoleGuard role="admin">` wrapper for admin-only routes.
- TypeScript: type `User`, `AuthContextValue`, route params, `location.state`.
- Test: write an RTL + MSW test that asserts unauthenticated `/dashboard` redirects to `/login`.

### Success criteria

- [ ] Visiting `/dashboard` while logged out redirects to `/login`
- [ ] After login, you land back at `/dashboard` (not the home page)
- [ ] Deep-linking to `/users/3/posts/7` works directly (not just from navigation)
- [ ] Search query in the URL persists across refresh
- [ ] Logout clears state and prevents accessing protected pages

### What this trains

React Router (nested routes, `<Outlet>`, `useNavigate`, `useLocation`, `useParams`, `useSearchParams`) · Context API · custom Hooks · auth patterns · TypeScript types

---

## Challenge 5 — Todo App with Redux + Optimistic Updates (~2.5 hours)

Build a todo app backed by an API. Use Redux Toolkit.

### Spec

- Backend: use any mock (json-server, MSW, or your L10 backend).
- Endpoints: `GET /todos`, `POST /todos`, `PATCH /todos/:id`, `DELETE /todos/:id`.
- Use `createSlice` for the todos state.
- Use `createAsyncThunk` for `fetchTodos`, `addTodo`, `toggleTodo`, `removeTodo`.
- Implement **optimistic updates**: when the user clicks "complete", update the UI immediately. If the API call fails, roll back and show an error toast.
- Show a global "Saving..." indicator while any thunk is pending.
- The list re-renders only the changed row when toggling (verify with the Profiler).

### Stretch

- Re-implement the same app with `useReducer` + Context (no Redux). Compare in a 1-page write-up:
  - Lines of code
  - DevTools experience (action history)
  - When you'd choose each
- Add filter tabs: All / Active / Completed. Filter via URL query so refresh preserves it.
- Write 3 RTL tests: adding a todo, toggling, optimistic rollback on API failure.

### Success criteria

- [ ] Redux DevTools shows clean action names
- [ ] Optimistic update is visible immediately (no spinner for happy path)
- [ ] Failed API call rolls back the UI to the previous state
- [ ] No `state.todos.push(...)` — all updates are immutable (RTK uses Immer, but verify mental model)
- [ ] Profiler: toggling todo #3 doesn't re-render todo #1's row component

### What this trains

Redux Toolkit · `createAsyncThunk` · optimistic UI patterns · `useSelector`/`useDispatch` · selector design · immutability · React.memo on rows · `useReducer` + Context comparison

---

## Challenge 6 — Reusable Modal/Dialog with Focus Trap (~2 hours)

Build a `<Modal>` component good enough to ship in a real product.

### Spec

```jsx
<Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm">
  <p>Are you sure?</p>
  <button onClick={confirm}>Yes</button>
  <button onClick={() => setOpen(false)}>Cancel</button>
</Modal>
```

- Render through `<ReactDOM.createPortal>` so it's not bound to its parent's DOM hierarchy.
- ESC closes the modal.
- Click on the backdrop closes the modal. Click inside the dialog does NOT close it.
- **Focus trap**: when open, Tab cycles only between focusable elements inside the modal.
- On open, focus the first focusable element (or a configurable `initialFocus`).
- On close, return focus to the element that was focused before the modal opened.
- Lock body scroll while open.
- All cleanup runs on unmount or when `isOpen` flips to false.

### Stretch

- Animate enter/exit (CSS transitions or Framer Motion).
- Make the title and the dialog `aria-labelledby`/`aria-describedby` correct.
- Build a `<ConfirmDialog>` on top of `<Modal>` that returns a Promise (`await confirm("Delete?")`).
- Type the props in TypeScript including `children`.

### Success criteria

- [ ] Tab cannot escape the modal when open
- [ ] Closing returns focus to the trigger button
- [ ] ESC and backdrop both close the modal
- [ ] Body scroll is locked while open, restored on close
- [ ] No memory leaks: unmounting an open modal cleans up listeners
- [ ] Two modals stacked work correctly

### What this trains

`createPortal` · `useEffect` cleanup (listeners, body styles) · `useRef` for focus management · refs + DOM imperative APIs · accessibility · composition · TypeScript prop typing

---

## Challenge 7 — Generic, Reusable `<DataList<T>>` Component (~1.5 hours)

A polished generic component that any team in a company could drop in.

### Spec

```tsx
<DataList<User>
  items={users}
  keyExtractor={(u) => u.id}
  renderItem={(u) => <UserRow user={u} />}
  empty={<p>No users found</p>}
  loading={isLoading}
  error={error}
  onRetry={refetch}
/>
```

- Fully typed in TypeScript with generics — `renderItem` should know it gets a `User`.
- Handles four states: `loading`, `error` (with retry), `empty`, `data`.
- Uses `React.memo` on each item if `areEqual` is provided.
- Supports a `loadMore` callback (infinite scroll).
- Has zero CSS opinions — accepts a `className` and a `renderContainer` prop for custom wrappers.

### Stretch

- Add windowing/virtualization for 10,000+ items (you can use `react-window` here).
- Add keyboard navigation (Up/Down/Home/End/PageUp/PageDown).
- Write a Storybook-like demo file showing 5 variations.

### Success criteria

- [ ] `renderItem` is fully typed (no `any`)
- [ ] All four states render correctly with no console warnings
- [ ] Infinite scroll fires `loadMore` exactly once per scroll-bottom event (no duplicate fires)
- [ ] Component works with both primitive and complex item types

### What this trains

TypeScript generics in React · component API design · render props · `React.memo` with custom equality · Intersection Observer (for infinite scroll) · accessibility

---

# B. Output Prediction Puzzles

Time-box each: 60 seconds. Predict, then run.

```jsx
// 1. What renders? In what order do logs appear?
function App() {
  const [count, setCount] = useState(0);
  console.log('render', count);
  useEffect(() => {
    console.log('effect', count);
    return () => console.log('cleanup', count);
  }, [count]);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
// User clicks the button twice. Predict the full log sequence.
```

```jsx
// 2. What does count print after one click?
function App() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => {
      setCount(count + 1);
      setCount(count + 1);
      setCount((c) => c + 1);
    }}>{count}</button>
  );
}
```

```jsx
// 3. What does this log? Why?
function App() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setN(n + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <div>{n}</div>;
}
// (After 5 seconds, what is displayed?)
```

```jsx
// 4. Which child re-renders when Parent's `count` changes?
const Child = React.memo(({ user, onClick }) => {
  console.log('Child render');
  return <button onClick={onClick}>{user.name}</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const user = { name: 'Aaron' };
  const onClick = () => console.log('clicked');
  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Child user={user} onClick={onClick} />
    </>
  );
}
```

```jsx
// 5. The user types fast in the search box. Which results render — first response or last?
function Search({ query }) {
  const [results, setResults] = useState([]);
  useEffect(() => {
    fetch(`/api/search?q=${query}`)
      .then((r) => r.json())
      .then(setResults);
  }, [query]);
  return <ul>{results.map((r) => <li key={r.id}>{r.name}</li>)}</ul>;
}
```

```jsx
// 6. Will this throw an error? When does cleanup run?
function App() {
  const [show, setShow] = useState(true);
  return show ? <Child onUnmount={() => setShow(true)} /> : null;
}
function Child({ onUnmount }) {
  useEffect(() => {
    return onUnmount;
  }, []);
  return <button onClick={() => /* set show to false from somewhere */}>X</button>;
}
```

```jsx
// 7. After 3 seconds, what does the UI display, and what does the console show?
function App() {
  const [name, setName] = useState('initial');
  useEffect(() => {
    const t = setTimeout(() => {
      setName('updated');
      console.log('inside timeout: name =', name);
    }, 1000);
    return () => clearTimeout(t);
  }, []);
  return <div>{name}</div>;
}
```

---

# C. Code Review Gauntlet

A single component with **at least 6 distinct issues** spanning multiple topics. Find them all.

```jsx
import { useState, useEffect, useMemo } from 'react';

function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });

    fetch(`/api/products/${productId}/reviews`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data);
      });
  }, []);

  const totalStars = useMemo(() => {
    return reviews.reduce((sum, r) => sum + r.stars, 0);
  });

  const avgStars = totalStars / reviews.length;

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Avg rating: {avgStars.toFixed(1)}</p>
      <ul>
        {reviews.map((r, i) => (
          <li key={i}>
            <strong>{r.user}:</strong> {r.text}
            <button onClick={() => deleteReview(r.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function deleteReview(id) {
  await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
  // ...
}
```

> Find at least 6 issues. Hints: missing dependency, missing dependency array argument, race condition on prop change, missing error path, division by zero, key choice, dangling state-update-after-unmount, parent component never re-fetches when productId changes, deleteReview never updates UI, missing loading state for reviews.

After reviewing, write a corrected version. Compare line counts.

---

# D. Architecture & Design Discussion

For each, sketch on paper. No code — just diagrams and bullet points. 5 minutes per question.

1. **Auth + Session Refresh** — Where do you store the access token? What about the refresh token? How does a 401 from the API trigger a refresh-and-retry? Where in the component tree does this logic live?

2. **A page with 4 independent data sources** — Should they fetch in parallel? Each have its own spinner, or one big spinner? What if one fails? Hoist state to parent or fetch in each? Would TanStack Query change your answer?

3. **Real-time chat** — WebSocket lifecycle (connect/disconnect/reconnect). Where does the socket live (Context? singleton? hook?)? How do you do optimistic message sending? How do you reconcile when the server's "real" message arrives?

4. **A typeahead with 100,000 items on the server** — Client-side filter is too slow. How do you architect server-driven search? Cancellation on every keystroke. Caching previous queries. Showing stale results during a fresh fetch.

5. **A form with 50 fields** — Naive `useState(...)` × 50 will be a re-render nightmare. What's your strategy? Compare: single `useState` object, `useReducer`, react-hook-form, controlled vs uncontrolled.

6. **Code splitting strategy for a 200KB JS bundle** — Where do you split? By route? By feature? By component? What goes in the initial chunk? Show how you'd measure the impact.

7. **State that lives in 3 places** — A user's profile is needed in (a) the header `<UserMenu>`, (b) the `/profile` page, (c) the comment input on a post. Where does that data live? Who fetches? Who invalidates it after edit? Map out the data flow.

8. **A list of 10,000 rows that lags** — You profile with React DevTools. List 5 distinct optimizations in order of expected impact and explain when each is appropriate.

---

# Skill Coverage Matrix

Find the cell for "skill you scored low on" → see which challenges to do.

| Skill | Ch 1 Table | Ch 2 Wizard | Ch 3 Dashboard | Ch 4 Auth | Ch 5 Todo+Redux | Ch 6 Modal | Ch 7 DataList |
|-------|:---------:|:-----------:|:--------------:|:---------:|:---------------:|:----------:|:-------------:|
| `useState` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `useEffect` cleanup | ✅ | ✅ | ✅✅ | ✅ | ✅ | ✅✅ | ✅ |
| `useRef` (DOM) | | ✅ | | | | ✅✅ | |
| `useRef` (mutable) | | | ✅✅ | | | ✅ | |
| `useMemo`/`useCallback` | ✅✅ | | ✅ | | ✅ | | ✅ |
| `React.memo` | ✅ | | | | ✅ | | ✅ |
| Custom Hooks | ✅ | ✅ | ✅✅ | ✅ | | ✅ | |
| Composition / `children` | | | | | | ✅✅ | ✅✅ |
| Error Boundary | | | ✅✅ | | | | ✅ |
| Forms / controlled inputs | | ✅✅ | | ✅ | ✅ | | |
| React Router | ✅ | | | ✅✅ | ✅ | | |
| `useSearchParams` | ✅✅ | | | ✅ | ✅ | | |
| Protected Routes | | | | ✅✅ | | | |
| `useReducer` | | ✅ | | | ✅ | | |
| Context API | | ✅ | | ✅✅ | | | |
| Redux Toolkit | | | | | ✅✅ | | |
| `createAsyncThunk` | | | | | ✅✅ | | |
| Optimistic UI | | | | | ✅✅ | | |
| `React.lazy` + `<Suspense>` | | | ✅✅ | | | | |
| `createPortal` | | | | | | ✅✅ | |
| Race condition handling | | | ✅✅ | | | | |
| `AbortController` | | | ✅✅ | | | | |
| Accessibility (focus, ARIA) | | ✅ | | | | ✅✅ | ✅ |
| TypeScript generics | ✅ | ✅ | ✅ | ✅ | | ✅ | ✅✅ |
| Performance / Profiler | ✅✅ | | ✅ | | ✅ | | ✅ |
| Testing (RTL) | ✅ | | | ✅ | ✅ | | |
| `localStorage` persistence | | ✅✅ | | | | | |

(✅ = touched, ✅✅ = central focus)

---

# After completing challenges

Write `react-training-log.md`:

| Challenge | Time spent | % criteria met | Hardest part | Re-study |
|-----------|------------|----------------|--------------|----------|
| 1. Data Table | | | | |
| 2. Wizard | | | | |
| 3. Dashboard | | | | |
| 4. Auth SPA | | | | |
| 5. Todo+Redux | | | | |
| 6. Modal | | | | |
| 7. DataList<T> | | | | |

**Honesty rule**: a challenge is "complete" only if you can hand it to a teammate and they could read it without asking you questions. If they'd need to ask why something works, you didn't really complete it.
