export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body;

  // ⚡ Простая база пользователей (можно вынести в .env)
  const users = {
    admin: { password: "admin123", role: "admin" },
    zam: { password: "zam123", role: "zam" },
    teacher: { password: "teacher123", role: "teacher" }
  };

  if (users[username] && users[username].password === password) {
    res.status(200).json({ role: users[username].role });
  } else {
    res.status(401).json({ error: "Неверный логин или пароль" });
  }
}
