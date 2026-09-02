export const typeDefs = `#graphql
  type Movie {
    id: ID!
    title: String!
    releaseYear: Int!
    posterUrl: String!
    synopsis: String!
    genres: [String!]!
    director: String!
    runtimeMinutes: Int!
    reviews: [Review!]!
    reviewStats: ReviewStats!
  }

  type ReviewStats {
    count: Int!
    averageRating: Float!
  }

  type Review {
    id: ID!
    movieId: ID!
    reviewerName: String!
    rating: Int!
    body: String!
    createdAt: String!
  }

  type MovieEdge {
    cursor: String!
    node: Movie!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type MovieConnection {
    edges: [MovieEdge!]!
    pageInfo: PageInfo!
  }

  type Query {
    movies(first: Int = 6, after: String): MovieConnection!
    movie(id: ID!): Movie
  }

  type Mutation {
    createReview(movieId: ID!, reviewerName: String!, rating: Int!, body: String!): Review!
  }

  type Subscription {
    reviewAdded(movieId: ID!): Review!
  }
`;
