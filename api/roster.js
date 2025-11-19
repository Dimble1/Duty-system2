import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  const role = req.headers['x-user-role'];

  async function readRoster() {
    const { blobs } = await list();
    const file = blobs.find(b => b.pathname === 'roster.json');
    let roster = {};
    if (file) {
      const response = await fetch(file.url);
      const text = await response.text();

      // Проверка: если вместо JSON пришёл HTML
      if (text.trim().startsWith('<')) {
        console.error("roster.json отсутствует или поврежден, получен HTML вместо JSON");
        return {};
      }

      try {
        roster = JSON.parse(text);
      } catch (err) {
        console.error("Ошибка парсинга roster.json:", err);
        roster = {};
      }
    }
    return roster;
  }

  // GET — получить расписание
  if (req.method === 'GET') {
    const roster = await readRoster();
    return res.status(200).json(roster || {});
  }

  // POST — сохранить расписание
  if (req.method === 'POST') {
    if (role !== 'admin') return res.status(403).json({ error: 'Нет прав' });
    const { date, names } = req.body;
    let roster = await readRoster();
    if (typeof roster !== 'object' || roster === null) roster = {};

    roster[date] = names;

    // Защита: если расписание пустое, не перезаписываем
    if (Object.keys(roster).length === 0) {
      return res.status(400).json({ error: "Нельзя сохранить пустое расписание" });
    }

    console.log("Сохраняем расписание:", roster);
    await put('roster.json', JSON.stringify(roster), {
      access: 'public',
      allowOverwrite: true
    });
    return res.status(200).json({ success: true, roster });
  }

  res.status(405).json({ error: 'Метод не поддерживается' });
}
