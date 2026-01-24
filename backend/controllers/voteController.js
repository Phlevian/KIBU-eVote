const Vote = require('../models/Vote');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');

// @desc    Cast vote
// @route   POST /api/votes/cast
// @access  Private
exports.castVote = async (req, res) => {
    try {
        const { electionId, votes } = req.body;
        const studentId = req.student.id;

        // Check if election exists and is active
        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(404).json({
                success: false,
                message: 'Election not found'
            });
        }

        if (election.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Election is not active'
            });
        }

        // Check if student has already voted
        const existingVote = await Vote.findOne({ studentId, electionId });
        if (existingVote) {
            return res.status(400).json({
                success: false,
                message: 'You have already voted in this election'
            });
        }

        // Get client IP
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Create vote
        const vote = await Vote.create({
            studentId,
            electionId,
            votes,
            ipAddress
        });

        // Update candidate vote counts
        for (const v of votes) {
            await Candidate.findByIdAndUpdate(
                v.candidateId,
                { $inc: { votes: 1 } }
            );
        }

        // Update election statistics
        await Election.findByIdAndUpdate(electionId, {
            $inc: { totalVotes: 1 }
        });

        res.status(201).json({
            success: true,
            message: 'Vote cast successfully',
            data: {
                voteHash: vote.voteHash,
                timestamp: vote.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to cast vote',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Verify vote
// @route   GET /api/votes/verify/:voteHash
// @access  Private
exports.verifyVote = async (req, res) => {
    try {
        const vote = await Vote.findOne({ voteHash: req.params.voteHash })
            .populate('electionId', 'title')
            .select('-votes'); // Don't reveal actual votes

        if (!vote) {
            return res.status(404).json({
                success: false,
                message: 'Vote not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                voteHash: vote.voteHash,
                electionTitle: vote.electionId.title,
                timestamp: vote.createdAt,
                verified: vote.verified
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to verify vote',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Check if student has voted in election
// @route   GET /api/votes/status/:electionId
// @access  Private
exports.checkVotingStatus = async (req, res) => {
    try {
        const vote = await Vote.findOne({
            studentId: req.student.id,
            electionId: req.params.electionId
        });

        res.status(200).json({
            success: true,
            data: {
                hasVoted: !!vote,
                voteHash: vote ? vote.voteHash : null
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to check voting status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get vote receipt
// @route   GET /api/votes/receipt/:electionId
// @access  Private
exports.getVoteReceipt = async (req, res) => {
    try {
        const vote = await Vote.findOne({
            studentId: req.student.id,
            electionId: req.params.electionId
        }).populate('electionId', 'title');

        if (!vote) {
            return res.status(404).json({
                success: false,
                message: 'No vote found for this election'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                voteHash: vote.voteHash,
                electionTitle: vote.electionId.title,
                timestamp: vote.createdAt,
                verified: vote.verified
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get vote receipt',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};