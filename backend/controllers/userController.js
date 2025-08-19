const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Utilidad para enviar correo (opcional, solo si MAIL_FROM y SMTP configurados)
const sendCredentialsEmail = async (user, password) => {
  if (!process.env.SMTP_HOST) return;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: user.email,
    subject: 'Credenciales ICIT Uniformes',
    html: `<p>Hola ${user.acudienteNombre},<br>Tu usuario ha sido creado.<br>Email: ${user.email}<br>Contraseña temporal: ${password}</p>`
  });
};

exports.list = async (req, res) => {
  const { q, gradoSeccion, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (q) filter.$text = { $search: q };
  if (gradoSeccion) filter.gradoSeccion = gradoSeccion;
  const total = await User.countDocuments(filter);
  const data = await User.find(filter).skip((page-1)*limit).limit(Number(limit)).sort({ createdAt: -1 });
  res.json({ data, total });
};

exports.create = async (req, res) => {
  try {
    const { email, password, acudienteNombre, acudienteDocumento, estudianteNombre, estudianteDocumento, estudianteNacimiento, gradoSeccion, direccion, telefono, role } = req.body;
    if (await User.findOne({ email })) {
      return res.status(409).json({ error: 'Email ya registrado' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, passwordHash, acudienteNombre, acudienteDocumento, estudianteNombre, estudianteDocumento, estudianteNacimiento, gradoSeccion, direccion, telefono, role: role || 'user'
    });
    if (process.env.SMTP_HOST) {
      try {
        await sendCredentialsEmail(user, password);
      } catch (mailErr) {
        console.warn('No se pudo enviar el correo de credenciales:', mailErr.message);
      }
    }
    res.status(201).json(user);
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).json({ error: err.message || 'Error interno' });
  }
};

exports.update = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'No encontrado' });
  Object.assign(user, req.body);
  await user.save();
  res.json(user);
};

exports.remove = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'No encontrado' });
  await user.deleteOne();
  res.status(204).end();
};
