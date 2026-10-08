# Bloom Dashboard

The Bloom employee dashboard, built from the Figma design as a static site, with micro-interactions: gradient letter and hero animations, a book-style profile popup with an intro player, page turning, a pinned side menu, a water-ripple dark theme and more.

## Rayyan landing page

`public/rayyan/` is a separate page built from the Figma frame "Option 3" (Rayyan Natural Water). Open it at http://localhost:3000/rayyan/ locally, or `/rayyan` on the deployed site.

It is plain HTML, CSS and JS with no dependencies. Interactions: a water-fill loader, rising bubbles in the hero that move away from the pointer, water ripples where you click, a droplet cursor, word-by-word heading reveals, a scroll-driven bottle rise, a sliding nav highlight, a tilting founder card, a timeline with a pointer glow and counting years, a floating island with parallax and animated map pins, a quote that lights up as you scroll, value icons that fill with water on hover, a product card with fizz, a title slider and size highlights, and a marquee that speeds up with scroll. Motion is turned off when the visitor's system asks for reduced motion.

- Sizes follow the 1728px Figma frame and scale down proportionally on smaller screens. Below 820px the page switches to a stacked mobile layout.
- Images in `public/rayyan/assets/` are renders exported from the Figma file.
- Fonts: the design uses Cocon Offc, a licensed font that is not included. The page uses it if it is installed, otherwise it falls back to Baloo 2 and Nunito (both SIL Open Font License, in `public/rayyan/fonts/`).
- The hero in Figma is a video. No video file was available, so the hero uses the exported video frame with animated bubbles on top. To use the real video, put a `<video>` inside `.hero__media`.

## Run locally

Requires Node.js 18 or newer. There are no dependencies to install.

```bash
npm start
```

Then open http://localhost:3000. Use `PORT=8080 npm start` to pick another port, or `npm run dev` to restart the server automatically when `server.js` changes.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the defaults. `vercel.json` already tells Vercel to serve the `public/` folder with no build step.

Or deploy from the command line with the Vercel CLI: `vercel --prod`.

## Project layout

```
public/            the website (served as-is)
  index.html
  styles/          app.css (interactions, dark theme), tailwind.css (generated from the design)
  js/              app.js (all interactions), mesh.js (WebGL gradient renderer)
  assets/          images and icons exported from Figma
  assets-masks/    shape-only copies of Figma mask SVGs
  fonts/           Makira font files
server.js          small static server for local use
vercel.json        Vercel settings
```

## Before publishing

- **Font licence:** `public/fonts/` contains the Makira font files. Check that your licence allows serving them on a public website.
- **Placeholder content:** the joiner profiles, careers, bios and intro captions in `public/js/app.js` (`PROFILES` and `HISTORY`) are placeholders. Replace them with real details.
- **Intro videos:** add a real video per person with `video: 'assets/<file>.mp4'` in `PROFILES`.
