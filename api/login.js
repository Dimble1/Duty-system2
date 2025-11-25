import jwt from "jsonwebtoken";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body;

  const users = {
    [process.env.ADMIN_USER]: { password: process.env.ADMIN_PASS, role: "admin" },
    [process.env.ZAM_USER]: { password: process.env.ZAM_PASS, role: "zam" },
    [process.env.TEACHER_USER]: { password: process.env.TEACHER_PASS, role: "teacher" }
  };

  if (users[username] && users[username].password === password) {
    const role = users[username].role;
    const token = jwt.sign({ username, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ role, token });
  } else {
    res.status(401).json({ error: "Неверный логин или пароль" });
  }
}
