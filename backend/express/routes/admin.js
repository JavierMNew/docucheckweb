const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/authMiddleware');
const Document = require('../models/Document');
const User = require('../models/User');

// Get documents that need review
router.get('/review', isAdmin, async (req, res) => {
  try {
    const documents = await Document.find({ needsReview: true })
      .populate('userId', 'username email');
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (admin only)
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all documents (admin only)
router.get('/documents', isAdmin, async (req, res) => {
  try {
    const documents = await Document.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get documents by user (admin only)
router.get('/documents/user/:userId', isAdmin, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.params.userId })
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Make user admin (admin only)
router.post('/make-admin/:userId', isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.isAdmin = true;
    await user.save();
    
    res.json({ message: 'User is now an admin', user: user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Review document
router.post('/review/:documentId', isAdmin, async (req, res) => {
  try {
    const { approved } = req.body;
    const document = await Document.findById(req.params.documentId);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    document.needsReview = false;
    document.reviewedBy = req.session.userId;
    document.reviewedAt = Date.now();
    document.approved = approved;
    
    await document.save();
    
    res.json({ message: 'Document reviewed', approved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
