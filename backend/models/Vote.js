const mongoose = require('mongoose');
const crypto = require('crypto');

const voteSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    electionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Election',
        required: true
    },
    votes: [{
        positionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Position',
            required: true
        },
        candidateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Candidate',
            required: true
        }
    }],
    voteHash: {
        type: String,
        required: true,
        unique: true
    },
    ipAddress: {
        type: String
    },
    verified: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Generate vote hash before saving
voteSchema.pre('save', function() {
    if (!this.voteHash) {
        const data = `${this.studentId}-${this.electionId}-${Date.now()}`;
        this.voteHash = crypto.createHash('sha256').update(data).digest('hex');
    }
});

// Ensure one vote per election per student
voteSchema.index({ studentId: 1, electionId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);