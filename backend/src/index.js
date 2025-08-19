require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

// Middlewares
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', date: new Date() });
});

// Rutas
const authRoutes = require('../routes/auth');
const usersRoutes = require('../routes/users');
const productsRoutes = require('../routes/products');
const ordersRoutes = require('../routes/orders');
const contactRoutes = require('../routes/contact');
const statsRoutes = require('../routes/stats');
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/stats', statsRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB conectado');
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`Servidor escuchando en puerto ${port}`));
})
.catch((err) => {
  console.error('Error conectando a MongoDB:', err);
  process.exit(1);
});
