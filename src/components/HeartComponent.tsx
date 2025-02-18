import { Heart } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { RootState } from "@/store/store";
import { removeFavourite, addFavourite } from "@/store/WatchListSlice";
import { useDispatch, useSelector } from "react-redux";

interface HeartProps {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  className: string;
  image_path: string | null;
}

const HeartComponent = ({
  id,
  media_type,
  image_path,
  className,
  title,
}: HeartProps) => {
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
    <Button
      variant="destructive"
      className={className}
      onClick={toggleWatchList}
    >
      <Heart
        className={`${isFavourite ? "text-black" : "text-white"} scale-110`}
        fill={"currentColor"}
      />
    </Button>
  );
};

export default HeartComponent;
