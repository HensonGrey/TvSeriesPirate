"use client";
import DisplayCard from "@/components/DisplayCard";
import { RootState } from "@/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Favourites() {
  const dispatch = useDispatch();
  const favourites = useSelector((state: RootState) => state.favourites);

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl text-white text-center">Browsing favourites</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 p-8">
        {favourites.map((fav) => (
          <DisplayCard
            key={fav.showId}
            image_path={fav.imagePath}
            title={fav.showTitle}
            id={fav.showId}
            media_type={
              fav.showType.toString().toLowerCase() === "tv" ? "tv" : "movie"
            }
          />
        ))}
      </div>
    </div>
  );
}
