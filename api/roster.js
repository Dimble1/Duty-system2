// duty-system2/api/roster.js
import { put, get } from '@vercel/blob';

export default async function handler(req, res) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (req.method === 'GET') {
    try {
      const { body } = await get('roster.json', { token });
      const text = await body.text();
      res.status(200).json(JSON.parse(text));
    } catch (err) {
      // если файла ещё нет — возвращаем пустой объект
      res.status(200).json({});
    }
  }

  if (req.method === 'POST') {
    try {
      const data = req.body;
      await put('roster.json', JSON.stringify(data), {
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

