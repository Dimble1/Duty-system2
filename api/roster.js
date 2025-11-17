// api/roster.js
import { put, list } from '@vercel/blob';
import defaultStudents from '../defaultStudents.js';

function generateRoster(startDate = "2025-11-17") {
  const roster = {};
  const students = [...defaultStudents];
  let groupIndex = 0;

  // Разбиваем студентов на группы по 4
  while (students.length > 0) {
    const group = students.splice(0, 4);

    // Рассчитываем дату: через день (пн, ср, пт)
    const date = new Date(startDate);
    date.setDate(date.getDate() + groupIndex * 2);

    const isoDate = date.toISOString().split("T")[0];
    roster[isoDate] = group.map(s => s.name);

    groupIndex++;
  }

  return roster;
}

export default async function handler(req, res) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ token });
      const rosterBlob = blobs.find(b => b.pathname === 'roster.json');

      if (!rosterBlob) {
        // 👉 если файла нет — генерируем и сохраняем
        const roster = generateRoster();
        await put('roster.json', JSON.stringify(roster), {
          contentType: 'application/json',
          token
        });
        return res.status(200).json(roster);
      }

      const response = await fetch(rosterBlob.url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const text = await response.text();
      const parsed = JSON.parse(text || "{}");

      if (!parsed || Object.keys(parsed).length === 0) {
        const roster = generateRoster();
        await put('roster.json', JSON.stringify(roster), {
          contentType: 'application/json',
          token
        });
        return res.status(200).json(roster);
      }

      res.status(200).json(parsed);
    } catch (err) {
      const roster = generateRoster();
      res.status(200).json(roster);
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
