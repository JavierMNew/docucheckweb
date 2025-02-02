const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { MONGODB_URI, SESSION_SECRET } = require('./config');

const app = express();

// Connect to MongoDB
mongoose.connect(MONGODB_URI);

// Session configuration
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const askRoutes = require('./routes/ask');
const adminRoutes = require('./routes/admin');

app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);
app.use('/ask', askRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
