const Message = require('../models/Message');
const nodemailer = require('nodemailer');

// Utilidad para notificar al admin (opcional)
const notifyAdmin = async (msg) => {
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
    to: process.env.MAIL_FROM,
    subject: `Nuevo mensaje de contacto: ${msg.subject}`,
    html: `<b>De:</b> ${msg.fromName} (${msg.fromEmail})<br><b>Asunto:</b> ${msg.subject}<br><p>${msg.body}</p>`
  });
};

exports.create = async (req, res) => {
  const { fromName, fromEmail, subject, body } = req.body;
  const message = await Message.create({ fromName, fromEmail, subject, body });
  if (process.env.SMTP_HOST) await notifyAdmin(message);
  res.status(201).json({ message: 'Recibido' });
};

exports.list = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const total = await Message.countDocuments();
  const data = await Message.find().skip((page-1)*limit).limit(Number(limit)).sort({ createdAt: -1 });
  res.json({ data, total });
};

exports.handle = async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) return res.status(404).json({ error: 'No encontrado' });
  message.handled = true;
  await message.save();
  res.json(message);
};
