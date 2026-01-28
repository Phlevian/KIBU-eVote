// models/Election.js - TEMPORARY FIX
const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Election title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Election description is required']
    },
    type: {
        type: String,
        required: [true, 'Election type is required'],
        enum: ['student-council', 'sports', 'clubs', 'faculty', 'academic', 'library', 'departmental', 'hostel']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    status: {
        type: String,
        enum: ['upcoming', 'active', 'completed'],
        default: 'upcoming'
    },
    // REMOVE THIS LINE TEMPORARILY:
    // positions: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Position'
    // }],
    eligibleVoters: {
        faculties: [String],
        yearOfStudy: [Number]
    },
    totalVoters: {
        type: Number,
        default: 10000
    },
    totalVotes: {
        type: Number,
        default: 0
    },
    turnoutPercentage: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Update status based on dates before saving
electionSchema.pre('save', function(next) {
    const now = new Date();
    
    if (now < this.startDate) {
        this.status = 'upcoming';
    } else if (now >= this.startDate && now <= this.endDate) {
        this.status = 'active';
    } else {
        this.status = 'completed';
    }
    
    // Calculate turnout percentage
    if (this.totalVoters > 0) {
        this.turnoutPercentage = parseFloat(((this.totalVotes / this.totalVoters) * 100).toFixed(2));
    }
    
    next();
});

module.exports = mongoose.model('Election', electionSchema);