// api/students.js
import { put, list } from '@vercel/blob';
import defaultStudents from '../defaultStudents.js';

export default async function handler(req, res) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ token });
      const studentsBlob = blobs.find(b => b.pathname === 'students.json');

      if (!studentsBlob) {
        // если файла нет — возвращаем дефолтный список
        return res.status(200).json(defaultStudents);
      }

      const response = await fetch(studentsBlob.url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const text = await response.text();
      res.status(200).json(JSON.parse(text || "[]"));
    } catch (err) {
      res.status(500).json({ error: 'Ошибка чтения списка студентов' });
    }
  }

  if (req.method === 'POST') {
    try {
      await put('students.json', JSON.stringify(req.body), {
        contentType: 'application/json',
        token
      });
      res.status(200).json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: 'Ошибка сохранения списка студентов' });
    }
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Метод не поддерживается' });
  }
}
