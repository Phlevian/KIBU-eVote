const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
    electionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Election',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    maxCandidates: {
        type: Number,
        default: 10
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for candidates
positionSchema.virtual('candidates', {
    ref: 'Candidate',
    localField: '_id',
    foreignField: 'positionId'
});

module.exports = mongoose.model('Position', positionSchema);