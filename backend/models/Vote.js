const mongoose = require('mongoose');
const crypto = require('crypto');

const voteSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Student ID is required']
    },
    electionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Election',
        required: [true, 'Election ID is required']
    },
    votes: [{
        positionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Position',
            required: [true, 'Position ID is required']
        },
        candidateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Candidate',
            required: [true, 'Candidate ID is required']
        },
        votedAt: {
            type: Date,
            default: Date.now
        }
    }],
    voteHash: {
        type: String,
        required: true,
        unique: true
    },
    ipAddress: {
        type: String,
        default: ''
    },
    userAgent: {
        type: String,
        default: ''
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Generate vote hash before saving
voteSchema.pre('save', function(next) {
    if (!this.voteHash) {
        const data = `${this.studentId}-${this.electionId}-${Date.now()}-${Math.random()}`;
        this.voteHash = crypto.createHash('sha256').update(data).digest('hex');
    }
    next();
});

// Ensure one vote per election per student
voteSchema.index({ studentId: 1, electionId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);