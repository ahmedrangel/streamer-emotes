# streamer-emotes
A library to get Twitch, BTTV, FFZ and 7TV emotes for a given Twitch channel.

## Usage

```js
import { getStreamerEmotes } from "streamer-emotes";

const emotes = await getStreamerEmotes("rubius", {
  bttv: true, // Get BTTV emotes
  ffz: true, // Get FFZ emotes
  sevenTV: true, // Get 7TV emotes
  twitch: { globals: false } // Get Twitch emotes but exclude global ones
});

console.info(emotes);
```
