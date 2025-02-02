require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const { MONGODB_URI } = require('../config');

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);

    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123', // Cambiar por una contraseña segura
      isAdmin: true
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    
  } catch (error) {
    console.error('Error creating admin:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
