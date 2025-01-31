"use client";
import Link from "next/link";
import Image from "next/image";
import WebsiteLogo from "@/../public/images/pirate.png";
import { useSearchParams, useParams } from "next/navigation";
import { useMovieData } from "../../../../../hooks/useMovieData";
import { VideoPlayerState } from "@/types/types";
import { useState, useEffect } from "react";
import { VideoPlayer } from "@/components/VideoPlayer";

const MovieScreen = () => {
  const searchParams = useSearchParams();
  const { id } = useParams();

  const embedUrl = `https://www.2embed.stream/embed/movie/${id}`;

  const { movie, error: fetchError } = useMovieData(id as string);
  const title = searchParams.get("title");

  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isLoading: false,
    error: null,
    isPlaying: false,
  });

  useEffect(() => {
    setPlayerState({
      isLoading: false,
      error: null,
      isPlaying: false,
    });
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-700 p-4">
      <div className="max-w-6xl mx-auto">
        {/* website logo */}
        <div className="flex flex-col items-center justify-center gap-4 md:gap-6 text-white mb-6">
          <Link href="/">
            <Image
              src={WebsiteLogo}
              alt="website logo"
              className="w-20 h-18 hover:opacity-50"
            />
          </Link>
          <h1 className="text-2xl font-semibold">{title}</h1>
        </div>

        {/* video section */}
        <div className="space-y-6">
          <div className="relative">
            <VideoPlayer
              embedUrl={embedUrl}
              playerState={playerState}
              onPlay={() =>
                setPlayerState((prev: VideoPlayerState) => ({
                  ...prev,
                  isLoading: true,
                  isPlaying: true,
                }))
              }
              onLoad={() =>
                setPlayerState((prev: VideoPlayerState) => ({
                  ...prev,
                  isLoading: false,
                }))
              }
              onError={() =>
                setPlayerState({
                  isLoading: false,
                  error: "Failed to load video. Please try again.",
                  isPlaying: false,
                })
              }
            />
          </div>
        </div>

        {/* movie poster and overview section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800 rounded-lg p-6 shadow-xl mt-4">
          <div className="flex justify-center items-start">
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie?.poster_path}`}
              alt={`${title} Poster`}
              className="max-w-full h-auto max-h-[400px] object-contain transition-all duration-300 hover:scale-105 rounded-2xl"
            />
          </div>
          <div className="flex flex-col justify-center items-center space-y-4 text-center">
            <h2 className="text-orange-300 text-3xl">Overview</h2>
            <p className="text-white max-w-prose">{movie?.overview}</p>
          </div>
        </div>

        {(playerState.error || fetchError) && (
          <div className="text-center text-red-400 bg-red-400/10 p-4 rounded-lg mt-6">
            <p>{playerState.error || fetchError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors text-white"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieScreen;
