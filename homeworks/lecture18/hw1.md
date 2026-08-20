# Todo Boards with GraphQL

> 🟢 **Use AI freely — focus on understanding what each layer does.** The classroom demo (ReelTalk) shows these patterns on movies + reviews; **apply them to your own app, don't copy it.** Submit an AI Usage Log.

Rebuild your Todo app's data layer with **GraphQL** (Apollo Server + Apollo Client), replacing the REST backend from L17. To hit the interesting problems (pagination, N+1), grow the app one step: a **Board** has many **Todos**.

## Data model

- `Board { id, name, todos, todoStats }` where `todoStats { total, completed }`
- `Todo { id, boardId, title, completed, createdAt }`

## Requirements: Backend (Apollo Server)

- [ ] Define the schema: `Query`, `Mutation`, types above
- [ ] `Query.boards(first, after)` — **cursor-based pagination** (Relay-style `edges`/`node`/`pageInfo`)
- [ ] `Query.board(id)`
- [ ] `Mutation.createTodo`, `Mutation.toggleTodo`
- [ ] Resolvers use a shared `context`
- [ ] **Fix an N+1**: `Board.todoStats` naively queries per board. Reproduce the N+1 (log the query count), then solve it with **DataLoader** and show the count drop to one batched call. Keep a short note of the before/after counts.

## Requirements: Frontend (Apollo Client)

- [ ] `useQuery` + `fetchMore` for the paginated board list ("Load more")
- [ ] `useMutation` for create/toggle
- [ ] After a mutation, update the cache with **`cache.modify`** (NOT `refetchQueries`) so no extra network round-trip happens

## Bonus

- [ ] Add a `todoAdded(boardId)` **subscription** (graphql-ws) and show a todo appearing live across two browser tabs
- [ ] Note one thing about Apollo's cache that surprised you (e.g., how `__typename` / normalization works)

## AI Usage Log

Submit `ai-usage-log.md`:

| Step | Used AI? | What for | Your modifications/judgment |
|------|----------|----------|--------------------------|
| Schema design | | | |
| Resolvers | | | |
| N+1 / DataLoader | | | |
| Apollo Client + cache | | | |
| Subscription (if done) | | | |
