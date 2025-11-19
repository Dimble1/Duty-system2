const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

// ⚡ Загружаем студентов один раз в память
let students = JSON.parse(fs.readFileSync('students.json', 'utf8'));

// Получить список студентов
app.get('/api/students', (req, res) => {
  res.json(students);
});

// Обновить статус/роль студента
app.put('/api/students', (req, res) => {
  const { name, status, role } = req.body;

  // Находим студента и обновляем
  const idx = students.findIndex(s => s.name === name);
  if (idx !== -1) {
    students[idx].status = status;
    students[idx].role = role;
  }

  // ⚡ Асинхронно сохраняем в файл (не блокируем сервер)
  fs.writeFile('students.json', JSON.stringify(students, null, 2), err => {
    if (err) console.error('Ошибка записи:', err);
  });

  // ⚡ Сразу возвращаем обновлённый список
  res.json(students);
});

app.listen(3000, () => console.log('Server running on port 3000'));
