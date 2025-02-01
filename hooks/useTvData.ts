import { useEffect, useState } from "react";
import { API_KEY } from "@/constants";
import { Season } from "@/types/types";

export const useTVShowData = (id: string, season: number, episode: number) => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [currentSeasonEpisodes, setCurrentSeasonEpisodes] = useState(1);
  const [overview, setOverview] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeasonData = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${id}`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch show data");
        }

        const data = await response.json();
        data.seasons = data.seasons?.filter(
          (s: Season) => s.season_number !== 0
        );
        setSeasons(data.seasons || []);

        const currentSeason = data.seasons?.find(
          (s: Season) => s.season_number === season
        );
        setCurrentSeasonEpisodes(currentSeason?.episode_count || 1);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load show data. Please try again.");
      }
    };

    const fetchEpisodeOverview = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/season/${season}/episode/${episode}`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch episode data");
        }

        const data = await response.json();
        setOverview(data.overview);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSeasonData();
    fetchEpisodeOverview();
  }, [id, season, episode]);

  return { seasons, currentSeasonEpisodes, overview, error };
};
