# Todo List

> 🟡 **AI Comparison Exercise** — Complete Part A independently, then compare with AI.

## Part A: Independent Implementation (No AI)

Build a Todo List app using Function Components with Hooks.

![Todo List](./todo-list.gif)

### Requirements

- [ ] Add a new todo
- [ ] Mark a todo as completed / uncompleted
- [ ] Mark all todos as completed
- [ ] Clear all completed todos
- [ ] Display the number of active todos
- [ ] Use `useState` for state management
- [ ] Use `useEffect` to persist todos to `localStorage` (todos survive page refresh)

### Bonus: API Data Fetching

- [ ] On mount, fetch initial todos from `https://jsonplaceholder.typicode.com/todos?_limit=5`
- [ ] Show a loading state while fetching
- [ ] Handle fetch errors gracefully

## Part B: AI Comparison

Give the same requirements to AI and compare:

- How does the AI structure its components? (single file vs. multiple components)
- How does the AI handle the `useEffect` dependencies for localStorage?
- Does the AI implement the loading/error states differently?

Write your findings in `comparison.md`.

## Part C: Final Submission

Submit your improved version. Note what you changed and why.
