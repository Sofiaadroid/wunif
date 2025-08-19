const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  acudienteNombre: { type: String, required: true },
  acudienteDocumento: { type: String, required: true },
  estudianteNombre: { type: String, required: true },
  estudianteDocumento: { type: String, required: true },
  estudianteNacimiento: { type: Date, required: true },
  gradoSeccion: { type: String, required: true },
  direccion: { type: String, required: true },
  telefono: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ acudienteNombre: 'text', estudianteNombre: 'text' });

module.exports = mongoose.model('User', userSchema);
