import API_KEY from "@/constants";
import { Movie } from "@/types/types";
import { useEffect, useState } from "react";

export const useMovieData = (id: string) => {
  const [movie, setMovie] = useState<Movie>();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch movie data");
        }

        const data = await response.json();

        setMovie(data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError(`"Failed to load show data. Please try again."`);
      }
    };
    fetchData();
  }, [id]);

  return { movie, error };
};
