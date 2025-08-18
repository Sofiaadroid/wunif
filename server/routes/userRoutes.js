const User = require('../models/User');
// Listar usuarios (solo admin)
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware de autenticación
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.user = decoded;
    next();
  });
};
const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  return res.status(403).json({ error: 'Solo el admin puede realizar esta acción.' });
};

router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
], userController.register);

router.post('/login', [
  body('email').isEmail(),
  body('password').exists(),
], userController.login);

router.post('/users', verifyToken, isAdmin, [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
], userController.createUser);

module.exports = router;
