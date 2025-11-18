import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  const role = req.headers['x-user-role'];

  // Чтение расписания
  if (req.method === 'GET') {
    const { blobs } = await list();
    const file = blobs.find(b => b.pathname === 'roster.json');

    if (!file) {
      return res.status(200).json({}); // если файла нет, возвращаем пустой объект
    }

    const response = await fetch(file.url);
    const roster = await response.json();
    return res.status(200).json(roster);
  }

  // Добавление/обновление даты в расписании
  if (req.method === 'POST') {
    if (role !== 'admin' && role !== 'zam') {
      return res.status(403).json({ error: 'Нет прав' });
    }

    const { date, names } = req.body;

    const { blobs } = await list();
    const file = blobs.find(b => b.pathname === 'roster.json');
    let roster = {};

    if (file) {
      const response = await fetch(file.url);
      roster = await response.json();
    }

    roster[date] = names;

    await put('roster.json', JSON.stringify(roster), {
      access: 'public',
      allowOverwrite: true
    });

    return res.status(200).json({ success: true, roster });
  }

  // Удаление даты из расписания
  if (req.method === 'DELETE') {
    if (role !== 'admin' && role !== 'zam') {
      return res.status(403).json({ error: 'Нет прав' });
    }

    const { date } = req.body;

    const { blobs } = await list();
    const file = blobs.find(b => b.pathname === 'roster.json');
    let roster = {};

    if (file) {
      const response = await fetch(file.url);
      roster = await response.json();
    }

    delete roster[date];

    await put('roster.json', JSON.stringify(roster), {
      access: 'public',
      allowOverwrite: true
    });

    return res.status(200).json({ success: true, roster });
  }

  res.status(405).json({ error: 'Метод не поддерживается' });
}
