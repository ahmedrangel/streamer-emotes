export interface StreamerEmotesProps {
  animated: boolean;
  id: string;
  images: {
    url: string;
    version: string;
  }[];
  name: string;
  provider: "7tv" | "bttv" | "ffz" | "twitch";
}

export interface StreamerEmotesProviderResponse {
  channel: StreamerEmotesProps[];
  global?: StreamerEmotesProps[];
}
