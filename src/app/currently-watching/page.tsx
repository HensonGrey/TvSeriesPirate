"use client";
import DisplayCard from "@/components/DisplayCard";
import { RootState } from "@/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CurrentlyWatching() {
  const dispatch = useDispatch();
  const currentlyWatching = useSelector(
    (state: RootState) => state.currentlyWatching
  );

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl text-white text-center">Browsing favourites</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 p-8">
        {currentlyWatching.map((cw) => (
          <DisplayCard
            key={cw.showId}
            image_path={cw.imagePath}
            title={cw.showTitle}
            id={cw.showId}
            media_type={
              cw.showType.toString().toLowerCase() === "tv" ? "tv" : "movie"
            }
          />
        ))}
      </div>
    </div>
  );
}
