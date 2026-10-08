# Bloom Dashboard

The Bloom employee dashboard, built from the Figma design as a static site, with micro-interactions: gradient letter and hero animations, a book-style profile popup with an intro player, page turning, a pinned side menu, a water-ripple dark theme and more.

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm start
```

Then open http://localhost:3000 (the dashboard) or http://localhost:3000/bookshelf. Use `PORT=8080 npm start` to pick another port, or `npm run dev` to restart the server automatically when `server.js` changes.

## Bookshelf

`/bookshelf` (also linked from the book icon in the dashboard's side menu) is a book discovery page built from the Figma design: a dark library hero with an "Ask AI" search bar and fanned covers, and below it the reader's own bookshelf.

- **First visit:** the shelf is empty, with ghost outlines where books will stand and a prompt to find a first book.
- **Ask AI:** type a request in the hero bar, or press **Find a book** to answer five quick questions (what the book should do for you, genres, mood, reading time, a book you loved). The concierge then suggests four books with a reason for each, and can show more.
- **Choosing a book:** the cover flies across the screen, turns to its spine and drops onto the shelf with a burst of sparkles. Click a spine to pull the book out: it turns to face you and opens a card with the reason it was picked, a reading status (want to read, reading, finished) and a remove option.
- **AI picks:** suggestions come from Claude through `POST /api/recommend` (`lib/recommend.js`), chosen from the catalogue in `public/data/books.json`. Set `ANTHROPIC_API_KEY` locally or in the Vercel project's environment variables to turn it on. Without a key, or if the call fails, the page uses its own matcher, so it always works.
- **Storage:** each reader's shelf is kept in their browser (`localStorage`), so it doesn't follow them to other devices.
- **Design images:** the page's images and icons come from the Figma file. Run `sh scripts/fetch-figma-assets.sh` to download them into `public/assets/shelf/` (Figma's export links expire about a week after export; after that, re-export the same layers under the file names listed in the script).

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the defaults. `vercel.json` already tells Vercel to serve the `public/` folder with no build step, and `api/recommend.js` becomes the book concierge's serverless function.
4. Optional: add `ANTHROPIC_API_KEY` under **Settings → Environment Variables** so the concierge uses Claude.

Or deploy from the command line with the Vercel CLI: `vercel --prod`.

## Project layout

```
public/            the website (served as-is)
  index.html       the dashboard
  bookshelf.html   the bookshelf page
  data/            books.json, the bookshelf catalogue
  styles/          app.css (interactions, dark theme), tailwind.css (generated from the design)
  js/              app.js (dashboard interactions), mesh.js (WebGL gradient renderer),
                   bookshelf.js (shelf + AI concierge), shelf-page.js (bookshelf header and hero)
  assets/          images and icons exported from Figma
  assets-masks/    shape-only copies of Figma mask SVGs
  fonts/           Makira font files
api/recommend.js   Vercel function for the book concierge
lib/recommend.js   asks Claude for book picks (shared by server.js and the Vercel function)
scripts/           fetch-figma-assets.sh, downloads the bookshelf page's design images
server.js          small server for local use (static files + /api/recommend)
vercel.json        Vercel settings
```

## Before publishing

- **Font licence:** `public/fonts/` contains the Makira font files. Check that your licence allows serving them on a public website.
- **Placeholder content:** the joiner profiles, careers, bios and intro captions in `public/js/app.js` (`PROFILES` and `HISTORY`) are placeholders. Replace them with real details.
- **Intro videos:** add a real video per person with `video: 'assets/<file>.mp4'` in `PROFILES`.
