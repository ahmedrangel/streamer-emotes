# streamer-emotes

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

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

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/streamer-emotes.svg?style=flat
[npm-version-href]: https://npmjs.com/package/streamer-emotes

[npm-downloads-src]: https://img.shields.io/npm/dm/streamer-emotes.svg?style=flat
[npm-downloads-href]: https://npmjs.com/package/streamer-emotes