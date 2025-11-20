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

  // GET — список студентов
  if (req.method === 'GET') {
    const students = await readStudents();
    return res.status(200).json(students);
  }

  // POST — добавить студента (только админ)
  if (req.method === 'POST') {
    if (role !== 'admin') return res.status(403).json({ error: 'Нет прав' });
    const { name } = req.body;
    let students = await readStudents();
    students.push({ name, status: 'Активен', role: 'student' });
    await saveStudents(students);
    return res.status(200).json(students);
  }

  // PUT — обновить статус/роль
  if (req.method === 'PUT') {
    const { name, status, role: newRole } = req.body;
    let students = await readStudents();

    if (role === 'admin') {
      // админ может менять всё
      students = students.map(s =>
        s.name === name ? { ...s, status: status || s.status, role: newRole || s.role } : s
      );
    } else if (role === 'zam') {
      // зам может менять только статус
      students = students.map(s =>
        s.name === name ? { ...s, status: status || s.status } : s
      );
    } else {
      return res.status(403).json({ error: 'Нет прав' });
    }

    await saveStudents(students);
    return res.status(200).json(students);
  }

  // DELETE — удалить студента (только админ)
  if (req.method === 'DELETE') {
    if (role !== 'admin') return res.status(403).json({ error: 'Нет прав' });
    const { name } = req.body;
    let students = await readStudents();
    students = students.filter(s => s.name !== name);
    await saveStudents(students);
    return res.status(200).json(students);
  }

  res.status(405).json({ error: 'Метод не поддерживается' });
}
