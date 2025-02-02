const express = require('express');
const router = express.Router();
const axios = require('axios');
const { CHATPDF_API_KEY } = require('../config');
const { isAuthenticated } = require('../middleware/authMiddleware');
const Document = require('../models/Document');

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { sourceId, question } = req.body;

    if (!sourceId || !question) {
      return res.status(400).json({ 
        error: 'sourceId and question are required' 
      });
    }

    // Verificar que el documento pertenece al usuario
    const document = await Document.findOne({
      sourceId,
      userId: req.session.userId
    });

    if (!document) {
      return res.status(404).json({ 
        error: 'Document not found or unauthorized' 
      });
    }

    // Hacer la pregunta a ChatPDF
    const response = await axios.post(
      'https://api.chatpdf.com/v1/chats/message',
      {
        sourceId,
        messages: [{ role: 'user', content: question }]
      },
      {
        headers: {
          'x-api-key': CHATPDF_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ 
      content: response.data.content,
      sourceId: sourceId
    });

  } catch (error) {
    console.error('Ask error:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

module.exports = router;
