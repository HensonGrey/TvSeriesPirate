import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.MouseEvent | React.KeyboardEvent) => void;
  error: string | null;
}

export const SearchBar = ({
  searchQuery,
  onSearchChange,
  onSearch,
  error,
}: SearchBarProps) => (
  <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-700/50 rounded-full backdrop-blur-sm">
    <h1 className="text-xl font-medium text-white">
      Results for{" "}
      <div className="relative inline-block">
        <input
          type="text"
          placeholder={searchQuery}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSearch(e)}
          className="border-2 rounded-md bg-slate-500 pl-2 py-1 focus:outline-none focus:border-sky-500 transition-colors"
          aria-label="Search query"
        />
        {error && (
          <div className="absolute left-0 top-full mt-1 text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>
    </h1>
    <button
      onClick={(e) => onSearch(e)}
      className="p-2 rounded-full hover:bg-slate-600 transition-colors"
      aria-label="Search"
    >
      <Search className="h-6 w-6 text-white" />
    </button>
  </div>
);
