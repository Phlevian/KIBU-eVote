const mongoose = require('mongoose');
require('./Student');
require('./Election');
require('./Position');
require('./Candidate');
require('./Vote');

module.exports = {
    Student: mongoose.model('Student'),
    Election: mongoose.model('Election'),
    Position: mongoose.model('Position'),
    Candidate: mongoose.model('Candidate'),
    Vote: mongoose.model('Vote')
};