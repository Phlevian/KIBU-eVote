const Candidate = require('../models/Candidate');
const Election = require('../models/Election');
const Position = require('../models/Position');

// @desc    Get all candidates for an election
// @route   GET /api/candidates/election/:electionId
// @access  Private
exports.getCandidatesByElection = async (req, res) => {
    try {
        const candidates = await Candidate.find({ 
            electionId: req.params.electionId,
            status: 'approved'
        })
        .populate('studentId', 'firstName lastName registrationNumber profilePhoto')
        .populate('positionId', 'title description')
        .sort({ positionId: 1 });

        res.status(200).json({
            success: true,
            count: candidates.length,
            data: candidates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch candidates',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get candidates for a specific position
// @route   GET /api/candidates/position/:positionId
// @access  Private
exports.getCandidatesByPosition = async (req, res) => {
    try {
        const candidates = await Candidate.find({ 
            positionId: req.params.positionId,
            status: 'approved'
        })
        .populate('studentId', 'firstName lastName registrationNumber profilePhoto')
        .sort({ votes: -1 });

        res.status(200).json({
            success: true,
            count: candidates.length,
            data: candidates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch candidates',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Create a new candidate (Admin only)
// @route   POST /api/candidates
// @access  Private/Admin
exports.createCandidate = async (req, res) => {
    try {
        const { studentId, electionId, positionId, manifesto, photo } = req.body;

        // Verify election exists
        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(404).json({
                success: false,
                message: 'Election not found'
            });
        }

        // Verify position exists
        const position = await Position.findById(positionId);
        if (!position) {
            return res.status(404).json({
                success: false,
                message: 'Position not found'
            });
        }

        // Check if student is already a candidate for this position
        const existingCandidate = await Candidate.findOne({
            studentId,
            positionId
        });

        if (existingCandidate) {
            return res.status(400).json({
                success: false,
                message: 'Student is already a candidate for this position'
            });
        }

        const candidate = await Candidate.create({
            studentId,
            electionId,
            positionId,
            manifesto,
            photo,
            status: 'approved' // Auto-approve for now
        });

        const populatedCandidate = await Candidate.findById(candidate._id)
            .populate('studentId', 'firstName lastName registrationNumber profilePhoto')
            .populate('positionId', 'title');

        res.status(201).json({
            success: true,
            message: 'Candidate created successfully',
            data: populatedCandidate
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create candidate',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = exports;