export interface StreamEmotesProps {
  animated: boolean;
  id: string;
  images: {
    url: string;
    version: string;
  }[];
  name: string;
  provider: "7tv" | "bttv" | "ffz" | "twitch";
}

export interface StreamEmotesProviderResponse {
  channel: StreamEmotesProps[];
  global?: StreamEmotesProps[];
}
