// controllers/candidateController.js
const Candidate = require('../models/Candidate');
const Election = require('../models/Election');
const Position = require('../models/Position');
const Student = require('../models/Student');

// @desc    Apply as candidate
// @route   POST /api/candidates
// @access  Private
exports.applyAsCandidate = async (req, res) => {
    try {
        const { electionId, positionId, manifesto, photo } = req.body;
        const studentId = req.student.id;

        // Check if election exists and is upcoming
        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(404).json({
                success: false,
                message: 'Election not found'
            });
        }

        if (election.status !== 'upcoming') {
            return res.status(400).json({
                success: false,
                message: 'Cannot apply for active or completed elections'
            });
        }

        // Check if position exists
        const position = await Position.findById(positionId);
        if (!position) {
            return res.status(404).json({
                success: false,
                message: 'Position not found'
            });
        }

        // Check if already applied
        const existingApplication = await Candidate.findOne({
            studentId,
            electionId,
            positionId
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this position'
            });
        }

        // Create candidate application
        const candidate = await Candidate.create({
            studentId,
            electionId,
            positionId,
            manifesto,
            photo: photo || null,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Candidate application submitted successfully',
            data: candidate
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to submit candidate application',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get all candidates for election
// @route   GET /api/candidates/election/:electionId
// @access  Private
exports.getCandidatesByElection = async (req, res) => {
    try {
        const candidates = await Candidate.find({
            electionId: req.params.electionId,
            status: 'approved' // Only show approved candidates
        })
            .populate('studentId', 'firstName lastName registrationNumber profilePhoto faculty course')
            .populate('positionId', 'title description')
            .sort({ positionId: 1, votes: -1 });

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

// @desc    Get candidates for position
// @route   GET /api/candidates/position/:positionId
// @access  Private
exports.getCandidatesByPosition = async (req, res) => {
    try {
        const candidates = await Candidate.find({
            positionId: req.params.positionId,
            status: 'approved'
        })
            .populate('studentId', 'firstName lastName registrationNumber profilePhoto')
            .populate('positionId', 'title description')
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

// @desc    Get single candidate
// @route   GET /api/candidates/:id
// @access  Private
exports.getCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id)
            .populate('studentId', 'firstName lastName registrationNumber profilePhoto faculty course yearOfStudy')
            .populate('positionId', 'title description')
            .populate('electionId', 'title description status');

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        res.status(200).json({
            success: true,
            data: candidate
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch candidate',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Update candidate status (approve/reject)
// @route   PUT /api/candidates/:id/status
// @access  Private/Admin
exports.updateCandidateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const candidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `Candidate ${status} successfully`,
            data: candidate
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update candidate status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Update candidate manifesto (own)
// @route   PUT /api/candidates/:id
// @access  Private
exports.updateCandidate = async (req, res) => {
    try {
        const { manifesto, photo } = req.body;
        const studentId = req.student.id;

        // Find candidate
        const candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        // Check if student owns this candidate application
        if (candidate.studentId.toString() !== studentId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this candidate'
            });
        }

        // Only allow updates for pending candidates
        if (candidate.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Cannot update approved or rejected applications'
            });
        }

        // Update fields
        if (manifesto !== undefined) candidate.manifesto = manifesto;
        if (photo !== undefined) candidate.photo = photo;

        await candidate.save();

        res.status(200).json({
            success: true,
            message: 'Candidate updated successfully',
            data: candidate
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update candidate',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Private/Admin
exports.deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndDelete(req.params.id);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Candidate deleted successfully',
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete candidate',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};