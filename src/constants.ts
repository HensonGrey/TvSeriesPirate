import { ProviderProps } from "./types/types";

const API_KEY = process.env.NEXT_API_KEY;
const providers: ProviderProps[] = [
  {
    index: 0,
    url: `https://www.2embed.stream/embed/`,
    button_title: "2embed.stream",
  },
  { index: 1, url: `https://vidsrcme.ru/embed`, button_title: "vidsrcme.ru" },
  { index: 2, url: `https://vidsrcme.su/embed`, button_title: "vidsrcme.su" },
  { index: 3, url: `https://vsrc.su/embed`, button_title: "vsrc.su" },
];
export { API_KEY, providers };
