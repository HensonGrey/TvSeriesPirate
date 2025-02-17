import { useState, useEffect } from "react";
import {
  MediaType,
  TMDBSearchResponse,
  MovieResult,
  TVResult,
} from "@/types/search";

export const useSearch = (
  query: string,
  mediaType: MediaType,
  page: number
) => {
  const [data, setData] = useState<TMDBSearchResponse<
    MovieResult | TVResult
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/search?mediaType=${encodeURIComponent(
            mediaType
          )}&query=${encodeURIComponent(query)}&page=${page}`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        const sortedResults = responseData.results.sort(
          (a: MovieResult | TVResult, b: MovieResult | TVResult) =>
            b.vote_average - a.vote_average
        );

        setData({
          ...responseData,
          results: sortedResults,
        });
      } catch (err) {
        setError("Failed to fetch results. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchData();
    }
  }, [mediaType, page, query]);

  return { data, isLoading, error };
};
