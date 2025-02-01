import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const NavigationControls = ({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: NavigationControlsProps) => (
  <>
    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`w-16 h-16 flex items-center justify-center bg-slate-600/80 hover:bg-slate-500/80 transition-colors pointer-events-auto ${
          !canGoPrevious ? "opacity-50 cursor-not-allowed" : ""
        }`}
        aria-label="Previous episode"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>
    </div>
    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={`w-16 h-16 flex items-center justify-center bg-slate-600/80 hover:bg-slate-500/80 transition-colors pointer-events-auto ${
          !canGoNext ? "opacity-50 cursor-not-allowed" : ""
        }`}
        aria-label="Next episode"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>
    </div>
  </>
);
