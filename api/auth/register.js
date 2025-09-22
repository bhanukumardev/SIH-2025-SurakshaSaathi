const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { saveUser, getUserByEmail } = require('../../lib/userStore');

async function register(req, res) {
  const { name, email, password, role } = req.body;
  if (!['student', 'teacher', 'parent', 'admin'].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }
  if (await getUserByEmail(email)) {
    return res.status(400).json({ message: "Email already registered" });
  }
  const hash = await bcrypt.hash(password, 12);
  const user = { id: uuidv4(), name, email, passwordHash: hash, role };
  await saveUser(user);
  res.json({ success: true });
}

module.exports = register;
