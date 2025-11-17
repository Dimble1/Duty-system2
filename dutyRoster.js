// dutyRoster.js — генерация и работа с расписанием через Blob Store API

// Получить расписание из Blob
async function getRoster() {
  const res = await fetch('/api/roster');
  return await res.json();
}

// Сохранить расписание в Blob
async function saveRoster(roster) {
  await fetch('/api/roster', {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(roster)
  });
}

// Генерация ключа даты (например, "2025-11-16")
function getDateKey(date = new Date()) {
  return date.toISOString().split('T')[0];
}

// Генерация расписания на неделю
async function generateRoster(students) {
  const roster = {};
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateKey = getDateKey(date);

    // простая логика: назначаем первых двух студентов
    roster[dateKey] = students.slice(i % students.length, (i % students.length) + 2)
                              .map(s => s.name);
  }

  // сохраняем в Blob
  await saveRoster(roster);
  return roster;
}
