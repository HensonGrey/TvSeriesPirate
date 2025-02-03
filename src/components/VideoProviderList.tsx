import React from "react";
import { Button } from "./ui/button";
import { ProviderProps } from "@/types/types";

interface VideoProviderListProps {
  providers: ProviderProps[];
  currentIndex: number;
  onProviderChange: (index: number) => void;
}

export const VideoProviderList = ({
  providers,
  currentIndex,
  onProviderChange,
}: VideoProviderListProps) => (
  <div className="flex flex-col sm:flex-row gap-2 w-full px-4 lg:w-2/3">
    {providers.map((provider) => (
      <Button
        key={provider.index}
        variant={currentIndex === provider.index ? "default" : "secondary"}
        className={`w-full min-w-0 h-12 px-4 border rounded-md font-medium transition-colors duration-200 ${
          currentIndex === provider.index
            ? "bg-blue-600 hover:bg-blue-700 shadow-md"
            : "bg-slate-700 hover:bg-slate-600 text-slate-400"
        }`}
        onClick={() => onProviderChange(provider.index)}
      >
        <span className="truncate">{provider.button_title}</span>
      </Button>
    ))}
  </div>
);
