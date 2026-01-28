// models/Position.js
const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
    electionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Election',
        required: [true, 'Election ID is required']
    },
    title: {
        type: String,
        required: [true, 'Position title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Position description is required']
    },
    maxCandidates: {
        type: Number,
        default: 10,
        min: 1
    },
    order: {
        type: Number,
        default: 0,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Ensure unique position titles within an election
positionSchema.index({ electionId: 1, title: 1 }, { unique: true });

// IMPORTANT: Export the model correctly
module.exports = mongoose.model('Position', positionSchema);