// api/roster.js
import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ token });
      const rosterBlob = blobs.find(b => b.pathname === 'roster.json');

      if (!rosterBlob) {
        // 👉 если файла нет — создаём пустой объект расписания
        const emptyRoster = {};
        await put('roster.json', JSON.stringify(emptyRoster), {
          contentType: 'application/json',
          token
        });
        return res.status(200).json(emptyRoster);
      }

      const response = await fetch(rosterBlob.url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const text = await response.text();
      const parsed = JSON.parse(text || "{}");

      // 👉 если файл пустой — перезаписываем пустым объектом
      if (!parsed || Object.keys(parsed).length === 0) {
        const emptyRoster = {};
        await put('roster.json', JSON.stringify(emptyRoster), {
          contentType: 'application/json',
          token
        });
        return res.status(200).json(emptyRoster);
      }

      res.status(200).json(parsed);
    } catch (err) {
      res.status(200).json({}); // fallback
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
