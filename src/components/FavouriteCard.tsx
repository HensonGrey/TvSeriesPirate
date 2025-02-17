import React, { useState } from "react";
import DisplayCard from "./DisplayCard";
import { RootState } from "@/store/store";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { addFavourite, removeFavourite } from "@/store/WatchListSlice";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";

interface FavouriteCardProps {
  image_path: string | null;
  title: string;
  id: number;
  media_type: "movie" | "tv";
}

export const FavouriteCard = ({
  image_path,
  title,
  id,
  media_type,
}: FavouriteCardProps) => {
  const dispatch = useDispatch();
  const favourites = useSelector((state: RootState) => state.favourites);
  const isFavourite = favourites.some((show) => show.showId === id);

  const toggleWatchList = async () => {
    if (isFavourite) {
      try {
        const response = await fetch("/api/watch-list", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            showId: id,
            showType: media_type.toUpperCase(),
          }),
        });
        if (!response.ok)
          throw new Error("Failed executing the delete request!");

        dispatch(removeFavourite(id));
      } catch (error) {
        console.error(error);
      }
    } else
      try {
        const response = await fetch("/api/watch-list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            showId: id,
            showType: media_type.toUpperCase(),
            imagePath: image_path,
            showTitle: title,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        dispatch(
          addFavourite({
            showId: id,
            showType: media_type.toUpperCase(),
            imagePath: image_path,
            showTitle: title,
          })
        );
      } catch (err) {
        console.error(err);
      }
  };
  return (
    <div className="relative group">
      <Button
        variant="destructive"
        className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 bg-[rgba(255,0,0,0.5)] hover:bg-[rgba(255,0,0,0.7)] transition-opacity p-4"
        onClick={toggleWatchList}
      >
        <Heart
          className={`${isFavourite ? "text-black" : "text-white"} scale-110`}
          fill={"currentColor"}
        />
      </Button>
      <DisplayCard
        image_path={image_path}
        title={title}
        id={id}
        media_type={media_type}
      />
    </div>
  );
};
