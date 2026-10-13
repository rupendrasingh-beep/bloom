# Bloom Dashboard

The Bloom employee dashboard, built from the Figma design as a static site, with micro-interactions: gradient letter and hero animations, a book-style profile popup with an intro player, page turning, a pinned side menu, a water-ripple dark theme and more.

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

## Pizza kiosk (`/dominos`)

A 1080 × 1920 self-order kiosk menu built from the Figma frame, served at `/dominos` (locally: http://localhost:3000/dominos/). The kiosk scales to fit any screen.

- **Category nav:** the white bubble moves between categories as liquid. It runs on spring physics with trailing droplets, and an SVG "goo" filter merges them into one shape. Arrow keys work too.
- **Menu:** cards fade in as you scroll, pizzas spin on hover or add, the Add button ripples and confirms, and the banner floats with a light shine.
- **Filters:** Veg, Non-Veg and New Launch dim the items that don't match. Popular and Cheesy only highlight, because the design has no data for them.
- **Restart order** resets the filters and returns to Pizza.

Files: `public/dominos/index.html`, `kiosk.css`, `kiosk.js` and `assets/`, exported from Figma at 1x. The design only has pizza items, so the other categories change the title and replay the grid with the same pizzas.
