import { $fetch } from "ofetch";
import type { StreamerEmotesProps, StreamerEmotesProviderResponse } from "../types";
import { getTwitchIdByLogin, providersURL } from "../utils/helpers";

const getBTTVEmoticonsURL = (id: string, version: string) => `https://cdn.betterttv.net/emote/${id}/${version}`;
const emoteVersions = ["1x", "2x", "3x"];

/**
 *
 * @param twitchLogin Twitch channel login.
 * @param {boolean} options.globals Include global Twitch emotes in the response. Defaults to `true`.
 * @returns
 */
export const getBttvEmotes = async (channelLogin: string, options?: { globals?: boolean }): Promise<StreamerEmotesProviderResponse<"bttv">> => {
  channelLogin = channelLogin.toLowerCase();
  const { globals = true } = options ?? {};

  const channelId = await getTwitchIdByLogin(channelLogin);

  const channel = [];
  const global = [];

  const channelDataPromise = $fetch<FfzChannelResponse>(`/cached/users/twitch/${channelId}`, {
    baseURL: providersURL.bttv
  }).catch(() => null);

  let globalDataPromise;

  if (globals) {
    globalDataPromise = $fetch<BttvEmotesResponse[]>("/cached/emotes/global", {
      baseURL: providersURL.bttv
    });
  }

  const [channelData, globalData] = await Promise.all([channelDataPromise, globalDataPromise]);

  if (channelData) channel.push(...channelData.channelEmotes, ...channelData.sharedEmotes);
  if (globalData) global.push(...globalData);

  const normalizeData = (data: BttvEmotesResponse[]): StreamerEmotesProps<"bttv">[] => {
    if (!data?.length) return [];

    return data.map(emote => ({
      animated: emote.animated,
      id: emote.id,
      images: emoteVersions.map(version => ({
        url: getBTTVEmoticonsURL(emote.id, version),
        version
      })),
      name: emote.code,
      provider: "bttv"
    }));
  };

  return {
    channel: normalizeData(channel),
    ...globals && { global: normalizeData(global) }
  };
};

interface BttvEmotesResponse {
  id: string;
  code: string;
  animated: boolean;
}

interface FfzChannelResponse {
  channelEmotes: BttvEmotesResponse[];
  sharedEmotes: BttvEmotesResponse[];
}