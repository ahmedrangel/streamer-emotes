import { getStreamerEmotes, getTwitchEmoteImagesById } from "streamer-emotes";

const emotes = await getStreamerEmotes("vedal987", {
  bttv: true, // Get BTTV emotes
  ffz: true, // Get FFZ emotes
  sevenTV: true, // Get 7TV emotes
  twitch: { globals: false } // Get Twitch emotes but exclude global ones
});

console.info(emotes);

const emoteImages = getTwitchEmoteImagesById("emotesv2_f8b05d05af3b4bb8885bfe08b4052ae4");

console.info(emoteImages);
