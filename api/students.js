import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  const role = req.headers['x-user-role'];

  async function readStudents() {
    const { blobs } = await list();
    const file = blobs.find(b => b.pathname === 'students.json');
    let students = [];
    if (file) {
      const response = await fetch(file.url);
      const text = await response.text();
      try {
        students = JSON.parse(text);
      } catch (err) {
        console.error("Ошибка парсинга students.json:", err);
        students = [];
      }
    }
    return students;
  }

  // GET
  if (req.method === 'GET') {
    const students = await readStudents();
    return res.status(200).json(students);
  }

  // POST
  if (req.method === 'POST') {
    if (role !== 'admin') return res.status(403).json({ error: 'Нет прав' });
    const { name } = req.body;
    let students = await readStudents();
    students.push({ name, status: 'Активен', role: 'student' });
    await put('students.json', JSON.stringify(students), {
      access: 'public',
      allowOverwrite: true
    });
    return res.status(200).json({ success: true, students });
  }

  // PUT
  if (req.method === 'PUT') {
    if (role !== 'admin') return res.status(403).json({ error: 'Нет прав' });
    const { name, status, role: newRole } = req.body;
    let students = await readStudents();
    students = students.map(s =>
      s.name === name ? { ...s, status: status || s.status, role: newRole || s.role } : s
    );
    await put('students.json', JSON.stringify(students), {
      access: 'public',
      allowOverwrite: true
    });
    return res.status(200).json({ success: true, students });
  }

  // DELETE
  if (req.method === 'DELETE') {
    if (role !== 'admin') return res.status(403).json({ error: 'Нет прав' });
    const { name } = req.body;
    let students = await readStudents();
    students = students.filter(s => s.name !== name);
    await put('students.json', JSON.stringify(students), {
      access: 'public',
      allowOverwrite: true
    });
    return res.status(200).json({ success: true, students });
  }

  res.status(405).json({ error: 'Метод не поддерживается' });
}
