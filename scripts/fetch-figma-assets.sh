#!/usr/bin/env sh
# Downloads the bookshelf page's images and icons from the Figma design
# (file sfzE7GuqVws8fExrxNQYSn, frame 29:6 "Fold 1") into public/assets/shelf/.
# Figma's export links expire about 7 days after they were generated (8 Oct 2026);
# after that, re-export the same layers from Figma with these file names.
set -e
cd "$(dirname "$0")/../public/assets/shelf"
while read -r name id; do
  curl -fsSL -o "$name" "https://www.figma.com/api/mcp/asset/$id"
  echo "saved $name"
done <<'LIST'
hero-library.png e3b8a741-dfe3-4917-8629-748182a54f5c.png
cover-1.png 589f591c-ec1a-4156-b0db-277e6684c5a1.png
cover-2.png 0a567e3c-3744-4e89-b4bf-75669250d9e3.png
cover-3.png 0baddc60-7584-4e35-93fa-179cff92484a.png
cover-4.png 5276a760-296f-4297-bfc1-2c313dad0d0d.png
cover-5.png 96f2dbf6-5b13-427c-8ef1-3e3fe94a58fd.png
cover-6.png 5836110e-fd37-42cc-af50-3995a2f244ba.png
cover-7.png cad78a57-5ef7-4670-bc57-20c389a6dded.png
logo-mark.png a434e61f-8dc2-43c5-9cfe-4208bbd3f39a.png
logo-word.png 5397b8c2-dec9-4195-ba00-5adc0cc1ca54.png
avatar.png 87e2136b-479d-494c-a583-7dc3900308b7.png
avatar-ring.svg 14d0e9db-0a38-450d-97bc-983469b15520.svg
caret.svg 07403413-607f-4f73-bf3d-d99c0ee5abd2.svg
sparkle-ai.svg 7f3389e4-9f5a-4ec8-9fa2-35c059616724.svg
chevron-down.svg ff9843e4-ae6a-4ca5-8701-b0f6993fff98.svg
moon.svg c49f4973-a250-47b3-840e-b976f901766f.svg
search.svg 3a5a2a12-6830-4dea-8a24-130f304667bf.svg
LIST
