import { put, list } from '@vercel/blob';

let studentsCache = null;

// Чтение студентов (с кэшем)
async function readStudents() {
  if (studentsCache) return studentsCache;

  const { blobs } = await list();
  const file = blobs.find(b => b.pathname === 'students.json');
  if (!file) return [];

  const response = await fetch(file.url);
  const text = await response.text();

  if (text.trim().startsWith('<')) return [];

  try {
    studentsCache = JSON.parse(text);
  } catch {
    studentsCache = [];
  }
  return studentsCache;
}

// Сохранение студентов (обновляем кэш и blob)
async function saveStudents(students) {
  studentsCache = students;
  await put('students.json', JSON.stringify(students), {
    access: 'public',
    allowOverwrite: true
  });
}

export default async function handler(req, res) {
  const role = req.headers['x-user-role'];

  // GET
  if (req.method === 'GET') {
    const students = await readStudents();
    return res.status(200).json(students);
  }

  // POST — добавить студента
  if (req.method === 'POST') {
    if (role !== 'admin') return res.status(403).json({ error: 'Нет прав' });
    const { name } = req.body;
    let students = await readStudents();
    students.push({ name, status: 'Активен', role: 'student' });
    await saveStudents(students);
    return res.status(200).json(students); // ⚡ сразу список
  }

  // PUT — обновить статус/роль
  if (req.method === 'PUT') {
    if (role !== 'admin') return res.status(403).json({ error: 'Нет прав' });
    const { name, status, role: newRole } = req.body;
    let students = await readStudents();
    students = students.map(s =>
      s.name === name ? { ...s, status: status || s.status, role: newRole || s.role } : s
    );
    await saveStudents(students);
    return res.status(200).json(students); // ⚡ сразу список
  }

  // DELETE — удалить студента
  if (req.method === 'DELETE') {
    if (role !== 'admin') return res.status(403).json({ error: 'Нет прав' });
    const { name } = req.body;
    let students = await readStudents();
    students = students.filter(s => s.name !== name);
    await saveStudents(students);
    return res.status(200).json(students); // ⚡ сразу список
  }

  res.status(405).json({ error: 'Метод не поддерживается' });
}
