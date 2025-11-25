export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body;

  // ⚡ Берём данные из .env
  const users = {
    [process.env.ADMIN_USERNAME]: { password: process.env.ADMIN_PASSWORD, role: "admin" },
    [process.env.ZAM_USERNAME]: { password: process.env.ZAM_PASSWORD, role: "zam" },
    [process.env.TEACHER_USERNAME]: { password: process.env.TEACHER_PASSWORD, role: "teacher" }
  };

  if (users[username] && users[username].password === password) {
    res.status(200).json({ role: users[username].role });
  } else {
    res.status(401).json({ error: "Неверный логин или пароль" });
  }
}

