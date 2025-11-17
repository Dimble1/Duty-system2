// blob-api.js
import { put, list, del } from '@vercel/blob';

// Токен берём из переменной окружения
const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Сохранение JSON-файла в Blob Store
 * @param {string} name - имя файла (например "students.json")
 * @param {object} content - объект, который будет сохранён
 * @returns {Promise<object>} - информация о загруженном файле
 */
export async function saveFile(name, content) {
  const blob = await put(
    name,
    new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' }),
    {
      access: 'public',
      token: TOKEN,
    }
  );
  return blob;
}

/**
 * Получение списка всех файлов в Blob Store
 * @returns {Promise<object>} - список файлов
 */
export async function getFiles() {
  const files = await list({ token: TOKEN });
  return files;
}

/**
 * Удаление файла из Blob Store
 * @param {string} name - имя файла (например "students.json")
 * @returns {Promise<void>}
 */
export async function deleteFile(name) {
  await del(name, { token: TOKEN });
}

/**
 * Загрузка содержимого JSON-файла по URL
 * @param {string} url - публичный URL файла
 * @returns {Promise<object>} - содержимое JSON
 */
export async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`);
  return await res.json();
}
