const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    electionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Election',
        required: true
    },
    positionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    regNo: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        default: ''
    },
    photo: {
        type: String,
        default: null
    },
    manifesto: {
        type: String,
        default: ''
    },
    votes: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);