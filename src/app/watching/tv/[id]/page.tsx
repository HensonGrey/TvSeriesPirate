"use client";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Season, VideoPlayerState } from "@/types/types";
import { EpisodeGrid } from "@/components/EpisodeGrid";
import { SeasonSelector } from "@/components/SeasonSelector";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useTVShowData } from "../../../../hooks/useTvData";
import Image from "next/image";
import WebsiteLogo from "@/../public/images/pirate.png";
import Link from "next/link";
import NextImageWithFallback from "@/components/NextImageWithFallBack";
import { providers } from "@/constants";
import { VideoProviderList } from "@/components/VideoProviderList";
import { useDispatch } from "react-redux";
import { updateCurrentlyWatching } from "@/store/currentlyWatchingSlice";

const TVShowPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = useParams();

  const title = searchParams.get("title");
  const season = parseInt(searchParams.get("season")!); //asserting that they are not null
  const episode = parseInt(searchParams.get("episode")!);

  const [provider_index, setProviderIndex] = useState<number>(0);

  const {
    seasons,
    currentSeasonEpisodes,
    overview,
    error: fetchError,
  } = useTVShowData(id as string, season, episode);

  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isLoading: false,
    error: null,
    isPlaying: false,
  });

  const updateRoute = (newSeason: number, newEpisode: number) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("season", newSeason.toString());
    currentParams.set("episode", newEpisode.toString());
    router.push(`${window.location.pathname}?${currentParams.toString()}`);
  };

  const handleSeasonChange = (value: string) => {
    updateRoute(parseInt(value), 1);
  };

  const handleEpisodeSelect = (newEpisode: number) => {
    updateRoute(season, newEpisode);
  };

  const handleProviderChange = (newIndex: number) => {
    setProviderIndex(newIndex);
  };

  //when user changes season or episode or first enters this page
  //this block of code will trigger
  //which will save season and episode numbers in the database
  //and in redux
  useEffect(() => {
    const saveShowData = async () => {
      try {
        const response = await fetch("/api/currently-watching/details/tv", {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            showId: id,
            showType: "TV",
            seasonNum: season,
            episodeNum: episode,
          }),
        });
        if (!response.ok) throw new Error("Error fetching user data!");
        if (id)
          dispatch(
            updateCurrentlyWatching({
              showId: parseInt(id.toString()),
              showType: "TV",
              seasonNum: season,
              episodeNum: episode,
            })
          );
      } catch (error) {
        console.error(error);
      }
    };
    saveShowData();
  }, [season, episode]);

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center gap-4 md:gap-6 text-white mb-6">
          <Link href="/">
            <Image
              src={WebsiteLogo}
              alt="website logo"
              className="w-20 h-18 hover:opacity-50"
            />
          </Link>
          <h1 className="text-2xl font-semibold">
            {title} - Season {season} Episode {episode}
          </h1>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <VideoPlayer
              embedUrl={`${providers[provider_index].url}/tv/${id}/${season}/${episode}`}
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
                  src={
                    seasons.find((s: Season) => s.season_number === season)
                      ?.poster_path
                      ? `https://image.tmdb.org/t/p/w500/${
                          seasons.find(
                            (s: Season) => s.season_number === season
                          )?.poster_path
                        }`
                      : `https://placehold.co/800x1200?text=NOT+FOUND`
                  }
                  alt={`${title} Season ${season}`}
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
                <SeasonSelector
                  seasons={seasons}
                  currentSeason={season}
                  onSeasonChange={handleSeasonChange}
                />

                {overview && (
                  <p className="text-slate-200 mt-4 border rounded-3xl p-8">
                    {overview}
                  </p>
                )}

                <EpisodeGrid
                  episodeCount={currentSeasonEpisodes}
                  currentEpisode={episode}
                  onEpisodeSelect={handleEpisodeSelect}
                />
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

export default TVShowPage;
