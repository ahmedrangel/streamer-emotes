import { $fetch } from "ofetch";
import type { StreamEmotesProps, StreamEmotesProviderResponse } from "../types";
import { getTwitchIdByLogin, providersURL } from "../utils/helpers";

/**
 *
 * @param twitchLogin Twitch channel login.
 * @param {boolean} options.globals Include global Twitch emotes in the response. Defaults to `true`.
 * @returns
 */
export const getFfzEmotes = async (channelLogin: string, options?: { globals?: boolean }): Promise<StreamEmotesProviderResponse> => {
  channelLogin = channelLogin.toLowerCase();
  const { globals = true } = options ?? {};

  const channelId = await getTwitchIdByLogin(channelLogin);

  const channel = [];
  const global = [];

  const channelDataPromise = $fetch<FfzRoomResponse>(`/room/id/${channelId}`, {
    baseURL: providersURL.ffz,
    method: "GET"
  });

  let globalDataPromise;

  if (globals) {
    globalDataPromise = $fetch<FfzGlobalResponse>("/set/global", {
      baseURL: providersURL.ffz,
      method: "GET"
    });
  }

  const [channelData, globalData] = await Promise.all([channelDataPromise, globalDataPromise]);

  channel.push(...channelData.sets[channelData.room.set].emoticons);
  if (globalData) global.push(...globalData.default_sets.flatMap(setId => globalData.sets[setId].emoticons));

  const normalizeData = (data: FfzEmotesResponse[]): StreamEmotesProps[] => {
    if (!data?.length) return [];

    return data.map((emote) => {
      const keys = Object.keys(emote.urls);
      const images = keys.map(key => ({
        url: emote.urls[key],
        version: key
      }));
      return {
        animated: false,
        id: emote.id,
        images,
        name: emote.name,
        provider: "ffz"
      };
    });
  };

  return {
    channel: normalizeData(channel),
    ...globals && { global: normalizeData(global) }
  };
};

interface FfzEmotesResponse {
  id: string;
  name: string;
  urls: Record<string, string>;
}

interface FfzRoomResponse {
  room: {
    set: number;
  };
  sets: Record<string, {
    emoticons: FfzEmotesResponse[];
  }>;
}

interface FfzGlobalResponse {
  default_sets: number[];
  sets: Record<string, {
    emoticons: FfzEmotesResponse[];
  }>;
}