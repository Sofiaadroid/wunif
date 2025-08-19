// Script para crear un usuario admin manualmente en la base de datos
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  const email = 'admin@icit.com';
  const password = 'Admin1234';
  const passwordHash = await bcrypt.hash(password, 10);
  const exists = await User.findOne({ email });
  if (exists) {
    console.log('Ya existe un admin con ese correo.');
    process.exit(0);
  }
  await User.create({
    email,
    passwordHash,
    acudienteNombre: 'Administrador',
    acudienteDocumento: 'ADMIN',
    estudianteNombre: 'Admin',
    estudianteDocumento: 'ADMIN',
    estudianteNacimiento: '2000-01-01',
    gradoSeccion: 'ADMIN',
    direccion: 'Colegio ICIT',
    telefono: '0000000000',
    role: 'admin',
    isActive: true
  });
  console.log('Usuario admin creado:');
  console.log('Email:', email);
  console.log('Contraseña:', password);
  process.exit(0);
}

createAdmin();
