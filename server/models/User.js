const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  name: String,
  address: String,
  grado: String,
  acudiente: String,
  ccAcudiente: String,
    nombreEstudiante: String,
    edadEstudiante: { type: Number },
    direccionEstudiante: { type: String },
    tipoDocEstudiante: { type: String, enum: ['PPT', 'TI', 'CC'] },
    ccEstudiante: String
});

module.exports = mongoose.model('User', userSchema);
