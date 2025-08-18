
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas solicitudes, intenta más tarde.'
});
app.use(limiter);

const PORT = process.env.PORT || 3003;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Forzar creación de admin en cada inicio
const User = require('./models/User');
const bcrypt = require('bcryptjs');
(async () => {
  await User.deleteOne({ email: process.env.ADMIN_EMAIL });
  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  await User.create({ email: process.env.ADMIN_EMAIL, password: hashed, role: 'admin', name: 'Admin' });
  console.log('Admin forzado y creado');
})();

// Rutas principales
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

// Documentación Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WUNIF API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
