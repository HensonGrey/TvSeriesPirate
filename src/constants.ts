import { ProviderProps } from "./types/types";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const providers: ProviderProps[] = [
  {
    index: 0,
    url: `https://www.2embed.stream/embed/`,
    button_title: "2embed.stream",
  },
  { index: 1, url: `https://vidsrc.net/embed`, button_title: "vidsrc.net" },
  { index: 2, url: `https://vidsrc.in/embed`, button_title: "vidsrc.in" },
  { index: 3, url: `https://vidsrc.pm/embed`, button_title: "vidsrc.pm" },
];
export { API_KEY, providers };
