import { VideoPlayerState } from "@/types/types";
import { Loader2, Play } from "lucide-react";

interface VideoPlayerProps {
  embedUrl: string;
  playerState: VideoPlayerState;
  onPlay: () => void;
  onLoad: () => void;
  onError: () => void;
}

export const VideoPlayer = ({
  embedUrl,
  playerState,
  onPlay,
  onLoad,
  onError,
}: VideoPlayerProps) => (
  <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden shadow-xl">
    {!playerState.isPlaying ? (
      <div className="absolute inset-0 flex items-center justify-center bg-black/90">
        <button
          onClick={onPlay}
          className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center group"
          aria-label="Play video"
        >
          <Play className="w-10 h-10 text-white transform transition-transform group-hover:scale-110" />
        </button>
      </div>
    ) : (
      <div className="absolute inset-0">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onLoad={onLoad}
          onError={onError}
        />

        {playerState.isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
            <Loader2 className="w-12 h-12 animate-spin text-white" />
          </div>
        )}
      </div>
    )}
  </div>
);
