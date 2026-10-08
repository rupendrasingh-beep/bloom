// Vercel serverless function: POST /api/recommend → book picks from Claude.
// Set ANTHROPIC_API_KEY in the Vercel project settings to enable it.

const { recommend } = require('../lib/recommend');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }
  const result = await recommend(req.body || {});
  if (!result) return res.status(503).json({ error: 'unavailable' });
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json(result);
};
