const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.summary = async (req, res) => {
  const { from, to } = req.query;
  const fromDate = from ? new Date(from) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const toDate = to ? new Date(to) : new Date();

  // Ventas del mes y total órdenes
  const orders = await Order.find({
    status: 'PAID',
    createdAt: { $gte: fromDate, $lte: toDate }
  });
  const totalVentas = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdenes = orders.length;

  // Ventas por mes (últimos 12 meses)
  const ventasPorMes = await Order.aggregate([
    { $match: { status: 'PAID', createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear()-1)) } } },
    { $group: {
      _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
      total: { $sum: '$total' }
    } },
    { $sort: { _id: 1 } }
  ]);

  // Top productos
  const topProductos = await Order.aggregate([
    { $match: { status: 'PAID', createdAt: { $gte: fromDate, $lte: toDate } } },
    { $unwind: '$items' },
    { $group: {
      _id: '$items.product',
      name: { $first: '$items.name' },
      cantidad: { $sum: '$items.quantity' }
    } },
    { $sort: { cantidad: -1 } },
    { $limit: 5 }
  ]);

  // Compras por usuario
  const comprasPorUsuario = await Order.aggregate([
    { $match: { status: 'PAID', createdAt: { $gte: fromDate, $lte: toDate } } },
    { $group: {
      _id: '$user',
      total: { $sum: '$total' }
    } },
    { $sort: { total: -1 } },
    { $limit: 10 }
  ]);
  // Enriquecer con nombre acudiente
  const users = await User.find({ _id: { $in: comprasPorUsuario.map(u => u._id) } });
  const comprasPorUsuarioEnriq = comprasPorUsuario.map(u => ({
    userId: u._id,
    nombreAcudiente: users.find(us => us._id.equals(u._id))?.acudienteNombre || '',
    total: u.total
  }));

  res.json({
    totalVentas,
    totalOrdenes,
    ventasPorMes,
    topProductos,
    comprasPorUsuario: comprasPorUsuarioEnriq
  });
};
