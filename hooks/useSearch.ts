import { useState, useEffect } from "react";
import { API_KEY } from "@/constants";
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
        const url = new URL(`https://api.themoviedb.org/3/search/${mediaType}`);
        url.searchParams.append("query", query);
        url.searchParams.append("language", "en-US");
        url.searchParams.append("page", page.toString());

        const response = await fetch(url.toString(), {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        });

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
