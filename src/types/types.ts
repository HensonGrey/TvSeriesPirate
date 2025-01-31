export type CardProps = {
  image_path: string | null;
  title: string;
  id: number;
  media_type: "movie" | "tv";
};

export type VideoPlayerState = {
  isLoading: boolean;
  error: string | null;
  isPlaying: boolean;
};

export type Season = {
  season_number: number;
  episode_count: number;
  poster_path: string;
};

export type Movie = {
  overview: string;
  poster_path: string;
};
