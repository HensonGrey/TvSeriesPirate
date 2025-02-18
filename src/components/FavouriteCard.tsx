import React from "react";
import DisplayCard from "./DisplayCard";
import HeartComponent from "./HeartComponent";

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
  return (
    <div className="relative group">
      <HeartComponent
        id={id}
        media_type={media_type}
        image_path={image_path}
        title={title}
        className={
          "absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 bg-[rgba(255,0,0,0.5)] hover:bg-[rgba(255,0,0,0.7)] transition-opacity p-4"
        }
      />
      <DisplayCard
        image_path={image_path}
        title={title}
        id={id}
        media_type={media_type}
      />
    </div>
  );
};
