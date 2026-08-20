# Real-time: SSE + WebSocket

> 🟢 **Use AI freely — focus on choosing the right transport.** The classroom demo (ReelTalk) streams an "AI summary" over SSE and pushes live reviews over a raw WebSocket; **apply these to your own app, don't copy.** Submit an AI Usage Log.

Continue from your L18/L19 Todo Boards app. Add two real-time features — one over SSE, one over raw WebSocket — then reflect on when to use which.

## Part A — Server-Sent Events (streaming)

Add a feature where the server streams data **token by token / chunk by chunk** to the client. Ideas: a fake "AI daily summary" of a board's todos, or a long-running export/progress stream. (No real LLM — a template built from your own data is fine; the point is the transport.)

- [ ] Backend endpoint returning `text/event-stream`, writing `data: ...\n\n` messages over time
- [ ] Client consumes it with `EventSource`, rendering incrementally
- [ ] Send a named `done` event and `close()` on the client when complete
- [ ] Clean up on the server when the client disconnects (`req.on('close')`)
- [ ] In a comment, note the limitation of `EventSource` you ran into or would run into (hint: HTTP method)

## Part B — Raw WebSocket (live sync)

Add **live multi-tab sync** with a raw `ws` server (not a GraphQL subscription): a todo added/toggled in one tab appears in others viewing the same board.

- [ ] Raw WebSocket server; client connects with the **scope** (e.g. `boardId`) passed on the connection URL
- [ ] Server filters broadcasts by that scope (only clients on the same board get the message)
- [ ] Client parses each message and updates its UI/cache
- [ ] If you feed the message into an Apollo cache, remember to re-attach `__typename` — call out this gotcha in a comment

## Part C — Reflection

- [ ] In `transports.md`, for each of these needs, say which transport fits (**polling / SSE / WebSocket / GraphQL subscription**) and why:
  - streaming an AI-generated summary
  - live multi-tab todo sync
  - a once-a-minute "unread count" refresh
  - a two-player collaborative board edit
- [ ] If you did the L18 subscription bonus: what did graphql-ws do for you that you had to hand-write in Part B?

## AI Usage Log

Submit `ai-usage-log.md` covering the SSE feature, the WebSocket feature, and your transport-choice reasoning.
