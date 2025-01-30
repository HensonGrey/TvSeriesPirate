export type MediaType = "tv" | "movie";

interface BaseResult {
  id: number;
  poster_path: string;
  vote_average: number;
}

export interface MovieResult extends BaseResult {
  title: string;
}

export interface TVResult extends BaseResult {
  name: string;
}

export interface TMDBSearchResponse<T> {
  results: T[];
  total_pages: number;
}
