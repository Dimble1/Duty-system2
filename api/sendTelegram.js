import FormData from "form-data";

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

  // Создаём FormData
  const formData = new FormData();
  formData.append("chat_id", process.env.TELEGRAM_CHAT_ID);
  formData.append("document", Buffer.from(csv), `report_${today}.csv`);

  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendDocument`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    if (!data.ok) {
      return res.status(500).json({ error: "Ошибка Telegram API", details: data });
    }

    return res.status(200).json({ success: true, telegram: data });
  } catch (err) {
    return res.status(500).json({ error: "Ошибка отправки", details: err.message });
  }
}
