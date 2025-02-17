import { useState, useEffect } from "react";
import { CardProps } from "@/types/types";
import Link from "next/link";
import React from "react";
import NextImageWithFallback from "./NextImageWithFallBack";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { addFavourite, removeFavourite } from "@/store/WatchListSlice";
import { useRouter } from "next/navigation";
import { addToWatching } from "@/store/currentlyWatchingSlice";

const DisplayCard: React.FC<CardProps> = ({
  image_path,
  title,
  id,
  media_type,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const favourites = useSelector((state: RootState) => state.favourites);
  const isFavourite = favourites.some((show) => show.showId === id);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handleClick = async () => {
    try {
      if (!id || !media_type || !title || !image_path) {
        console.error("missing props");
        return;
      }
      //dynamically set navigation url
      let navigationUrl;
      setIsLoading(true);

      if (media_type === "movie") {
        const response = await fetch(`/api/currently-watching/details/movie`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            showId: id,
            showType: media_type.toUpperCase(),
            showTitle: title,
            imagePath: image_path,
          }),
        });

        if (!response.ok)
          throw new Error("Error fetching user current tv progress");

        dispatch(
          addToWatching({
            showId: id,
            showTitle: title,
            showType: "MOVIE",
            imagePath: image_path,
          })
        );

        navigationUrl = `/watching/movie/${id}?title=${title}`;
      } else {
        const response = await fetch(
          `/api/currently-watching/details/tv?showId=${encodeURIComponent(
            id
          )}&showType=${encodeURIComponent(
            media_type.toUpperCase()
          )}&showTitle=${encodeURIComponent(
            title
          )}&imagePath=${encodeURIComponent(image_path)}`,
          {
            method: "GET",
          }
        );

        if (!response.ok)
          throw new Error("Error fetching user current tv progress");

        const { seasonNum, episodeNum } = await response.json();
        navigationUrl = `/watching/tv/${id}?title=${title}&season=${seasonNum}&episode=${episodeNum}`;
      }
      router.push(navigationUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
    );

  return (
    <div className="relative flex flex-col group">
      <Button
        variant="destructive"
        className="absolute w-full top-0 z-10 px-4 opacity-0 group-hover:opacity-100 bg-[rgba(255,0,0,0.5)] hover:bg-[rgba(255,0,0,0.7)] transition-opacity p-4 lg:pd-8"
        onClick={toggleWatchList}
      >
        <Heart
          className={`${isFavourite ? "text-black" : "text-white"} scale-110`}
          fill={"currentColor"}
        />
      </Button>
      <a className="block cursor-pointer" onClick={handleClick}>
        <NextImageWithFallback
          src={
            image_path ? `https://image.tmdb.org/t/p/w500/${image_path}` : null
          }
          alt={`${title} Poster`}
          width={500}
          height={750}
          className="w-full h-full object-cover hover:opacity-85 transition-opacity"
        />
        <h3 className="absolute bottom-0 left-0 right-0 bg-black/85 text-white text-sm text-center p-2 truncate">
          {title}
        </h3>
      </a>
    </div>
  );
};

export default DisplayCard;
