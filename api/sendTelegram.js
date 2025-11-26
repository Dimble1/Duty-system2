export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Метод не поддерживается" });

  const { text } = req.body;

  if (!text) return res.status(400).json({ error: "Нет текста для отправки" });

  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: "HTML" // можно использовать Markdown или HTML для форматирования
      })
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
