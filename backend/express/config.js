require('dotenv').config();

const config = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/chatpdf_app',
  SESSION_SECRET: process.env.SESSION_SECRET || 'your_session_secret',
  CHATPDF_API_KEY: process.env.CHATPDF_API_KEY,
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID, 
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET 
};

// Validar configuración crítica
if (!config.CHATPDF_API_KEY) {
  console.error('ERROR: ChatPDF API key is not configured');
  process.exit(1);
}


module.exports = config;
