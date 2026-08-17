# StreakUp Habit Tracker API — L17 backend

Standalone Express + Mongoose backend for App B's Lecture 17 stage (Fullstack Integration). Modeled on the same MVC layout and auth pattern as `sample_code/lecture11`, but kept as an independent project — no shared files — so it can evolve on its own.

See `前端贯穿式项目设计方案.md` at the repo root for the full multi-lecture design.

## Setup

```bash
cd sample_code/lecture17/habit-tracker-api
npm install
cp .env.example .env   # then fill in MONGODB_URI / JWT_SECRET
npm start
```

Requires a MongoDB instance (local or Atlas) — see `.env.example` for required vars, same shape as `sample_code/lecture9/.env.example`.

## API

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create an account, returns `{ token }` |
| POST | `/auth/login` | — | Returns `{ token }` |
| GET | `/api/habits` | ✅ | List the current user's habits, each with a `checkIns: string[]` field |
| POST | `/api/habits` | ✅ | Create a habit (`{ name, category }`) |
| DELETE | `/api/habits/:id` | ✅ | Delete a habit and its check-ins |
| POST | `/api/habits/:habitId/check-ins` | ✅ | Check in for today (idempotent), returns `{ checkIns: string[] }` |

Auth: `Authorization: Bearer <token>` header, same JWT pattern as L11.

## Design notes

- **Response shape matches the L15/L16 mock data on purpose**: `GET /api/habits` returns each habit with a `checkIns` array of date strings, exactly like `src/data/habits.js` in the frontend. This means the frontend's Redux slice and components don't change when switching from mock data to this real API in L17 — only the fetch call does. That's the point: a stable API contract is what lets frontend and backend evolve independently.
- **`register` uses bcrypt**, unlike L11's plaintext password comparison. L11 never demoed registration (it assumed a pre-seeded user), so this is new code — it defaults to the correct practice rather than repeating L11's teaching shortcut.
- **Check-ins are idempotent** and additionally enforced at the database level via a unique compound index on `(habit, date)` in `models/CheckIn.js` — checking in twice on the same day can't create duplicate records even under a race condition.
- **Cascade delete**: deleting a habit also deletes its check-ins (`controllers/habits.js`), avoiding orphaned records.
