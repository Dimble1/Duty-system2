import { put, list } from '@vercel/blob';

let rosterCache = null;

// Чтение дежурства (с кэшем)
async function readRoster() {
  if (rosterCache) return rosterCache;

  const { blobs } = await list();
  const file = blobs.find(b => b.pathname === 'roster.json');
  if (!file) return {};

  const response = await fetch(file.url);
  const text = await response.text();

  if (text.trim().startsWith('<')) return {};

  try {
    rosterCache = JSON.parse(text);
  } catch {
    rosterCache = {};
  }
  return rosterCache;
}

// Сохранение дежурства (обновляем кэш и blob)
async function saveRoster(roster) {
  rosterCache = roster;
  await put('roster.json', JSON.stringify(roster), {
    access: 'public',
    allowOverwrite: true
  });
}

export default async function handler(req, res) {
  const role = req.headers['x-user-role'];

  // GET — получить список дежурных
  if (req.method === 'GET') {
    const roster = await readRoster();
    return res.status(200).json(roster);
  }

  // POST — добавить/обновить дежурных на дату
  if (req.method === 'POST') {
    if (role !== 'admin') return res.status(403).json({ error: 'Нет прав' });
    const { date, names } = req.body;
    let roster = await readRoster();
    roster[date] = names;
    await saveRoster(roster);
    return res.status(200).json(roster); // ⚡ сразу список
  }

  // DELETE — удалить дату из дежурства
  if (req.method === 'DELETE') {
    if (role !== 'admin') return res.status(403).json({ error: 'Нет прав' });
    const { date } = req.body;
    let roster = await readRoster();
    delete roster[date];
    await saveRoster(roster);
    return res.status(200).json(roster); // ⚡ сразу список
  }

  res.status(405).json({ error: 'Метод не поддерживается' });
}
