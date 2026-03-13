# streamer-emotes
A library to get Twitch, BTTV, FFZ and 7TV emotes for a given Twitch channel.

## Usage

```js
import { getStreamerEmotes } from "streamer-emotes";

const rubiusEmotes = await getStreamerEmotes("rubius", {
  sevenTV: true, // Get 7TV emotes
  twitch: { globals: false } // Get Twitch emotes but exclude global ones
});

console.log(rubiusEmotes);

```
