# Domino's UAE self-order kiosk (concept)

A clickable prototype and design board for an in-store self-order kiosk: 32″ portrait screen, 1080 × 1920.

Open `index.html` in a browser. There is no build step. It is separate from the Bloom dashboard and is not served by `server.js`.

- **Prototype** shows the kiosk in a device frame with its card reader, receipt printer and coupon scanner. Click through it as a guest would. The side panel lists the flow and design notes for each screen.
- **All screens** shows fourteen key states side by side. Click one to open it in the prototype.
- Link straight to a state with a hash, for example `index.html#custom` or `index.html#board`.

## Guest journey

1. Attract loop (English / العربية)
2. Eat in or take away
3. Menu: pizzas, deals, sides, desserts, drinks. Each listing shows the picture, name, tags, description, price, calories, live availability, allergens (contains / may contain) and a nutrition strip (energy, protein, carbs, sugars, fat, salt)
4. Build your pizza: size, crust and extra toppings, with a live preview
5. Order review: edit lines, add-on suggestions, coupon, VAT shown as included
6. Payment: tap a card or phone (Visa, Mastercard, Apple Pay, Google Pay), or pay at the counter
7. Order number, progress tracker, rating and receipt; returns to the attract loop by itself

Calories also show in the pizza builder (per slice and whole pizza, changing with size, crust and toppings) and as a total on the order review.

Also included: full Arabic with right-to-left layout, a "Still there?" timeout after 45 seconds idle, and an accessible view that moves the UI into the lower half of the screen.

## Before using this with the client

- **Nutrition, allergens and stock are placeholders.** The values in `NUT`, `ALG` and `AVAIL` in `kiosk.js` are indicative examples. Replace them with Domino's official nutrition and allergen data and the store's live stock feed.
- **Prices are placeholders.** Pizza names and toppings follow dominos.ae listings, but prices vary by store and must come from the POS.
- **Logo:** `logoMark()` in `kiosk.js` is a hand-drawn placeholder. Swap in the official brand asset.
- **Food art** is drawn as inline SVG. Replace it with product photography for production.
- **Arabic copy** should be reviewed by a native copywriter.

## Files

```
index.html   page shell, viewer chrome and device frame
kiosk.css    viewer and kiosk styles (kiosk canvas is 1080 × 1920)
kiosk.js     menu data, copy (EN/AR), screens, food illustrations and prototype logic
```
