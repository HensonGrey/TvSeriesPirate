"use client";
import Link from "next/link";
import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (query.trim() !== "" && query.length >= 3)
          router.push(`/search/${query}`);
        else alert("Search something goofus");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown); // Cleanup on unmount
  }, [query, router]);

  const handleSearch = (e: MouseEvent) => {
    e.preventDefault();
    if (e.button === 0 && query.trim() !== "" && query.length >= 3)
      router.push(`/search/${query}`);
    else alert("Search something goofus");
  };

  return (
    <div className="h-screen bg-slate-700 flex justify-center items-center">
      <div className="flex w-full max-w-sm relative">
        <input
          type="text"
          placeholder="Search in peace..."
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          className="border-4 rounded-md w-full p-2 bg-slate-200 pl-4"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 bg-neutral-500 p-4 rounded-md">
          <Link href={{ pathname: `/search/${query}` }}>
            <Search
              className="h-8 w-7 hover:text-gray-800 text-white"
              onClick={(e) => handleSearch(e as unknown as MouseEvent)}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
