const express = require('express');
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');
const jwt = require('jsonwebtoken');

const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.user = decoded;
    next();
  });
};

router.post('/orders', verifyToken, [
  body('products').isArray({ min: 1 }),
  body('payment.name').notEmpty(),
  body('payment.card').isLength({ min: 16, max: 16 }),
  body('payment.exp').notEmpty(),
  body('payment.cvv').isLength({ min: 3, max: 3 }),
], orderController.createOrder);

router.get('/orders', verifyToken, orderController.listOrders);

module.exports = router;
