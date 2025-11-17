import { put, get } from '@vercel/blob';
import defaultStudents from '../defaultStudents.js'; // импортируем список

export default async function handler(req, res) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (req.method === 'GET') {
    try {
      const { body } = await get('students.json', { token });
      const text = await body.text();
      res.status(200).json(JSON.parse(text));
    } catch (err) {
      // Если файла нет — используем defaultStudents
      await put('students.json', JSON.stringify(defaultStudents), {
        contentType: 'application/json',
        token
      });
      res.status(200).json(defaultStudents);
    }
  }

  if (req.method === 'POST') {
    try {
      const data = req.body;
      await put('students.json', JSON.stringify(data), {
        contentType: 'application/json',
        token
      });
      res.status(200).json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: 'Ошибка сохранения студентов' });
    }
  }
}
