# mcp-movie-tool — TypeScript in AI Development bonus lecture

A minimal, standalone [MCP](https://modelcontextprotocol.io) server exposing one tool, `recommend_movies`, built on `@modelcontextprotocol/sdk`. Independent of every other `sample_code/` project — its own tiny in-memory movie list, no shared code with ReelTalk.

The point of this project is narrow: show that an MCP tool's input **and** output are zod schemas, and that the SDK enforces both automatically — before an agent's tool call reaches your handler, and before your handler's result reaches the agent.

## Run it

```bash
cd sample_code/typescript-ai/mcp-movie-tool
npm install
npm run build
npm start
```

It speaks MCP over stdio, so running it directly just sits there waiting for a client. To actually poke at it:

```bash
npm run inspect
```

opens the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) in your browser, where you can call `recommend_movies` by hand and see both a valid call and a schema-violating one (e.g. an out-of-enum `genre`) get handled.

To wire it into Claude Desktop or Claude Code instead, point their MCP config at `node <path-to-this-dir>/dist/index.js` after `npm run build`.

## What this demonstrates

- **`src/index.ts`**: `registerTool()` takes an `inputSchema` (zod raw shape) and an `outputSchema`. The handler's parameters (`{ genre, minRating, maxResults }`) are already parsed and validated by the time your function body runs — there's no "what if the model sent the wrong type" branch to write, because the SDK never calls your handler if validation fails.
- Passing an invalid `genre` (outside the enum) returns `{ isError: true, ... }` with a zod-derived validation message — verified in this project's own manual testing by driving a real `@modelcontextprotocol/sdk` client against it.
- **`src/movies.ts`**: a small typed in-memory catalog, independent from ReelTalk's — kept intentionally minimal since the point of this example is the schema boundary, not the data.
