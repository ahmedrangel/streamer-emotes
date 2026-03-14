import { $fetch } from "ofetch";
import { type GqlPayloadOptions, gqlQuery } from "gql-payload";
import type { StreamerEmotesProps, StreamerEmotesProviderResponse } from "../types";
import { getTwitchIdByLogin, providersURL } from "../utils/helpers";

/**
 *
 * @param twitchLogin Twitch channel login.
 * @param {boolean} options.globals Include global Twitch emotes in the response. Defaults to `true`.
 * @returns
 */
export const getTwitchEmotes = async (channelLogin: string, options?: { globals?: boolean }): Promise<StreamerEmotesProviderResponse<"twitch">> => {
  channelLogin = channelLogin.toLowerCase();
  const { globals = true } = options ?? {};

  const channelId = await getTwitchIdByLogin(channelLogin);

  const emotesFields = ["id", "token", "assetType"];

  const globalQuery: GqlPayloadOptions = {
    operation: "emoteSet",
    variables: {
      id: { value: "0", type: "ID!" }
    },
    fields: [
      { emotes: emotesFields }
    ]
  };

  const channelQuery: GqlPayloadOptions = {
    operation: "subscriptionProduct",
    variables: {
      productName: { value: channelLogin, type: "String!" }
    },
    fields: [
      { emotes: emotesFields }
    ]
  };

  const localEmotesQuery: GqlPayloadOptions = {
    operation: "channel",
    variables: {
      channelId: { name: "id", value: channelId, type: "ID!" }
    },
    fields: [
      { localEmoteSets: [{ emotes: emotesFields }] }
    ]
  };

  const toQuery: GqlPayloadOptions[] = [];

  if (globals) toQuery.push(globalQuery);

  toQuery.push(channelQuery);
  toQuery.push(localEmotesQuery);

  const { data } = await $fetch<TwitchGqlResponse>(providersURL.twitch, {
    method: "POST",
    headers: {
      "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko",
      "Content-Type": "application/json"
    },
    body: gqlQuery(toQuery)
  });

  const normalizeData = (data: TwitchGqlResponseEmotes[]): StreamerEmotesProps<"twitch">[] => {
    if (!data?.length) return [];

    return data.map(emote => ({
      animated: emote.assetType === "ANIMATED",
      id: emote.id,
      images: [
        {
          url: `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/1.0`,
          version: "1.0"
        },
        {
          url: `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/2.0`,
          version: "2.0"
        },
        {
          url: `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/3.0`,
          version: "3.0"
        }
      ],
      name: emote.token,
      provider: "twitch"
    }));
  };

  return {
    channel: [
      ...normalizeData(data?.channel.localEmoteSets?.[0]?.emotes),
      ...normalizeData(data?.subscriptionProduct?.emotes)
    ],
    ...globals && { global: normalizeData(data?.emoteSet?.emotes) }
  };
};

interface TwitchGqlResponseEmotes {
  id: string;
  token: string;
  assetType: string;
}

interface TwitchGqlResponse {
  data: {
    subscriptionProduct: {
      emotes: TwitchGqlResponseEmotes[];
    };
    emoteSet: {
      emotes: TwitchGqlResponseEmotes[];
    };
    channel: {
      localEmoteSets: {
        emotes: TwitchGqlResponseEmotes[];
      }[];
    };
  };
}