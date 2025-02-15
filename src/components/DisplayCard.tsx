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

const DisplayCard: React.FC<CardProps> = ({
  image_path,
  title,
  id,
  media_type,
}) => {
  const dispatch = useDispatch();
  const favourites = useSelector((state: RootState) => state.favourites);

  const [navigationUrl, setNavigationUrl] = useState<string | null>(null);

  const isFavourite = favourites.includes(id);

  const toggleWatchList = async () => {
    if (isFavourite) {
      try {
        const response = await fetch("/api/watch-list", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) throw new Error("Failed executing the put request!");

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
          body: JSON.stringify({ id }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        dispatch(addFavourite(id));
      } catch (err) {
        console.error(err);
      }
  };

  useEffect(() => {
    const getNavigationUrl = () => {
      if (media_type === "movie") {
        setNavigationUrl(`/watching/movie/${id}?title=${title}`);
      } else {
        setNavigationUrl(
          `/watching/tv/${id}?title=${title}&season=1&episode=1`
        );
      }
    };

    getNavigationUrl();
  }, [id, media_type, title]);

  if (!navigationUrl) return <div>Loading...</div>; // Optionally, show a loading state

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
      <Link href={navigationUrl} className="block">
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
      </Link>
    </div>
  );
};

export default DisplayCard;
