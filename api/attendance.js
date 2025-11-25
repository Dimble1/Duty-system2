import sendToTelegramText from '../../lib/telegramText';
import sendToTelegramFile from '../../lib/telegramFile';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const attendance = req.body; // [{ name, status, reason, date }]
  const date = attendance[0]?.date || "неизвестно";

  // Формируем CSV
  let csv = "Имя,Статус,Причина,Дата\n";
  attendance.forEach(s => {
    csv += `${s.name},${s.status},${s.reason || "-"},${s.date}\n`;
  });

  // Отправляем текстовую таблицу
  let table = `📅 Дата: ${date}\n\nИмя | Статус | Причина\n---------------------------\n`;
  attendance.forEach(s => {
    table += `${s.name} | ${s.status} | ${s.reason || "-"}\n`;
  });
  await sendToTelegramText(table);

  // Отправляем CSV как документ
  await sendToTelegramFile(csv, `attendance-${date}.csv`);

  res.status(200).json({ ok: true });
}
