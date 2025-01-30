import { Button } from "@/components/ui/button";

interface EpisodeGridProps {
  episodeCount: number;
  currentEpisode: number;
  onEpisodeSelect: (episode: number) => void;
}

export const EpisodeGrid = ({
  episodeCount,
  currentEpisode,
  onEpisodeSelect,
}: EpisodeGridProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
    {Array.from({ length: episodeCount }).map((_, index) => (
      <Button
        key={index + 1}
        variant={currentEpisode === index + 1 ? "default" : "secondary"}
        className={`w-full h-10 ${
          currentEpisode === index + 1
            ? "bg-primary hover:bg-primary/90"
            : "bg-slate-700 hover:bg-slate-600"
        }`}
        onClick={() => onEpisodeSelect(index + 1)}
      >
        <span className="text-sm">EP {index + 1}</span>
      </Button>
    ))}
  </div>
);
