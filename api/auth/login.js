const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByEmail, saveUser } = require('../../lib/userStore');

async function login(req, res) {
  const { email, password, role } = req.body;
  const user = await getUserByEmail(email);
  if (!user || user.role !== role) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Update login streak
  const now = new Date();
  const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
  let streak = user.loginStreak || 0;
  if (lastLogin) {
    const diffTime = now - lastLogin;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      streak = 1;
    }
  } else {
    streak = 1;
  }
  user.lastLogin = now.toISOString();
  user.loginStreak = streak;
  saveUser(user);

  // Generate JWT
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.SESSION_SECRET);
  res.json({ success: true, user: { id: user.id, name: user.name, role: user.role }, token });
}

module.exports = login;
