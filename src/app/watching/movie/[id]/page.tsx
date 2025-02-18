"use client";
import { useSearchParams, useParams } from "next/navigation";
import { useMovieData } from "../../../../hooks/useMovieData";
import { VideoPlayerState } from "@/types/types";
import { useState, useEffect } from "react";
import { VideoPlayer } from "@/components/VideoPlayer";
import NextImageWithFallback from "@/components/NextImageWithFallBack";
import { providers } from "@/constants";
import { VideoProviderList } from "@/components/VideoProviderList";
import HeartComponent from "@/components/HeartComponent";

const MovieScreen = () => {
  const searchParams = useSearchParams();
  const { id } = useParams();
  const [provider_index, setProviderIndex] = useState<number>(0);

  const { movie, error: fetchError } = useMovieData(id as string);
  const title = searchParams.get("title");

  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isLoading: false,
    error: null,
    isPlaying: false,
  });

  const handleProviderChange = (newIndex: number) => {
    setProviderIndex(newIndex);
  };

  const getImagePath = (): string => {
    return movie?.poster_path
      ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
      : `https://placehold.co/800x1200?text=NOT+FOUND`;
  };

  useEffect(() => {
    setPlayerState({
      isLoading: false,
      error: null,
      isPlaying: false,
    });
  }, [id]);

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-4 md:gap-6 text-white mb-6">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <HeartComponent
            id={parseInt(id as string)}
            media_type={"tv"}
            title={title as string}
            className={""}
            image_path={getImagePath()}
          />
        </div>

        <div className="space-y-6">
          <div className="relative">
            <VideoPlayer
              embedUrl={`${providers[provider_index].url}/movie/${id}`}
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

          <div className="flex justify-center">
            <VideoProviderList
              providers={providers}
              currentIndex={provider_index}
              onProviderChange={handleProviderChange}
            />
          </div>

          <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 flex justify-center items-start">
                <NextImageWithFallback
                  src={getImagePath()}
                  alt={`${title} Poster`}
                  width={800}
                  height={1200}
                  className="max-w-full h-auto max-h-[400px] object-contain transition-all duration-300 hover:scale-105 rounded-2xl"
                  fallbackDimensions={{
                    width: 800,
                    height: 1200,
                  }}
                />
              </div>

              <div className="md:col-span-2 space-y-4">
                {movie?.overview && (
                  <p className="text-slate-200 mt-4 border rounded-3xl p-8">
                    {movie.overview}
                  </p>
                )}
              </div>
            </div>
          </div>

          {(playerState.error || fetchError) && (
            <div className="text-center text-red-400 bg-red-400/10 p-4 rounded-lg">
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
    </div>
  );
};

export default MovieScreen;
