// models/index.js
const mongoose = require('mongoose');

// Load all models
require('./Student');
require('./Election');
require('./Position');  // This ensures Position model is registered
require('./Candidate');
require('./Vote');

console.log('✅ All models loaded successfully');

module.exports = {
    Student: mongoose.model('Student'),
    Election: mongoose.model('Election'),
    Position: mongoose.model('Position'),
    Candidate: mongoose.model('Candidate'),
    Vote: mongoose.model('Vote')
};