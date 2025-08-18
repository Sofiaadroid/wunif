const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password, name, address } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name, address });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Contraseña incorrecta' });
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '2h' });
  res.json({ token, user: { email: user.email, role: user.role, name: user.name } });
};

exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password, name, address, grado, acudiente, ccAcudiente, nombreEstudiante, edadEstudiante, direccionEstudiante, tipoDocEstudiante, ccEstudiante } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashed,
      name,
      address,
      grado,
      acudiente,
      ccAcudiente,
      nombreEstudiante,
        edadEstudiante,
        direccionEstudiante,
        tipoDocEstudiante,
        ccEstudiante
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
