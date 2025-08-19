const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  fromName: { type: String, required: true },
  fromEmail: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  handled: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
