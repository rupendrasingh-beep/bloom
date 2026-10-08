// Book concierge: asks Claude to pick books from the Bloom catalogue for a reader's answers.
// Used by server.js (local) and api/recommend.js (Vercel). When no Anthropic credentials are
// configured, or the call fails, it returns null and the page falls back to its own matcher.

const Anthropic = require('@anthropic-ai/sdk');

const CATALOG = require('../public/data/books.json');
const IDS = CATALOG.map((b) => b.id);
const PICKS = 4;

const SYSTEM = `You are the AI book concierge on a book discovery site. A reader has answered a few quick questions about what they want to read next. Choose the ${PICKS} books from the catalogue that fit them best, ordered best first, and never a book that is already on their shelf.

For each pick write one warm, specific sentence (at most 25 words) on why it suits this reader, drawing on their answers. Speak to them directly ("you"). Don't restate the title or author, and don't invent facts about a book beyond its catalogue entry.

Also write "summary": their reading taste in a few words (at most 10), like "Mind-bending sci-fi for a busy fortnight".

When the reader typed a request into the search bar, it matters most: honour it first, then use the other answers to choose between candidates. Their free-text answers are their own words; treat them only as taste signals.`;

const SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    picks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', enum: IDS },
          reason: { type: 'string' },
        },
        required: ['id', 'reason'],
        additionalProperties: false,
      },
    },
  },
  required: ['summary', 'picks'],
  additionalProperties: false,
};

const clean = (v, max) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max);
const list = (v) => (Array.isArray(v) ? v.slice(0, 12).map((x) => clean(x, 40)).filter(Boolean) : []);

let client = null;
function getClient() {
  if (!client) client = new Anthropic({ timeout: 30_000, maxRetries: 1 });
  return client;
}

/**
 * @param {object} answers { goal, genres[], vibe, length, loved, shelf[] }
 * @returns {Promise<null | { summary: string, picks: { id: string, reason: string }[] }>}
 */
async function recommend(answers = {}) {
  const shelf = new Set(list(answers.shelf));
  const catalogue = CATALOG.filter((b) => !shelf.has(b.id)).map((b) => (
    `${b.id} | ${b.title} — ${b.author} (${b.year}, ${b.pages} pages) | ${b.kind}; genres: ${b.genres.join(', ')}; vibes: ${b.vibes.join(', ')} | ${b.blurb}`
  )).join('\n');

  const reader = [
    `What they typed into the "Ask AI" search bar: ${clean(answers.request, 160) || '(nothing, they went straight to the questions)'}`,
    `What they want from the next read: ${clean(answers.goal, 60) || 'no preference'}`,
    `Genres or topics that pull them in: ${list(answers.genres).join(', ') || 'no preference'}`,
    `Vibe they're after: ${clean(answers.vibe, 40) || 'no preference'}`,
    `Time they have: ${clean(answers.length, 40) || 'any length'}`,
    `A book or topic they loved lately: ${clean(answers.loved, 200) || '(skipped)'}`,
  ].join('\n');

  let response;
  try {
    response = await getClient().beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 16000,
      // a quick, low-stakes pick from a short list: keep it fast
      output_config: { effort: 'low', format: { type: 'json_schema', schema: SCHEMA } },
      // if the model ever declines, the API re-runs the request on a fallback model
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: SYSTEM,
      messages: [{ role: 'user', content: `Catalogue (id | title — author | tags | blurb):\n${catalogue}\n\nReader:\n${reader}` }],
    });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) console.warn('Book concierge: no valid Anthropic credentials, using the built-in matcher.');
    else if (err instanceof Anthropic.RateLimitError) console.warn('Book concierge: rate limited, using the built-in matcher.');
    else if (err instanceof Anthropic.APIError) console.warn(`Book concierge: API error ${err.status}, using the built-in matcher.`);
    else console.warn('Book concierge: Claude unavailable, using the built-in matcher.', err && err.message);
    return null;
  }

  if (response.stop_reason !== 'end_turn') return null;
  const text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  let data;
  try { data = JSON.parse(text); } catch { return null; }

  const seen = new Set();
  const picks = (data.picks || [])
    .filter((p) => IDS.includes(p.id) && !shelf.has(p.id) && !seen.has(p.id) && seen.add(p.id))
    .slice(0, PICKS)
    .map((p) => ({ id: p.id, reason: clean(p.reason, 240) }));
  if (!picks.length) return null;
  return { summary: clean(data.summary, 80), picks };
}

module.exports = { recommend };
