// Shared domain types for the in-memory data layer. In L18–L20 this was
// plain JS with no compile-time shape guarantee; here every function that
// touches a Movie/Review is checked against these interfaces.
export interface Movie {
  id: string;
  title: string;
  releaseYear: number;
  genres: string[];
  director: string;
  runtimeMinutes: number;
  synopsis: string;
  posterUrl: string;
}

export interface Review {
  id: string;
  movieId: string;
  reviewerName: string;
  rating: number;
  body: string;
  createdAt: string;
}
