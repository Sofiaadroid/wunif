const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.isActive) {
    return res.status(401).json({ error: 'Correo o contraseña inválidos.' });
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Correo o contraseña inválidos.' });
  }
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
  res.json({ token, role: user.role });
};

// Recuperación de contraseña (opcional, no implementado aún)
exports.forgot = async (req, res) => {
  res.status(501).json({ error: 'No implementado' });
};
