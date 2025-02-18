"use client";
import { WatchingCard } from "@/components/WatchingCard";
import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";

export default function CurrentlyWatching() {
  const currentlyWatching = useSelector(
    (state: RootState) => state.currentlyWatching
  );

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl text-white text-center">Currently watching:</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 p-8">
        {currentlyWatching.map((cw) => (
          <WatchingCard
            key={cw.showId}
            image_path={cw.imagePath}
            title={cw.showTitle}
            id={cw.showId}
            media_type={
              cw.showType.toString().toLowerCase() === "tv" ? "tv" : "movie"
            }
            seasonNum={cw.seasonNum ? cw.seasonNum : undefined}
            episodeNum={cw.episodeNum ? cw.episodeNum : undefined}
          />
        ))}
      </div>
    </div>
  );
}
