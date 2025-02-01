import { useState, useEffect } from "react";
import { API_KEY } from "@/constants";
import { CardProps } from "@/types/types";
import Link from "next/link";
import React from "react";
import NextImageWithFallback from "./NextImageWithFallBack";

const DisplayCard: React.FC<CardProps> = ({
  image_path,
  title,
  id,
  media_type,
}) => {
  const [navigationUrl, setNavigationUrl] = useState<string | null>(null);

  useEffect(() => {
    const getNavigationUrl = async () => {
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
    <div className="w-full flex flex-col pb-[150%] relative overflow-hidden rounded-lg shadow-lg hover:cursor-auto">
      <Link href={navigationUrl}>
        <NextImageWithFallback
          src={
            image_path ? `https://image.tmdb.org/t/p/w500/${image_path}` : null
          }
          alt={`${title} Poster`}
          width={500}
          height={750}
          className="absolute inset-0 w-full h-full object-cover hover:opacity-75 transition-opacity"
          fallbackDimensions={{
            width: 800,
            height: 1200,
          }}
        />
        <h3 className="absolute bottom-0 left-0 right-0 bg-black/85 text-white text-sm text-center p-2 truncate">
          {title}
        </h3>
      </Link>
    </div>
  );
};

export default DisplayCard;
