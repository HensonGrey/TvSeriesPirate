"use client";
import DisplayCard from "@/components/DisplayCard";
import { RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function page() {
  const dispatch = useDispatch();
  const favourites = useSelector((state: RootState) => state.favourites);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
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
  );
}
