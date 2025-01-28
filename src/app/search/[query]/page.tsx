"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MovieResult, TMDBSearchResponse, TVResult } from "@/types/types"; // Ensure these types are defined
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
import Image from "next/image";
import API_KEY from "@/constants";
import DisplayCard from "@/components/DisplayCard";
import Pirate from "../../../../public/images/pirate.png";
import Link from "next/link";
import { Search } from "lucide-react";

export default function Page() {
  const { query } = useParams();
  const [data, setData] = useState<TMDBSearchResponse<
    MovieResult | TVResult
  > | null>(null); // Fix typing for data
  const [selectedOption, setSelectedOption] = useState<string>("tv");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
  };

  const handlePageChange = (page: number) => {
    if (data)
      if (page >= 1 && page <= data?.total_pages) {
        setCurrentPage(page);
      }
  };

  const getPageNumbers = () => {
    if (!data) return [];
    const totalPages = data.total_pages;
    const pages = [];
    const maxVisible = 5; // Max number of pages to show at a time

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      // Show ellipses if the current page is far from the first
      if (currentPage > 3) pages.push(<PaginationEllipsis key="start" />);

      // Show pages around the current page
      let start = Math.max(currentPage - 1, 2);
      let end = Math.min(currentPage + 1, totalPages - 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Show ellipses if the current page is far from the last
      if (currentPage < totalPages - 2)
        pages.push(<PaginationEllipsis key="end" />);

      // Show last page
      pages.push(totalPages);
    }

    return pages;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const url = `https://api.themoviedb.org/3/search/${selectedOption}?query=${query}&language=en-US&page=${currentPage}`;
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        };

        const response = await fetch(url, options);
        const data = await response.json();

        const sortedResults = data.results.sort(
          (a: MovieResult | TVResult, b: MovieResult | TVResult) =>
            b.vote_average - a.vote_average
        );

        setData({
          ...data,
          results: sortedResults,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedOption, currentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-600">
      {/* Compact welcome section */}
      <div className="pt-4 pb-6 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Logo and navigation */}
          <div className="flex justify-center mb-4 transform hover:scale-105 transition-transform">
            <Link href="/">
              <div className="relative group">
                <Image
                  src={Pirate}
                  alt="Pirate"
                  className="h-24 w-14 drop-shadow-lg"
                />
                <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          </div>

          {/* Search results header and media type selector in one row */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-700/50 rounded-full backdrop-blur-sm">
              <Search className="w-4 h-4 text-slate-300" />
              <h1 className="text-xl font-medium text-white">
                Results for{" "}
                <span className="text-sky-300 font-semibold">
                  &quot;{query}&quot;
                </span>
              </h1>
            </div>

            <Select
              defaultValue="tv"
              value={selectedOption}
              onValueChange={handleOptionChange}
            >
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

      {/* Results grid with loading state */}
      <div className="px-2 pb-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {[...Array(8)].map((_, i) => (
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
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {data?.results?.map((result: MovieResult | TVResult) => (
                <DisplayCard
                  key={result.id}
                  image_path={result.poster_path}
                  title={
                    result.media_type === "movie" ? result.title : result.name
                  }
                  id={result.id}
                  media_type={result.media_type}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
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
                  <PaginationItem key={index}>
                    <PaginationEllipsis className="text-white" />
                  </PaginationItem>
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
