# GitHub List with Router + Performance

> 🟢 Use AI freely — focus on understanding Protected Routes and when to optimize.

Refactor lecture 14 homework 1 (GitHub User List) to use React Router.

![screenshot](./hw1.gif)

## Requirements: Routing

- [ ] At least 3 routes: `/login`, `/users`, `/users/:login`
- [ ] Username and password are up to you
- [ ] `/users` and `/users/:login` should be **Protected Routes** — redirect to `/login` if not authenticated
- [ ] After login, redirect back to the originally requested page
- [ ] Use `useSearchParams` for a search/filter feature on the user list (e.g., `/users?q=mojombo`)

## Requirements: Performance

- [ ] Use `React.lazy` + `Suspense` to lazy-load the user detail page
- [ ] Use `React.memo` on the user list item component to prevent unnecessary re-renders
- [ ] (optional) Use `useMemo` or `useCallback` where appropriate and explain why
