import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaType } from "../types/search";

interface MediaTypeSelectorProps {
  value: MediaType;
  onChange: (value: MediaType) => void;
}

export const MediaTypeSelector = ({
  value,
  onChange,
}: MediaTypeSelectorProps) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-[140px] bg-slate-700/50 border-slate-600 text-white">
      <SelectValue placeholder="Select type" />
    </SelectTrigger>
    <SelectContent className="bg-slate-700 text-white border-slate-600">
      <SelectItem value="tv">TV Shows</SelectItem>
      <SelectItem value="movie">Movies</SelectItem>
    </SelectContent>
  </Select>
);
