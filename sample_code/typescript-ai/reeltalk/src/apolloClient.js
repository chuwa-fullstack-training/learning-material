import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

const API_URL = 'http://localhost:4003/graphql';
const WS_URL = 'ws://localhost:4003/graphql';

const httpLink = new HttpLink({ uri: API_URL });

const wsLink = new GraphQLWsLink(createClient({ url: WS_URL }));

// Route subscriptions over the WebSocket link, everything else over HTTP —
// same split-link pattern as graphql-demo/client/src/apolloClient.ts.
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          movies: {
            // Cursor pagination: a fresh query (no `after`) replaces the
            // page; fetchMore (`after` present) appends edges instead of
            // overwriting them.
            keyArgs: false,
            merge(existing, incoming, { args }) {
              if (!existing || !args?.after) return incoming;
              return {
                ...incoming,
                edges: [...existing.edges, ...incoming.edges],
              };
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'cache-and-network' },
  },
});
