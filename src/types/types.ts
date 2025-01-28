export type TMDBSearchResponse<T> = {
  page: number;
  results: T[];
  total_results: number;
  total_pages: number;
};

export type MovieResult = {
  id: number;
  media_type: "movie";
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
};

export type TVResult = {
  id: number;
  media_type: "tv";
  name: string;
  overview: string;
  first_air_date: string;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
};

export type CardProps = {
  image_path: string | null;
  title: string;
  id: number;
  media_type: "movie" | "tv";
};
