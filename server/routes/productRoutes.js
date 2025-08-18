const express = require('express');
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

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

router.post('/products', verifyToken, isAdmin, upload.single('image'), [
  body('name').notEmpty(),
  body('price').isNumeric(),
], productController.createProduct);

router.get('/products', productController.listProducts);

module.exports = router;
