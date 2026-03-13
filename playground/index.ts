import { getStreamerEmotes } from "streamer-emotes";

const rubiusEmotes = await getStreamerEmotes("rubius", {
  sevenTV: true, // Get 7TV emotes
  twitch: { globals: false } // Get Twitch emotes but exclude global ones
});

console.info(rubiusEmotes);
