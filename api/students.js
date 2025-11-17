import { put, get } from '@vercel/blob';

export default async function handler(req, res) {
  const role = req.headers['x-user-role']; // роль из localStorage → заголовок

  // Чтение списка студентов
  if (req.method === 'GET') {
    const blob = await get('students.json');
    const students = JSON.parse(await blob.text());
    return res.status(200).json(students);
  }

  // Добавление студента (только админ)
  if (req.method === 'POST') {
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Нет прав' });
    }

    const { name } = req.body;
    const blob = await get('students.json');
    const students = JSON.parse(await blob.text());

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
    const blob = await get('students.json');
    let students = JSON.parse(await blob.text());

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
    const blob = await get('students.json');
    let students = JSON.parse(await blob.text());

    students = students.filter(s => s.name !== name);

    await put('students.json', JSON.stringify(students), { access: 'public' });
    return res.status(200).json({ success: true, students });
  }

  res.status(405).json({ error: 'Метод не поддерживается' });
}
