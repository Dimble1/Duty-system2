import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  const role = req.headers['x-user-role'];

  // Чтение списка студентов
  if (req.method === 'GET') {
    const { blobs } = await list();
    const file = blobs.find(b => b.pathname === 'students.json');

    if (!file) {
      return res.status(404).json({ error: 'Файл students.json не найден' });
    }

    const response = await fetch(file.url);
    const students = await response.json();
    return res.status(200).json(students);
  }

  // Добавление студента (только админ)
  if (req.method === 'POST') {
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Нет прав' });
    }

    const { name } = req.body;

    const { blobs } = await list();
    const file = blobs.find(b => b.pathname === 'students.json');
    const response = await fetch(file.url);
    const students = await response.json();

    students.push({ name, status: 'Активен', role: 'student' });

    await put('students.json', JSON.stringify(students), { access: 'public' });
    return res.status(200).json({ success: true, students });
  }

  // Обновление статуса/роли (только админ)
  if (req.method === 'PUT') {
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Нет прав' });
    }

    const { name, status, role: newRole } = req.body;

    const { blobs } = await list();
    const file = blobs.find(b => b.pathname === 'students.json');
    const response = await fetch(file.url);
    let students = await response.json();

    students = students.map(s =>
      s.name === name ? { ...s, status: status || s.status, role: newRole || s.role } : s
    );

    await put('students.json', JSON.stringify(students), { access: 'public' });
    return res.status(200).json({ success: true, students });
  }

  // Удаление студента (только админ)
  if (req.method === 'DELETE') {
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Нет прав' });
    }

    const { name } = req.body;

    const { blobs } = await list();
    const file = blobs.find(b => b.pathname === 'students.json');
    const response = await fetch(file.url);
    let students = await response.json();

    students = students.filter(s => s.name !== name);

    await put('students.json', JSON.stringify(students), { access: 'public' });
    return res.status(200).json({ success: true, students });
  }

  res.status(405).json({ error: 'Метод не поддерживается' });
}
