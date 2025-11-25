import sendToTelegram from '../../lib/telegram';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const attendance = req.body; // [{ name, status, reason, date }]
  const date = attendance[0]?.date || "неизвестно";

  // Формируем таблицу
  let table = `📅 Дата: ${date}\n\n`;
  table += "Имя | Статус | Причина\n";
  table += "---------------------------\n";
  attendance.forEach(s => {
    table += `${s.name} | ${s.status} | ${s.reason || "-"}\n`;
  });

  // Отправляем в Telegram
  await sendToTelegram(table);

  res.status(200).json({ ok: true });
}
