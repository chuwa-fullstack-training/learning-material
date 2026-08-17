# Todo List API

> 🟡 **AI Comparison Exercise** — This homework uses the Part A/B/C format.

## Part A: Independent Implementation (No AI)

Design and implement a RESTful API for a todo list app using Express.

### Requirements

- [ ] Use Express.js with proper MVC structure (separate routes, controllers, models)
- [ ] Use MongoDB (via Mongoose) to store the data
- [ ] Design your own Todo schema (at minimum: title, completed, createdAt)
- [ ] Implement full CRUD operations:
  - `GET /api/todos` — list all todos (support `?completed=true` filter)
  - `GET /api/todos/:id` — get a single todo
  - `POST /api/todos` — create a todo
  - `PUT /api/todos/:id` — update a todo
  - `DELETE /api/todos/:id` — delete a todo
- [ ] Include proper error handling (400 for bad input, 404 for not found)
- [ ] Use template engines to render a simple view (optional)

## Part B: AI Comparison

Give the same requirements to an AI tool and compare implementations:

- Does the AI's project structure match MVC? Or is everything in one file?
- How does the AI handle input validation compared to your implementation?
- Does the AI add features you didn't think of (pagination, sorting)?
- Are there any security concerns in the AI's code (e.g., missing input sanitization)?

Write your findings in `comparison.md`.

## Part C: Final Submission

Submit your improved version incorporating the best ideas from both implementations. Include a brief note on what you changed and why.
