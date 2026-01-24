const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['student-council', 'sports', 'clubs', 'faculty']
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'active', 'completed'],
        default: 'upcoming'
    },
    // Positions in this election
    positions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position'
    }],
    // Who can vote
    eligibleVoters: {
        faculties: [String],
        yearOfStudy: [Number]
    },
    // Statistics
    totalVoters: {
        type: Number,
        default: 0
    },
    totalVotes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Update status based on dates
electionSchema.methods.updateStatus = function() {
    const now = new Date();
    if (now < this.startDate) {
        this.status = 'upcoming';
    } else if (now >= this.startDate && now <= this.endDate) {
        this.status = 'active';
    } else {
        this.status = 'completed';
    }
    return this.save();
};

module.exports = mongoose.model('Election', electionSchema);