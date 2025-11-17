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
        // 👉 если файла нет — создаём его с дефолтным списком
        await put('students.json', JSON.stringify(defaultStudents), {
          contentType: 'application/json',
          token
        });
        return res.status(200).json(defaultStudents);
      }

      const response = await fetch(studentsBlob.url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const text = await response.text();
      const parsed = JSON.parse(text || "[]");

      // 👉 если файл пустой — возвращаем дефолтный список
      if (!parsed || parsed.length === 0) {
        await put('students.json', JSON.stringify(defaultStudents), {
          contentType: 'application/json',
          token
        });
        return res.status(200).json(defaultStudents);
      }

      res.status(200).json(parsed);
    } catch (err) {
      // 👉 при любой ошибке — fallback
      res.status(200).json(defaultStudents);
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
