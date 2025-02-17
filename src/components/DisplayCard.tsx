import { useState } from "react";
import { CardProps } from "@/types/types";
import React from "react";
import NextImageWithFallback from "./NextImageWithFallBack";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { addToWatching } from "@/store/currentlyWatchingSlice";
import { RootState } from "@/store/store";

const DisplayCard: React.FC<CardProps> = ({
  image_path,
  title,
  id,
  media_type,
}) => {
  const dispatch = useDispatch();
  const currentlyWatching = useSelector(
    (state: RootState) => state.currentlyWatching
  );
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

        if (
          !currentlyWatching.some(
            (show) =>
              show.showId == id && show.showType.toLowerCase() == media_type
          )
        )
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
        if (
          !currentlyWatching.some(
            (show) =>
              show.showId == id && show.showType.toLowerCase() == media_type
          )
        )
          dispatch(
            addToWatching({
              showId: id,
              showTitle: title,
              showType: "TV",
              imagePath: image_path,
              seasonNum,
              episodeNum,
            })
          );
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
