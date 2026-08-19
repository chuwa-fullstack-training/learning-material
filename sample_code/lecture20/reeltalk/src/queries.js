import { gql } from '@apollo/client';

export const MOVIES_QUERY = gql`
  query Movies($first: Int, $after: String) {
    movies(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          title
          releaseYear
          posterUrl
          genres
          reviewStats {
            count
            averageRating
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const MOVIE_QUERY = gql`
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
        movieId
        reviewerName
        rating
        body
        createdAt
      }
    }
  }
`;

export const CREATE_REVIEW_MUTATION = gql`
  mutation CreateReview($movieId: ID!, $reviewerName: String!, $rating: Int!, $body: String!) {
    createReview(movieId: $movieId, reviewerName: $reviewerName, rating: $rating, body: $body) {
      id
      movieId
      reviewerName
      rating
      body
      createdAt
    }
  }
`;

// Kept from L18/L19 for reference, but the L20 app no longer uses it —
// the "new reviews arrive live" feature was reimplemented over a raw
// WebSocket (see hooks/useReviewSocket.js). The backend still supports
// this subscription, so you can still exercise it from Apollo Sandbox to
// compare against the raw-WS version.
export const REVIEW_ADDED_SUBSCRIPTION = gql`
  subscription ReviewAdded($movieId: ID!) {
    reviewAdded(movieId: $movieId) {
      id
      movieId
      reviewerName
      rating
      body
      createdAt
    }
  }
`;
