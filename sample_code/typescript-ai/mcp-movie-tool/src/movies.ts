// A small, self-contained slice of the ReelTalk catalog — this package
// intentionally does NOT import from sample_code/typescript-ai/reeltalk-api
// (each sample_code project stays independently runnable per CLAUDE.md).
export interface Movie {
  id: string;
  title: string;
  releaseYear: number;
  genre: 'drama' | 'sci-fi' | 'comedy' | 'horror' | 'thriller';
  director: string;
  averageRating: number;
}

export const movies: Movie[] = [
  { id: 'm1', title: 'The Last Ember', releaseYear: 2019, genre: 'drama', director: 'Helena Vance', averageRating: 4.7 },
  { id: 'm2', title: 'Signal Drift', releaseYear: 2021, genre: 'sci-fi', director: 'Kenji Osato', averageRating: 3.5 },
  { id: 'm6', title: 'Static Bloom', releaseYear: 2023, genre: 'horror', director: 'Priya Ramaswamy', averageRating: 5.0 },
  { id: 'm7', title: 'Low Tide Diner', releaseYear: 2017, genre: 'comedy', director: 'Wesley Crane', averageRating: 4.0 },
  { id: 'm9', title: 'The Understudy', releaseYear: 2021, genre: 'thriller', director: 'Sofia Marchetti', averageRating: 5.0 },
  { id: 'm10', title: 'Ironroot', releaseYear: 2019, genre: 'sci-fi', director: 'Kenji Osato', averageRating: 3.0 },
  { id: 'm13', title: 'Harvest Moon Protocol', releaseYear: 2020, genre: 'sci-fi', director: 'Ingrid Solheim', averageRating: 5.0 },
];
