import { MediaType } from "@/types/search";
import DisplayCard from "./DisplayCard";
import { useEffect } from "react";

interface ResultsGridProps {
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  results: any[];
  mediaType: MediaType;
}

export const ResultsGrid = ({
  isLoading,
  results,
  mediaType,
}: ResultsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="w-full pb-[150%] relative bg-slate-700 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (!results?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-white text-lg">No results found for your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {results.map((result) => (
        <DisplayCard
          key={result.id}
          image_path={result.poster_path}
          title={mediaType === "movie" ? result.title : result.name}
          id={result.id}
          media_type={mediaType}
        />
      ))}
    </div>
  );
};
