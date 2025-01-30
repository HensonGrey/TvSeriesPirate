"use client";
import { CustomPagination } from "@/components/CustomPagination";
import { MediaTypeSelector } from "@/components/MediaTypeSelector";
import { ResultsGrid } from "@/components/ResultsGrid";
import { SearchBar } from "@/components/SearchBar";
import { MediaType } from "@/types/search";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useSearch } from "../../../../hooks/useSearch";

export default function SearchPage() {
  const { query } = useParams();
  const decodedQuery = decodeURIComponent(query as string);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(decodedQuery);
  const [selectedOption, setSelectedOption] = useState<MediaType>("tv");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const {
    data,
    isLoading,
    error: fetchError,
  } = useSearch(decodedQuery, selectedOption, currentPage);

  const handleSearch = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery.length >= 3) {
      router.push(`/search/${encodeURIComponent(trimmedQuery)}`);
    } else {
      setError("Please enter at least 3 characters");
    }
  };

  const handleOptionChange = (value: MediaType) => {
    setSelectedOption(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (data && page >= 1 && page <= data.total_pages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-700 to-slate-600">
      <div className="pt-4 pb-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={(value) => {
                setSearchQuery(value);
                setError(null);
              }}
              onSearch={handleSearch}
              error={error}
            />
            <MediaTypeSelector
              value={selectedOption}
              onChange={handleOptionChange}
            />
          </div>
        </div>
      </div>

      {fetchError ? (
        <div className="text-center py-8">
          <p className="text-red-400 text-lg">{fetchError}</p>
        </div>
      ) : (
        <div className="px-2 pb-4">
          <div className="max-w-7xl mx-auto">
            <ResultsGrid
              isLoading={isLoading}
              results={data?.results || []}
              mediaType={selectedOption}
            />
          </div>
        </div>
      )}

      {data && data.total_pages > 1 && (
        <div className="pb-8 flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            totalPages={data.total_pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
