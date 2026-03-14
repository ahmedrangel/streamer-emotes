import { get7tvEmotes } from "./providers/7tv";
import { getBttvEmotes } from "./providers/bttv";
import { getFfzEmotes } from "./providers/ffz";
import { getTwitchEmotes } from "./providers/twitch";
import type { StreamerEmotesProviderResponse } from "./types";
import { getTwitchIdByLogin } from "./utils/helpers";

/**
 *
 * @param channelLogin
 * @param options.bttv Get emotes from BetterTTV if `true`. Defaults to `false`.
 * @param options.ffz Get emotes from FrankerFaceZ if `true`. Defaults to `false`.
 * @param options.sevenTV Get emotes from 7TV if `true`. Defaults to `false`.
 * @param options.twitch Get emotes from Twitch if `true`. Defaults to `false`.
 * @param options.globals Include global emotes in the response. Defaults to `true`.
 * @returns
 */
const getStreamerEmotes = async (channelLogin: string, options: {
  bttv?: boolean | StreamerEmotesProviderOptions;
  ffz?: boolean | StreamerEmotesProviderOptions;
  sevenTV?: boolean | StreamerEmotesProviderOptions;
  twitch?: boolean | StreamerEmotesProviderOptions;
}) => {
  if (!Object.keys(options).length) {
    throw new Error("At least one provider must be enabled");
  }

  const { bttv, ffz, sevenTV, twitch } = options;

  const data: {
    bttv?: StreamerEmotesProviderResponse;
    ffz?: StreamerEmotesProviderResponse;
    sevenTV?: StreamerEmotesProviderResponse;
    twitch?: StreamerEmotesProviderResponse;
  } = {};

  let bttvPromise, ffzPromise, sevenTvPromise, twitchPromise;

  if (bttv || ffz || sevenTV || twitch) {
    await getTwitchIdByLogin(channelLogin);
  }

  if (bttv) {
    const globals = typeof bttv === "boolean" ? true : bttv?.globals ?? true;
    bttvPromise = getBttvEmotes(channelLogin, { globals }).catch(() => null);
  }

  if (ffz) {
    const globals = typeof ffz === "boolean" ? true : ffz?.globals ?? true;
    ffzPromise = getFfzEmotes(channelLogin, { globals }).catch(() => null);
  }

  if (sevenTV) {
    const globals = typeof sevenTV === "boolean" ? true : sevenTV?.globals ?? true;
    sevenTvPromise = get7tvEmotes(channelLogin, { globals }).catch(() => null);
  }

  if (twitch) {
    const globals = typeof twitch === "boolean" ? true : twitch?.globals ?? true;
    twitchPromise = getTwitchEmotes(channelLogin, { globals }).catch(() => null);
  }

  const [bttvEmotes, ffzEmotes, sevenTvEmotes, twitchEmotes] = await Promise.all([bttvPromise, ffzPromise, sevenTvPromise, twitchPromise]);

  if (bttv && bttvEmotes) data.bttv = bttvEmotes;
  if (ffz && ffzEmotes) data.ffz = ffzEmotes;
  if (sevenTV && sevenTvEmotes) data.sevenTV = sevenTvEmotes;
  if (twitch && twitchEmotes) data.twitch = twitchEmotes;

  return data;
};

export { getStreamerEmotes };

interface StreamerEmotesProviderOptions {
  globals: boolean;
}