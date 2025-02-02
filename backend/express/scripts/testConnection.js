
const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB on Railway');
    await mongoose.connection.db.command({ ping: 1 });
    console.log('Database ping successful');
  } catch (error) {
    console.error('Connection error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testConnection();