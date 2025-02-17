import React from "react";
import DisplayCard from "./DisplayCard";
import { Button } from "./ui/button";
import { Minus } from "lucide-react";
import { useDispatch } from "react-redux";
import { removeFromWatching } from "@/store/currentlyWatchingSlice";

interface WatchingCardProps {
  image_path: string | null;
  title: string;
  id: number;
  media_type: "movie" | "tv";
  seasonNum?: number;
  episodeNum?: number;
}

export const WatchingCard = ({
  image_path,
  title,
  id,
  media_type,
  seasonNum,
  episodeNum,
}: WatchingCardProps) => {
  const dispatch = useDispatch();

  const onRemove = async () => {
    try {
      const response = await fetch(`/api/currently-watching/details`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          showId: id,
          showType: media_type.toUpperCase(),
        }),
      });

      if (!response.ok) throw new Error("Failed executing the delete request!");
      dispatch(
        removeFromWatching({
          showId: id,
          showType: media_type,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col w-full">
      <div className="relative group">
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-2 z-20 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 transition-opacity p-2"
          onClick={() => onRemove()}
        >
          <Minus size={20} />
        </Button>
        <DisplayCard
          image_path={image_path}
          title={title}
          id={id}
          media_type={media_type}
        />
      </div>
      {seasonNum && episodeNum && (
        <div className="grid grid-cols-2 w-full">
          {" "}
          {/* Changed to grid */}
          <Button variant="secondary" className="rounded-r-none">
            S{seasonNum}
          </Button>
          <Button variant="secondary" className="rounded-l-none">
            E{episodeNum}
          </Button>
        </div>
      )}
    </div>
  );
};
