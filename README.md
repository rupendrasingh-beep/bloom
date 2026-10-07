# Bloom Dashboard

The Bloom employee dashboard, built from the Figma design as a static site, with micro-interactions: gradient letter and hero animations, a book-style profile popup with an intro player, page turning, a pinned side menu, a water-ripple dark theme and more.

## Run locally

Requires Node.js 18 or newer. There are no dependencies to install.

```bash
npm start
```

Then open http://localhost:3000 for the Bloom dashboard, or http://localhost:3000/prh.html for the Penguin Random House India landing page. Use `PORT=8080 npm start` to pick another port, or `npm run dev` to restart the server automatically when `server.js` changes.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the defaults. `vercel.json` already tells Vercel to serve the `public/` folder with no build step.

Or deploy from the command line with the Vercel CLI: `vercel --prod`.

## Project layout

```
public/            the website (served as-is)
  index.html       Bloom dashboard
  prh.html         Penguin Random House India landing page (hero section of Figma frame 1:2)
  prh/             its styles, script and images
  styles/          app.css (interactions, dark theme), tailwind.css (generated from the design)
  js/              app.js (all interactions), mesh.js (WebGL gradient renderer)
  assets/          images and icons exported from Figma
  assets-masks/    shape-only copies of Figma mask SVGs
  fonts/           Makira font files
server.js          small static server for local use
vercel.json        Vercel settings
```

## Before publishing

- **Landing page images:** the files in `public/prh/assets/` were exported as 1x renders from Figma, so the logo, avatar and sparkle icon look soft on high-density screens. Swap in 2x or SVG exports when you have them.
- **Landing page search:** "Ask AI" has no backend yet. `public/prh/prh.js` fires an `ask` event on the form with the query, ready to be wired up.

- **Font licence:** `public/fonts/` contains the Makira font files. Check that your licence allows serving them on a public website.
- **Placeholder content:** the joiner profiles, careers, bios and intro captions in `public/js/app.js` (`PROFILES` and `HISTORY`) are placeholders. Replace them with real details.
- **Intro videos:** add a real video per person with `video: 'assets/<file>.mp4'` in `PROFILES`.
