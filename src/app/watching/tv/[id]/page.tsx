"use client";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, ChevronLeft, ChevronRight, Play } from "lucide-react";
import API_KEY from "@/constants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface VideoPlayerState {
  isLoading: boolean;
  error: string | null;
  isPlaying: boolean;
}

interface Season {
  season_number: number;
  episode_count: number;
  poster_path: string;
}

const TVShowPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = useParams();

  const title = searchParams.get("title");
  const season = parseInt(searchParams.get("season") || "1");
  const episode = parseInt(searchParams.get("episode") || "1");

  const [seasons, setSeasons] = useState<Season[]>([]);
  const [currentSeasonEpisodes, setCurrentSeasonEpisodes] = useState(1);

  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isLoading: false,
    error: null,
    isPlaying: false,
  });

  useEffect(() => {
    const fetchSeasonData = async () => {
      try {
        const url = `https://api.themoviedb.org/3/tv/${id}`;
        const response = await fetch(url, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch show data");
        }

        const data = await response.json();
        setSeasons(data.seasons || []);

        const currentSeason = seasons.find(
          (s: Season) => s.season_number === season
        );
        setCurrentSeasonEpisodes(currentSeason?.episode_count || 1);
      } catch (err) {
        console.error(err);
        setPlayerState((prev) => ({
          ...prev,
          error: "Failed to load show data. Please try again.",
        }));
      }
    };

    fetchSeasonData();
  }, [id, season]);

  useEffect(() => {
    setPlayerState({
      isLoading: false,
      error: null,
      isPlaying: false,
    });
  }, [season, episode, id]);

  const embedUrl = `https://www.2embed.stream/embed/tv/${id}/${season}/${episode}`;

  const handlePlayClick = () => {
    setPlayerState((prev) => ({
      ...prev,
      isLoading: true,
      isPlaying: true,
    }));
  };

  const navigateEpisode = (direction: "prev" | "next") => {
    const currentParams = new URLSearchParams(searchParams.toString());
    let newEpisode = episode;
    let newSeason = season;

    if (direction === "prev") {
      if (episode > 1) {
        newEpisode = episode - 1;
      } else if (season > 1) {
        newSeason = season - 1;
        const prevSeason = seasons.find((s) => s.season_number === newSeason);
        newEpisode = prevSeason?.episode_count || 1;
      }
    } else if (direction === "next") {
      if (episode < currentSeasonEpisodes) {
        newEpisode = episode + 1;
      } else if (season < seasons.length) {
        newSeason = season + 1;
        newEpisode = 1;
      }
    }

    if (newEpisode !== episode || newSeason !== season) {
      currentParams.set("episode", newEpisode.toString());
      currentParams.set("season", newSeason.toString());
      router.push(`${window.location.pathname}?${currentParams.toString()}`);
    }
  };

  const handleSeasonChange = (value: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("season", value);
    currentParams.set("episode", "1"); // Reset to first episode when changing seasons
    router.push(`${window.location.pathname}?${currentParams.toString()}`);
  };

  const handleIframeLoad = () => {
    setPlayerState((prev) => ({
      ...prev,
      isLoading: false,
    }));
  };

  const handleIframeError = () => {
    setPlayerState({
      isLoading: false,
      error: "Failed to load video. Please try again.",
      isPlaying: false,
    });
  };

  return (
    <div className="min-h-screen bg-slate-700 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between text-white mb-6">
          <h1 className="text-2xl font-semibold">
            {title} - Season {season} Episode {episode}
          </h1>

          <Select value={season.toString()} onValueChange={handleSeasonChange}>
            <SelectTrigger className="w-[140px] bg-slate-600/50 border-slate-500 text-white mt-4 md:mt-0">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 text-white border-slate-600">
              <SelectGroup>
                <SelectLabel>Seasons</SelectLabel>
                {seasons.map((season) => (
                  <SelectItem
                    key={season.season_number}
                    value={season.season_number.toString()}
                  >
                    Season {season.season_number}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {/* Video Player Section */}
          <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden shadow-xl">
            {!playerState.isPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/90">
                <button
                  onClick={handlePlayClick}
                  className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center group"
                  aria-label="Play video"
                >
                  <Play className="w-10 h-10 text-white transform transition-transform group-hover:scale-110" />
                </button>
              </div>
            ) : (
              <div className="absolute inset-0">
                {playerState.isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
                    <Loader2 className="w-12 h-12 animate-spin text-white" />
                  </div>
                )}

                <iframe
                  key={`${season}-${episode}`}
                  src={embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <button
                onClick={() => navigateEpisode("prev")}
                disabled={episode <= 1 && season <= 1}
                className={`
                  w-16 h-16 flex items-center justify-center
                  bg-slate-600/80 hover:bg-slate-500/80 transition-colors
                  ${
                    episode <= 1 && season <= 1
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                `}
                aria-label="Previous episode"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                onClick={() => navigateEpisode("next")}
                disabled={
                  episode >= currentSeasonEpisodes && season >= seasons.length
                }
                className={`
                  w-16 h-16 flex items-center justify-center 
                  bg-slate-600/80 hover:bg-slate-500/80 transition-colors
                  ${
                    episode >= currentSeasonEpisodes && season >= seasons.length
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                `}
                aria-label="Next episode"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Image Section */}
              <div className="lg:w-1/3">
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={
                      seasons.find((s) => s.season_number === season)
                        ?.poster_path
                        ? `https://image.tmdb.org/t/p/w500/${
                            seasons.find((s) => s.season_number === season)
                              ?.poster_path
                          }`
                        : `https://placehold.co/800x1200?text=NOT+FOUND`
                    }
                    alt={`${title} Season ${season}`}
                    className="w-full max-w-[250px] max-h-[350px] transition-all duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Episodes Grid Section */}
              <div className="lg:w-2/3">
                <h2 className="text-xl text-white font-semibold mb-4">
                  Episodes
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {Array.from({
                    length:
                      seasons.find((s) => s.season_number === season)
                        ?.episode_count || 0,
                  }).map((_, index) => (
                    <Button
                      key={index + 1}
                      variant={episode === index + 1 ? "default" : "secondary"}
                      className={`w-full h-10 ${
                        episode === index + 1
                          ? "bg-primary hover:bg-primary/90"
                          : "bg-slate-700 hover:bg-slate-600"
                      }`}
                      onClick={() => {
                        const currentParams = new URLSearchParams(
                          searchParams.toString()
                        );
                        currentParams.set("episode", (index + 1).toString());
                        router.push(
                          `${
                            window.location.pathname
                          }?${currentParams.toString()}`
                        );
                      }}
                    >
                      <span className="text-sm">EP {index + 1}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {playerState.error && (
            <div className="text-center text-red-400 bg-red-400/10 p-4 rounded-lg">
              <p>{playerState.error}</p>
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
