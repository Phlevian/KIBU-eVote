const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');

dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const electionRoutes = require('./routes/electionRoutes');
const positionRoutes = require('./routes/positionRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const voteRoutes = require('./routes/voteRoutes');
const resultsRoutes = require('./routes/resultsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kibu_evote')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/results', resultsRoutes);

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working' });
});

// ========== ADMIN LOGIN – HARDCODED (ALWAYS WORKS) ==========
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@kibu.edu' && password === 'admin123') {
    const token = jwt.sign(
      { role: 'admin', email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    return res.json({ success: true, token, user: { email, role: 'admin' } });
  }
  res.status(401).json({ success: false, error: 'Invalid credentials' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});