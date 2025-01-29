import { CardProps } from "@/types/types";
import Link from "next/link";
import React from "react";

const DisplayCard: React.FC<CardProps> = ({
  image_path,
  title,
  id,
  media_type,
}) => {
  // Construct the proper navigation URL based on media type
  const getNavigationUrl = () => {
    if (media_type === "movie") {
      return `/watching/movie/${id}`;
    } else {
      return `/watching/tv/${id}?season=1&episode=1`;
    }
  };

  return (
    <div className="w-full flex flex-col pb-[150%] relative overflow-hidden rounded-lg shadow-lg hover:cursor-auto">
      <Link href={getNavigationUrl()}>
        <img
          src={
            image_path
              ? `https://image.tmdb.org/t/p/w500/${image_path}`
              : "https://placehold.co/800x800?text=NOT+FOUND"
          }
          alt={title}
          className="absolute inset-0 w-full h-full object-cover hover:opacity-75 transition-opacity"
        />
        <h3 className="absolute bottom-0 left-0 right-0 bg-black/85 text-white text-sm text-center p-2 truncate">
          {title}
        </h3>
      </Link>
    </div>
  );
};

export default DisplayCard;
