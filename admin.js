// admin.js
import { saveFile, fetchJson, getFiles } from './blob-api.js';

const STUDENTS_FILE = 'students.json';

/**
 * Добавить студента
 */
export async function addStudent(name) {
  let students = [];
  const files = await getFiles();
  const studentFile = files.blobs.find(b => b.pathname === STUDENTS_FILE);

  if (studentFile) {
    students = await fetchJson(studentFile.url);
  }

  students.push({ name, role: 'student' });
  await saveFile(STUDENTS_FILE, students);
  console.log(`Студент ${name} добавлен`);
}

/**
 * Назначить роль (например admin или zam)
 */
export async function assignRole(name, role) {
  const files = await getFiles();
  const studentFile = files.blobs.find(b => b.pathname === STUDENTS_FILE);

  if (!studentFile) throw new Error('Файл студентов не найден');

  let students = await fetchJson(studentFile.url);
  students = students.map(s => (s.name === name ? { ...s, role } : s));

  await saveFile(STUDENTS_FILE, students);
  console.log(`Роль ${role} назначена студенту ${name}`);
}
