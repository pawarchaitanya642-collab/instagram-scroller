# instagram-scroller

Auto reel scroller script for Instagram reels.

## Features

- ON/OFF floating toggle button.
- Detects reel completion from the `video` `ended` playback event (no fixed-duration timer).
- Smoothly scrolls to the next reel when the current reel finishes.
- Stops immediately when toggled OFF.
- Pauses auto-scrolling when user touches the screen.

## Usage

1. Open Instagram reels in a desktop/mobile browser.
2. Inject `auto-reel-scroller.user.js` as a userscript or paste it in the browser console.
3. Use the **Auto Scroll** button in the top-right corner:
   - `OFF` disables automation.
   - `ON` enables scroll-on-video-end.
   - `PAUSED` indicates touch pause; playback of a reel clears the pause.
