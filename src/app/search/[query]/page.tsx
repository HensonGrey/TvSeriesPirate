"use client";
import React, { JSX, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MovieResult, TMDBSearchResponse, TVResult } from "@/types/types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import API_KEY from "@/constants";
import DisplayCard from "@/components/DisplayCard";
import { Search } from "lucide-react";

type MediaType = "tv" | "movie";

export default function SearchPage() {
  const { query } = useParams();
  const decodedQuery = decodeURIComponent(query as string);
  const router = useRouter();

  const [data, setData] = useState<TMDBSearchResponse<
    MovieResult | TVResult
  > | null>(null);
  const [searchQuery, setSearchQuery] = useState(decodedQuery);
  const [selectedOption, setSelectedOption] = useState<MediaType>("tv");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery.length >= 3) {
      router.push(`/search/${encodeURIComponent(trimmedQuery)}`);
    } else {
      setError("Please enter at least 3 characters");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const handleOptionChange = (value: MediaType) => {
    setSelectedOption(value);
    setCurrentPage(1); // Reset to first page when changing media type
  };

  const handlePageChange = (page: number) => {
    if (data && page >= 1 && page <= data.total_pages) {
      setCurrentPage(page);
      // Scroll to top smoothly when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    if (!data) return [];
    const totalPages = Math.min(data.total_pages, 500); // TMDB API limit
    const pages: (number | JSX.Element)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);
    if (currentPage > 3) pages.push(<PaginationEllipsis key="start" />);

    const start = Math.max(currentPage - 1, 2);
    const end = Math.min(currentPage + 1, totalPages - 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2)
      pages.push(<PaginationEllipsis key="end" />);
    pages.push(totalPages);

    return pages;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = new URL(
          `https://api.themoviedb.org/3/search/${selectedOption}`
        );
        url.searchParams.append("query", decodedQuery);
        url.searchParams.append("language", "en-US");
        url.searchParams.append("page", currentPage.toString());

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

    if (decodedQuery) {
      fetchData();
    }
  }, [selectedOption, currentPage, decodedQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-700 to-slate-600">
      <div className="pt-4 pb-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-700/50 rounded-full backdrop-blur-sm">
              <h1 className="text-xl font-medium text-white">
                Results for{" "}
                <div className="relative inline-block">
                  <input
                    type="text"
                    placeholder={decodedQuery}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setError(null);
                    }}
                    onKeyPress={handleKeyPress}
                    className="border-2 rounded-md bg-slate-500 pl-2 py-1 focus:outline-none focus:border-sky-500 transition-colors"
                    aria-label="Search query"
                  />
                  {error && (
                    <div className="absolute left-0 top-full mt-1 text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                </div>
              </h1>
              <button
                onClick={(e) => handleSearch(e as React.MouseEvent)}
                className="p-2 rounded-full hover:bg-slate-600 transition-colors"
                aria-label="Search"
              >
                <Search className="h-6 w-6 text-white" />
              </button>
            </div>

            <Select value={selectedOption} onValueChange={handleOptionChange}>
              <SelectTrigger className="w-[140px] bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 text-white border-slate-600">
                <SelectItem value="tv">TV Shows</SelectItem>
                <SelectItem value="movie">Movies</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {error ? (
        <div className="text-center py-8">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      ) : (
        <div className="px-2 pb-4">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="w-full pb-[150%] relative bg-slate-700 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : data?.results?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white text-lg">
                  No results found for your search.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {data?.results?.map((result) => (
                  <DisplayCard
                    key={result.id}
                    image_path={result.poster_path}
                    title={
                      selectedOption === "movie"
                        ? (result as MovieResult).title
                        : (result as TVResult).name
                    }
                    id={result.id}
                    media_type={selectedOption}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {data && data.total_pages > 1 && (
        <div className="pb-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`
                    ${
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-slate-700"
                    }
                    cursor-pointer text-white
                  `}
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) =>
                typeof page === "number" ? (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className={`
                        ${
                          currentPage === page
                            ? "bg-sky-500"
                            : "hover:bg-slate-700"
                        }
                        text-white
                      `}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ) : (
                  <PaginationItem key={index}>{page}</PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`
                    ${
                      currentPage === data?.total_pages
                        ? "pointer-events-none opacity-50"
                        : "hover:bg-slate-700"
                    }
                    cursor-pointer text-white
                  `}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
