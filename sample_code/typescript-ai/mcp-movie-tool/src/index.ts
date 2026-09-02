import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { movies } from './movies.js';

const server = new McpServer({ name: 'reeltalk-movie-tool', version: '1.0.0' });

// The INPUT contract: what an agent is allowed to ask for. This is the
// same idea as an Express route validating req.body, or a GraphQL
// resolver's typed args — except here the "caller" filling in these
// fields is an LLM, not a human typing into a form, which is exactly why
// the boundary needs to be enforced in code rather than assumed.
const RecommendMoviesInput = {
  genre: z.enum(['drama', 'sci-fi', 'comedy', 'horror', 'thriller']).describe('Genre to filter by'),
  minRating: z.number().min(0).max(5).default(0).describe('Minimum average rating, 0-5'),
  maxResults: z.number().int().min(1).max(10).default(3).describe('Max number of results to return'),
};

// The OUTPUT contract. Declaring it lets the SDK validate what THIS
// server sends back too — the same untrusted-until-checked posture
// applies to tool results, not just tool calls.
const RecommendMoviesOutput = {
  recommendations: z.array(
    z.object({
      title: z.string(),
      releaseYear: z.number(),
      director: z.string(),
      averageRating: z.number(),
    }),
  ),
};

server.registerTool(
  'recommend_movies',
  {
    title: 'Recommend Movies',
    description: 'Recommend ReelTalk movies filtered by genre and minimum rating.',
    inputSchema: RecommendMoviesInput,
    outputSchema: RecommendMoviesOutput,
  },
  // `genre`, `minRating`, `maxResults` arrive here already parsed and
  // validated against the input schema above — by the time this handler
  // runs, there is no "what if the model sent a string instead of a
  // number" branch to write. The SDK rejected that before this line ran.
  async ({ genre, minRating, maxResults }) => {
    const recommendations = movies
      .filter((m) => m.genre === genre && m.averageRating >= minRating)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, maxResults)
      .map(({ title, releaseYear, director, averageRating }) => ({
        title,
        releaseYear,
        director,
        averageRating,
      }));

    const structuredContent = { recommendations };
    return {
      content: [{ type: 'text', text: JSON.stringify(structuredContent, null, 2) }],
      structuredContent,
    };
  },
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('reeltalk-movie-tool MCP server running on stdio');
}

main().catch((error) => {
  console.error('MCP server error:', error);
  process.exit(1);
});
