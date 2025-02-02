const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user._id;
    req.session.isAdmin = user.isAdmin;
    
    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  try {
    // Verificar si hay una sesión activa
    if (req.session) {
      // Limpiar la sesión
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ 
            error: 'Error during logout',
            details: err.message 
          });
        }
        
        // Limpiar la cookie de sesión
        res.clearCookie('connect.sid');
        res.json({ 
          message: 'Logout successful',
          status: 'success'
        });
      });
    } else {
      res.status(200).json({ 
        message: 'No active session',
        status: 'success'
      });
    }
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error during logout',
      details: error.message 
    });
  }
});

module.exports = router;
