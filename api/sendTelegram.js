import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Метод не поддерживается" });

  const { students } = req.body;
  if (!students || !Array.isArray(students)) {
    return res.status(400).json({ error: "Нет списка студентов" });
  }

  const today = new Date().toLocaleDateString("ru-RU");

  // Формируем CSV
  let csv = "Дата,Имя,Статус\n";
  students.forEach(s => {
    csv += `${today},"${s.name}",${s.status || "Пришёл"}\n`;
  });

  // Сохраняем во временный файл
  const filePath = path.join("/tmp", `report_${Date.now()}.csv`);
  fs.writeFileSync(filePath, csv);

  // Отправляем файл в Telegram
  const formData = new FormData();
  formData.append("chat_id", process.env.TELEGRAM_CHAT_ID);
  formData.append("document", new Blob([csv], { type: "text/csv" }), `report_${today}.csv`);

  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendDocument`;
  const response = await fetch(url, { method: "POST", body: formData });

  const data = await response.json();
  if (!data.ok) {
    return res.status(500).json({ error: "Ошибка Telegram API", details: data });
  }

  return res.status(200).json({ success: true, telegram: data });
}

