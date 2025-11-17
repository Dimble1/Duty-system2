export default function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      return res.status(200).json({ role: "admin" });
    }
    if (username === process.env.ZAM_USERNAME && password === process.env.ZAM_PASSWORD) {
      return res.status(200).json({ role: "zam" });
    }

    // остальные → студент
    return res.status(200).json({ role: "student" });
  }
  res.status(405).json({ error: "Метод не поддерживается" });
}
