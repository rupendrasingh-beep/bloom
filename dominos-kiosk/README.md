# Domino's UAE self-order kiosk (concept)

A clickable prototype and design board for an in-store self-order kiosk: 32″ portrait screen, 1080 × 1920.

Open `index.html` in a browser. There is no build step. It is separate from the Bloom dashboard and is not served by `server.js`.

- **Prototype** shows the kiosk in a device frame with its card reader, receipt printer and coupon scanner. Click through it as a guest would. The side panel lists the flow and design notes for each screen. The demo sign-in code is `1234`.
- **All screens** shows every key state side by side. Click one to open it in the prototype.
- **Features** maps each sub-feature in the brief to the screens that show it.
- Link straight to a state with a hash, for example `index.html#custom-half`, `index.html#pay-split` or `index.html#features`.

## Guest journey

1. **Welcome:** brand-led idle screen, English / العربية, public coupons (tap to save for checkout), Touch to start
2. **Eat in or take away**
3. **Menu:** store and market bar, categories, and full listings with picture, name, tags, description, price, calories, availability, allergens and nutrition. Sold-out and not-yet-served items stay visible but can't be added.
4. **Build your pizza:** size, whole or half & half, crust, remove ingredients, up to five extra toppings. Invalid combinations are locked with the reason, and the price and calories update live.
5. **Guided upsell:** after a pizza is added, one tap to go Large plus three cross-sell items
6. **Deal builder:** meal bundles built slot by slot, with a nested crust choice for each pizza and premium surcharges shown up front
7. **Cart:** every modification per line, quantity, edit, remove, cross-sell, VAT and total. Guests check out directly; signing in is offered only for wallet and coupons.
8. **Sign in:** mobile number (+971) and 4-digit OTP, with guest checkout always available. Profile, wallet and coupons appear only after verification.
9. **Wallet and coupons:** balance, partial or full redemption, mobile-linked coupons with eligibility reasons
10. **Payment:** card or phone via Fusion Pay, pay at counter, wallet + card split tender, wallet-only, and a declined state that releases the wallet hold
11. **Confirmation:** order number, tracker, rating and receipt. The customer is signed out and the kiosk returns to the welcome screen by itself.

Also included: a "Still there?" timeout after 45 seconds idle that clears the cart and ends the session, full Arabic with right-to-left layout, and an accessible view that moves the UI into the lower half of the screen.

## Before using this with the client

- **All data is placeholder.** Nutrition (`NUT`), allergens (`ALG`), stock (`AVAIL`), coupons (`COUPONS`), deals (`DEAL_DEF`, `PREMIUM`) and the customer profile (`DEMO_USER`) in `kiosk.js` are examples. They should come from the validated menu feed, the POS and the CRM / wallet APIs.
- **Business rules are assumptions:** half & half and Cheesy Crust on Medium and Large only, a maximum of five extra toppings, half & half charged at the higher half, pay at counter not combined with wallet. Confirm them with Alamar.
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
