# Rayyan landing page

The Rayyan water landing page, built from the Figma design ("Option 3") as a static site with animation:

- **Hero:** full-screen intro video with a slow zoom on scroll. Until the video is added, it shows animated light shafts and bubbles that drift away from the pointer.
- **Water ripple:** a ripple that follows the pointer behind every section after the hero, with occasional ambient drops.
- **Scroll reveals:** headings rise word by word, the wavy dividers draw themselves, images rise or zoom in, and the map pins on "The Source" drop in and pulse.
- **Story and Source:** parallax on the bottle and the floating oasis island.
- **Mission:** the founder card tilts with a light sheen, timeline years count up, and the grid lines draw in with a spotlight that follows the pointer.
- **Values:** cards tilt, glow and lift their icon on hover.
- **Bottling:** a carousel that switches between sparkling and still water (arrows, keyboard ← →, or swipe). Picking a size swaps the big bottle.
- **Header and footer:** the header hides on scroll down and returns on scroll up, a light slides under the current nav link, and the footer ticker scrolls continuously.

All motion respects `prefers-reduced-motion`.

## Run locally

Requires Node.js 18 or newer. There are no dependencies to install.

```bash
npm start
```

Then open http://localhost:3000. Use `PORT=8080 npm start` to pick another port.

## Deploy to Vercel

Import the repository in Vercel and keep the defaults: `vercel.json` serves `public/` with no build step. Or run `vercel --prod`.

## Project layout

```
public/
  index.html        the page
  styles/site.css   layout (design pixel values × --u) and animation
  js/site.js        interactions, canvas bubbles and water ripple
  assets/           images and icons exported from Figma
server.js           small static server for local use
vercel.json         Vercel settings
```

## Still to add

- **Intro video:** Figma's API cannot export video fills, so put the hero video at `public/assets/hero.mp4`. It fades in automatically once it loads.
- **Font:** the design uses Cocon (Cocon Offc). The page falls back to Baloo Bhaijaan 2 from Google Fonts. If you have a web licence for Cocon, add `@font-face` rules named `"Cocon Offc"` and it will be used first.
