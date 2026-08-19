import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './resolvers/index.js';
import { createContext } from './context.js';
import { reviewsWss } from './reviewsSocket.js';
import { streamSummary } from './summarySSE.js';

const PORT = process.env.PORT || 4002;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

async function startServer() {
  const app = express();
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Both WebSocket servers use noServer:true. Two { server, path }
  // WebSocketServers on one HTTP server clash over the 'upgrade' event, so
  // we own a single upgrade handler (below) that routes by pathname. That
  // routing is part of what graphql-ws normally hides from you.
  const graphqlWss = new WebSocketServer({ noServer: true });
  const serverCleanup = useServer({ schema, context: () => createContext() }, graphqlWss);

  httpServer.on('upgrade', (request, socket, head) => {
    const { pathname } = new URL(request.url, `http://${request.headers.host}`);
    if (pathname === '/graphql') {
      graphqlWss.handleUpgrade(request, socket, head, (ws) => {
        graphqlWss.emit('connection', ws, request);
      });
    } else if (pathname === '/ws/reviews') {
      reviewsWss.handleUpgrade(request, socket, head, (ws) => {
        reviewsWss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await apolloServer.start();

  // CORS applies to the whole app now (not just /graphql), because the SSE
  // endpoint below is a plain cross-origin GET from the browser at :5173.
  app.use(cors({ origin: CORS_ORIGIN }));

  // SSE endpoint (new in L20). Deliberately a plain GET outside GraphQL —
  // streaming token-by-token text is exactly what SSE is for, and it
  // doesn't fit GraphQL's request/response or subscription model well.
  app.get('/movies/:id/summary', streamSummary);

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(apolloServer, {
      context: async () => createContext(),
    }),
  );

  httpServer.listen(PORT, () => {
    console.log(`ReelTalk API ready at http://localhost:${PORT}/graphql`);
    console.log(`GraphQL subscriptions at ws://localhost:${PORT}/graphql`);
    console.log(`Raw review WebSocket at ws://localhost:${PORT}/ws/reviews?movieId=<id>`);
    console.log(`SSE summary at http://localhost:${PORT}/movies/<id>/summary`);
  });
}

startServer().catch((error) => {
  console.error('Error starting ReelTalk API:', error);
  process.exit(1);
});
