import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Season } from "@/types/types";

interface SeasonSelectorProps {
  seasons: Season[];
  currentSeason: number;
  onSeasonChange: (value: string) => void;
}

export const SeasonSelector = ({
  seasons,
  currentSeason,
  onSeasonChange,
}: SeasonSelectorProps) => (
  <div className="flex-shrink-0">
    <Select value={currentSeason.toString()} onValueChange={onSeasonChange}>
      <SelectTrigger className="w-[180px] bg-slate-600/50 border-slate-500 text-white">
        <SelectValue placeholder="Select season" />
      </SelectTrigger>
      <SelectContent className="bg-slate-700 text-white border-slate-600">
        <SelectGroup>
          <SelectLabel className="text-slate-300">Seasons</SelectLabel>
          {seasons.map((season) => (
            <SelectItem
              key={season.season_number}
              value={season.season_number.toString()}
              className="hover:bg-slate-600/50"
            >
              Season {season.season_number}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
);
