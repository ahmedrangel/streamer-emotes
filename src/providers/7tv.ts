import { $fetch } from "ofetch";
import type { StreamerEmotesProps, StreamerEmotesProviderResponse } from "../types";
import { getTwitchIdByLogin, providersURL } from "../utils/helpers";

/**
 *
 * @param twitchLogin Twitch channel login.
 * @param {boolean} options.globals Include global Twitch emotes in the response. Defaults to `true`.
 * @returns
 */
export const get7tvEmotes = async (channelLogin: string, options?: { globals?: boolean }): Promise<StreamerEmotesProviderResponse<"7tv">> => {
  channelLogin = channelLogin.toLowerCase();
  const { globals = true } = options ?? {};

  const channelId = await getTwitchIdByLogin(channelLogin);

  const channel = [];
  const global = [];

  const channelDataPromise = $fetch<{ emote_set: { emotes: SevenTvEmotesResponse[] } }>(`/users/twitch/${channelId}`, {
    baseURL: providersURL.sevenTV,
    method: "GET"
  }).catch(() => null);

  let globalDataPromise;

  if (globals) {
    globalDataPromise = $fetch<{ emotes: SevenTvEmotesResponse[] }>("/emote-sets/global", {
      baseURL: providersURL.sevenTV,
      method: "GET"
    });
  }

  const [channelData, globalData] = await Promise.all([channelDataPromise, globalDataPromise]);

  if (channelData) channel.push(...channelData.emote_set.emotes);
  if (globalData) global.push(...globalData.emotes);

  const normalizeData = (data: SevenTvEmotesResponse[]): StreamerEmotesProps<"7tv">[] => {
    if (!data?.length) return [];

    return data.map((emote) => {
      const images = emote.data.host.files.map(file => ({
        url: `https:${emote.data.host.url}/${file.name}`,
        version: file.name
      }));
      return {
        animated: emote.data?.animated || false,
        id: emote.id,
        images,
        name: emote.name,
        provider: "7tv",
        zeroWidth: emote.flags === 1 && emote.data.flags === 256
      };
    });

  };

  return {
    channel: normalizeData(channel),
    ...globals && { global: normalizeData(global) }
  };
};

interface SevenTvEmotesResponse {
  id: string;
  name: string;
  flags: number;
  data: {
    animated: boolean;
    flags: number;
    host: {
      url: string;
      files: {
        name: string;
      }[];
    };
  };
}