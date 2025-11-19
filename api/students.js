const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

// получить список студентов
app.get('/api/students', (req, res) => {
  const students = JSON.parse(fs.readFileSync('students.json', 'utf8'));
  res.json(students);
});

// обновить статус/роль студента
app.put('/api/students', (req, res) => {
  const { name, status, role } = req.body;
  let students = JSON.parse(fs.readFileSync('students.json', 'utf8'));

  students = students.map(s =>
    s.name === name ? { ...s, status, role } : s
  );

  fs.writeFileSync('students.json', JSON.stringify(students, null, 2));

  // ⚡ возвращаем обновлённый список
  res.json(students);
});

app.listen(3000, () => console.log('Server running on port 3000'));
