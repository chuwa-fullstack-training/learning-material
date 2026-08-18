const API_URL = process.env.REELTALK_API_URL || 'http://localhost:4002/graphql';

const MOVIE_QUERY = `
  query Movie($id: ID!) {
    movie(id: $id) {
      id
      title
      releaseYear
      posterUrl
      synopsis
      genres
      director
      runtimeMinutes
      reviewStats {
        count
        averageRating
      }
      reviews {
        id
        reviewerName
        rating
        body
        createdAt
      }
    }
  }
`;

const MOVIES_QUERY = `
  query Movies($first: Int) {
    movies(first: $first) {
      edges {
        node {
          id
          title
          releaseYear
        }
      }
    }
  }
`;

async function graphqlRequest(query, variables) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

// Plain fetch() to the GraphQL endpoint — no Apollo Client here. Apollo's
// server-side rendering support (getDataFromTree, etc.) is a real thing,
// but pulling it in would add a second layer of machinery on top of the
// SSR mechanism this lecture is actually about. One query, one response,
// passed straight into the render.
export async function fetchMovie(id) {
  const data = await graphqlRequest(MOVIE_QUERY, { id });
  return data.movie;
}

export async function fetchMovieTitles(first = 20) {
  const data = await graphqlRequest(MOVIES_QUERY, { first });
  return data.movies.edges.map((edge) => edge.node);
}
