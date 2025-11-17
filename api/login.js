export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { username, password, role } = req.body;

  const map = {
    admin: { user: process.env.ADMIN_USER, pass: process.env.ADMIN_PASS },
    zam: { user: process.env.ZAM_USER, pass: process.env.ZAM_PASS }
  };

  if (!map[role]) {
    return res.status(400).json({ ok: false, error: 'Invalid role' });
  }

  const { user, pass } = map[role];
  if (username === user && password === pass) {
    return res.status(200).json({ ok: true, role });
  } else {
    return res.status(401).json({ ok: false, error: 'Invalid credentials' });
  }
}
