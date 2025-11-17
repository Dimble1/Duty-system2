import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (req.method === 'GET') {
    try {
      // получаем список всех blob
      const { blobs } = await list({ token });
      const rosterBlob = blobs.find(b => b.pathname === 'roster.json');

      if (!rosterBlob) {
        return res.status(200).json({});
      }

      // читаем содержимое через fetch
      const response = await fetch(rosterBlob.url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const text = await response.text();
      res.status(200).json(JSON.parse(text || "{}"));
    } catch (err) {
      res.status(500).json({ error: 'Ошибка чтения расписания' });
    }
  }

  if (req.method === 'POST') {
    try {
      await put('roster.json', JSON.stringify(req.body), {
        contentType: 'application/json',
        token
      });
      res.status(200).json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: 'Ошибка сохранения расписания' });
    }
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Метод не поддерживается' });
  }
}

