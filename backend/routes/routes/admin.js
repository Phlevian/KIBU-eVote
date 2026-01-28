// In your backend app.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin login route
app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Hardcoded admin for testing
    if (email === 'admin@kibu.edu' && password === 'admin123') {
        const token = jwt.sign(
            { email, role: 'admin' }, 
            'your-secret-key',
            { expiresIn: '24h' }
        );
        return res.json({ success: true, token });
    }
    
    res.status(401).json({ success: false, error: 'Invalid credentials' });
});

// Protected admin routes
const authAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    
    try {
        const decoded = jwt.verify(token, 'your-secret-key');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Add position (admin only)
app.post('/api/positions', authAdmin, async (req, res) => {
    try {
        const position = new Position(req.body);
        await position.save();
        res.json({ success: true, position });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add candidate (admin only)
app.post('/api/candidates', authAdmin, async (req, res) => {
    try {
        const candidate = new Candidate(req.body);
        await candidate.save();
        res.json({ success: true, candidate });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});