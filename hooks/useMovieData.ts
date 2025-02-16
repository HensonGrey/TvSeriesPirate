import { Movie } from "@/types/types";
import { useEffect, useState } from "react";

export const useMovieData = (id: string) => {
  const [movie, setMovie] = useState<Movie>();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/search/details?id=${encodeURIComponent(
            id
          )}&mediaType=${encodeURIComponent("movie")}`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
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
