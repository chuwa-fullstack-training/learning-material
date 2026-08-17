# Mock Interview #2 — React (30 minutes)

> 🔴 **Strict rules:** No AI. No copy-paste. No googling. Editor only. 30-min timer.
> Speak your reasoning aloud. Interviewers care about your mental model, not just compiling code.

| Part | Time | Format |
|------|------|--------|
| Concept Q&A | 8 min | Verbal answers |
| Live coding | 15 min | Build a small component, no docs |
| Design discussion | 7 min | Architecture for a feature |

---

## Part 1 — Concept Q&A (8 minutes)

~90 seconds per question.

1. **Hooks rules** — Why must Hooks be called at the top level (not inside conditionals)? What does React rely on to make `useState` work?

2. **`useEffect` cleanup** — When does the cleanup function run? Give a real example where forgetting cleanup causes a bug.

3. **Reconciliation & keys** — Why does React need `key` on list items? What does it use the key for? Why is array index a bad default?

4. **State updates** — In this code, what's the count after one click? How would you fix it to get +3?
   ```jsx
   function App() {
     const [count, setCount] = useState(0);
     return <button onClick={() => {
       setCount(count + 1);
       setCount(count + 1);
       setCount(count + 1);
     }}>{count}</button>;
   }
   ```

5. **`useMemo` vs `useCallback`** — What's the difference, and why is reaching for them often premature optimization?

---

## Part 2 — Live Coding (15 minutes)

Build a `<TypeaheadSearch>` component. Mock data is provided.

### Spec

```
Behavior:
- An input box. As the user types, show matching results below.
- Filter must be case-insensitive and match anywhere in the name.
- Use debouncing — don't filter on every keystroke; wait 300ms after typing stops.
- Show "Loading..." during the debounce window.
- If no results, show "No matches".
- Up/Down arrow keys move a "highlighted" row. Enter selects it (call onSelect).
- Click on a row also selects it.
```

```jsx
const PEOPLE = [
  { id: 1, name: 'Aaron' },
  { id: 2, name: 'Brenda' },
  { id: 3, name: 'Carlos' },
  { id: 4, name: 'Daniela' },
  { id: 5, name: 'Eli' },
  // ...imagine 1000 of these
];

function TypeaheadSearch({ onSelect }) {
  // your code here
}
```

**Process the interviewer expects:**
1. Sketch the state shape (`query`, `debouncedQuery`, `highlightedIndex`).
2. Identify reusable logic — debouncing should probably be a custom hook (`useDebounce`).
3. Wire keyboard handling (`onKeyDown` on the input).
4. Talk about performance — would `React.memo` on rows help? When?
5. Don't worry about styling. Talk through accessibility (`role="listbox"`, `aria-activedescendant`) even if you don't implement it all.

**Stretch (only if you finish early):**
- Make the result list scrollable with the highlighted item kept in view.
- Type the component in TypeScript.
- Write one RTL test for "typing 'aar' shows Aaron".

---

## Part 3 — Design Discussion (7 minutes)

No coding. Just talk through your architecture for ~3 minutes per question.

### Question A — Auth flow for a SPA

You're building a React app with a backend that issues JWT tokens. Walk me through:

- Where do you store the access token? (localStorage / sessionStorage / memory / cookie?) Tradeoffs.
- How do protected routes work?
- What happens when a token expires mid-session?
- Where in the component tree does auth state live? Context? Redux? Local?
- After login, how do you redirect the user back to the page they originally tried to visit?

### Question B — A page with three independent data sections

Imagine a dashboard with three panels:
1. User profile (loads from `/api/me`)
2. Notifications (loads from `/api/notifications`)
3. Recent activity (loads from `/api/activity`)

Design considerations:
- Should they fetch in parallel or sequentially? Why?
- Should they each show their own loading spinner, or wait for all three?
- What if one fetch fails? Should the whole page break, or just that panel?
- Where would you put the fetching logic — in each panel, or hoisted to a parent?
- Would you reach for any libraries (TanStack Query, RTK Query)? Why or why not?

---

## After the timer

Write `mock-2-retro.md` answering:

1. Did you finish the typeahead spec? What was missing?
2. Which spec items did you forget? (debounce? keyboard nav? "No matches"? a11y?)
3. For each concept question, was your answer crisp or did you ramble?
4. Design questions — did you cover all the tradeoffs, or did you go deep on one and ignore others?
5. Which 2 lectures will you re-read?
6. **Honest self-rating (1–5)** for each:
   - Hooks fluency
   - State management mental model
   - Component design
   - Performance awareness
   - Architectural thinking

---

## Reference: a clean reference solution

(Don't peek until your timer ends.)

<details>
<summary>Spoiler — expand only after attempting</summary>

```jsx
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function TypeaheadSearch({ onSelect, items = PEOPLE }) {
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(0);
  const debouncedQuery = useDebounce(query, 300);
  const isWaiting = query !== debouncedQuery;

  const matches = useMemo(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();
    return items.filter((p) => p.name.toLowerCase().includes(q));
  }, [debouncedQuery, items]);

  // Reset highlight when results change
  useEffect(() => { setHighlighted(0); }, [matches]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') setHighlighted((h) => Math.min(h + 1, matches.length - 1));
    else if (e.key === 'ArrowUp') setHighlighted((h) => Math.max(h - 1, 0));
    else if (e.key === 'Enter' && matches[highlighted]) onSelect(matches[highlighted]);
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        aria-label="Search people"
      />
      {isWaiting && <div>Loading...</div>}
      {!isWaiting && debouncedQuery && matches.length === 0 && <div>No matches</div>}
      <ul role="listbox">
        {matches.map((m, i) => (
          <li
            key={m.id}
            role="option"
            aria-selected={i === highlighted}
            style={{ background: i === highlighted ? '#eee' : 'transparent' }}
            onClick={() => onSelect(m)}
          >
            {m.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

Things a strong candidate notices:
- `useDebounce` is reusable — extracted, not inlined.
- `useMemo` for filtering is justified because `items` is large.
- `aria-*` attributes for screen readers.
- Highlight resets when results change (otherwise it points off the end).
- `onSelect` is called via prop, not internal — component is reusable.
</details>
