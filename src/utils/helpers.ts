import { $fetch } from "ofetch";
import { gqlQuery } from "gql-payload";

export const providersURL = {
  sevenTV: "https://7tv.io/v3",
  bttv: "https://api.betterttv.net/3",
  ffz: "https://api.frankerfacez.com/v1",
  twitch: "https://gql.twitch.tv/gql"
};

export const callTwitchGQL = async (...args: Parameters<typeof gqlQuery>) => {
  return $fetch(providersURL.twitch, {
    method: "POST",
    headers: {
      "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko",
      "Content-Type": "application/json"
    },
    body: gqlQuery(...args)
  });
};

let twitchIdMemory: Record<string, string> = {};

export const getTwitchIdByLogin = async (login: string): Promise<string> => {
  login = login.toLowerCase();
  if (twitchIdMemory[login]) {
    return twitchIdMemory[login];
  }

  const { data } = await callTwitchGQL({
    operation: "user",
    variables: {
      login: { value: login, type: "String!" }
    },
    fields: [
      "id"
    ]
  });

  const channelId = data?.user?.id;

  if (!channelId) {
    throw new Error(`Twitch channel with login '${login}' not found.`);
  }

  twitchIdMemory[login] = channelId;
  return channelId;
};