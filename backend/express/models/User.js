const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true }, // Puede ser nulo para usuarios de Google
  email: { type: String, required: true, unique: true },
  password: { type: String }, // No requerida si el usuario inicia con Google
  googleId: { type: String, unique: true, sparse: true }, // ID de Google opcional
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
