const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Utilidad para enviar recibo por correo
const sendReceipt = async (order, user) => {
  if (!process.env.SMTP_HOST) return;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  const itemsRows = order.items.map(item =>
    `<tr><td>${item.name}</td><td>${item.model}</td><td>${item.size}</td><td>${item.quantity}</td><td>$${item.unitPrice}</td></tr>`
  ).join('');
  const html = `
    <h2>ICIT – Recibo de compra #${order._id.toString().slice(-6)}</h2>
    <p>Fecha: ${order.createdAt.toLocaleString('es-CO')}</p>
    <p>Acudiente: ${user.acudienteNombre} (${user.acudienteDocumento})<br>
    Estudiante: ${user.estudianteNombre} (${user.gradoSeccion})</p>
    <table border="1" cellpadding="4" cellspacing="0">
      <tr><th>Producto</th><th>Modelo</th><th>Talla</th><th>Cantidad</th><th>Precio</th></tr>
      ${itemsRows}
    </table>
    <p><b>Total:</b> $${order.total}</p>
    <p><b>Método de pago:</b> ${order.paymentMethod}</p>
    <hr>
    <small>ICIT | contacto@icit.edu.co | Política de devoluciones disponible en el sitio web.</small>
  `;
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: user.email,
    subject: `ICIT – Recibo de compra #${order._id.toString().slice(-6)}`,
    html
  });
};

exports.create = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Carrito vacío' });
    }
    if (!['PSE','DEBITO','CREDITO'].includes(paymentMethod)) {
      return res.status(400).json({ error: 'Método de pago no permitido' });
    }
    // Validar productos y armar snapshot
    let total = 0;
    const snapshotItems = [];
    for (const i of items) {
      const prod = await Product.findById(i.product);
      if (!prod || !prod.isActive) return res.status(400).json({ error: 'Producto inválido' });
      snapshotItems.push({
        product: prod._id,
        name: prod.name,
        model: prod.model,
        size: prod.size,
        unitPrice: prod.price,
        quantity: i.quantity
      });
      total += prod.price * i.quantity;
    }
    const order = await Order.create({
      user: req.user.id,
      items: snapshotItems,
      total,
      paymentMethod,
      status: 'PAID'
    });
    const user = await User.findById(req.user.id);
  // if (process.env.SMTP_HOST) await sendReceipt(order, user);
    res.status(201).json({ orderId: order._id, status: 'PAID' });
  } catch (err) {
    console.error('Error creando orden:', err);
    res.status(500).json({ error: err.message || 'Error interno al crear la orden' });
  }
};

exports.mine = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
};
