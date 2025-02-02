const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const { CHATPDF_API_KEY, UPLOAD_DIR } = require('../config');
const { isAuthenticated } = require('../middleware/authMiddleware');
const Document = require('../models/Document');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(UPLOAD_DIR, req.session.userId.toString());
    fs.mkdirSync(userDir, { recursive: true });
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/', isAuthenticated, upload.single('file'), async (req, res) => {
  try {
    if (!CHATPDF_API_KEY) {
      throw new Error('ChatPDF API key is not configured');
    }

    const file = req.file;
    const form = new FormData();
    form.append('file', fs.createReadStream(file.path));

    // Enviar a ChatPDF con verificación de API key
    const response = await axios.post(
      'https://api.chatpdf.com/v1/sources/add-file',
      form,
      {
        headers: {
          'x-api-key': CHATPDF_API_KEY,
          ...form.getHeaders()
        },
        validateStatus: function (status) {
          return status < 500; // Acepta cualquier status que no sea 5xx
        }
      }
    );

    // Verificar respuesta de ChatPDF
    if (response.status === 401) {
      throw new Error('Invalid ChatPDF API key');
    }

    if (response.status !== 200) {
      throw new Error(`ChatPDF API error: ${response.data.message || 'Unknown error'}`);
    }

    // Check upload count
    const existingDocs = await Document.find({
      userId: req.session.userId,
      originalName: file.originalname
    });

    const uploadCount = existingDocs.length + 1;
    const needsReview = uploadCount >= 6;

    // Guardar documento
    const document = new Document({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      userId: req.session.userId,
      sourceId: response.data.sourceId,
      uploadCount,
      needsReview
    });

    await document.save();

    res.json({ 
      sourceId: response.data.sourceId,
      needsReview
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Mejor manejo de errores
    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Invalid ChatPDF API key',
        details: error.response.data
      });
    }

    res.status(500).json({
      error: error.message,
      details: error.response?.data || 'Check server logs for details'
    });
  }
});

// Get user's documents
router.get('/my-documents', isAuthenticated, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.session.userId })
      .select('filename originalName sourceId createdAt needsReview approved')
      .sort({ createdAt: -1 });
    
    res.json({
      total: documents.length,
      documents: documents
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific document details
router.get('/document/:id', isAuthenticated, async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.session.userId
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
