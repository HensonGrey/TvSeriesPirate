"use client";
import { Search } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validateSearch = (searchQuery: string): string | null => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery === "") {
      return "Please enter a search term";
    }
    if (trimmedQuery.length < 3) {
      return "Search term must be at least 3 characters";
    }
    return null;
  };

  const handleSearch = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const validationError = validateSearch(query);

    if (validationError) {
      setError(validationError);
      return;
    }

    router.push(`/search/${encodeURIComponent(query.trim())}`);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch(e as unknown as React.KeyboardEvent);
      }
    },
    [handleSearch]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="h-screen bg-slate-700 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-sm space-y-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search in peace..."
            onChange={(e) => {
              setQuery(e.target.value);
              setError(null); // Clear error when user types
            }}
            value={query}
            className={`
              border-4 rounded-md w-full p-2 bg-slate-200 pl-4 pr-16
              focus:outline-none focus:border-sky-500 transition-colors
              ${error ? "border-red-400" : "border-slate-300"}
            `}
            aria-label="Search query"
            aria-invalid={error ? "true" : "false"}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              onClick={(e) => handleSearch(e as React.MouseEvent)}
              className="h-full px-4 bg-neutral-500 rounded-r-md hover:bg-neutral-600 transition-colors"
              aria-label="Search"
            >
              <Search className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-400 text-sm px-2 animate-fade-in">
            {error}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
