import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { key } = req.query;
    if (!key) {
      return res.status(400).json({ error: 'key required' });
    }
    try {
      const value = await kv.get(key);
      return res.status(200).json({ value });
    } catch (err) {
      return res.status(500).json({ error: 'kv_read_failed', message: err.message });
    }
  }

  if (req.method === 'POST') {
    const { key, value } = req.body || {};
    if (!key) {
      return res.status(400).json({ error: 'key required' });
    }
    try {
      await kv.set(key, value);
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: 'kv_write_failed', message: err.message });
    }
  }

  return res.status(405).json({ error: 'method_not_allowed' });
}
