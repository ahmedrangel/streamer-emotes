export interface StreamerEmotesProps<T> {
  animated: boolean;
  id: string;
  images: {
    url: string;
    version: string;
  }[];
  name: string;
  provider: T;
  zeroWidth?: boolean;
}

export interface StreamerEmotesProviderResponse<T> {
  channel: StreamerEmotesProps<T>[];
  global?: StreamerEmotesProps<T>[];
}
