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

        console.log('Cast vote request:', { electionId, votes, studentId });

        // Validate required fields
        if (!electionId || !votes || !Array.isArray(votes)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide electionId and votes array'
            });
        }

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
                message: `Election is ${election.status}. Voting is only allowed for active elections.`
            });
        }

        // Check if student has already voted
        const existingVote = await Vote.findOne({ 
            studentId, 
            electionId 
        });
        
        if (existingVote) {
            return res.status(400).json({
                success: false,
                message: 'You have already voted in this election'
            });
        }

        // Validate each vote
        for (const vote of votes) {
            if (!vote.positionId || !vote.candidateId) {
                return res.status(400).json({
                    success: false,
                    message: 'Each vote must have positionId and candidateId'
                });
            }

            // Check if candidate exists and is approved
            const candidate = await Candidate.findOne({
                _id: vote.candidateId,
                positionId: vote.positionId,
                electionId: electionId,
                status: 'approved'
            });

            if (!candidate) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid candidate for position ${vote.positionId}`
                });
            }
        }

        // Get client IP and user agent
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
        const userAgent = req.headers['user-agent'] || '';

        // Create vote
        const vote = await Vote.create({
            studentId,
            electionId,
            votes,
            ipAddress,
            userAgent
        });

        console.log('Vote created:', vote._id);

        // Update candidate vote counts
        for (const v of votes) {
            await Candidate.findByIdAndUpdate(
                v.candidateId,
                { $inc: { votes: 1 } }
            );
            console.log(`Updated vote count for candidate ${v.candidateId}`);
        }

        // Update election statistics
        await Election.findByIdAndUpdate(electionId, {
            $inc: { totalVotes: 1 }
        });

        res.status(201).json({
            success: true,
            message: 'Vote cast successfully',
            data: {
                voteId: vote._id,
                voteHash: vote.voteHash,
                timestamp: vote.createdAt
            }
        });

    } catch (error) {
        console.error('Cast vote error:', error);
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
            .populate('electionId', 'title status')
            .populate({
                path: 'votes.candidateId',
                select: '_id',
                populate: {
                    path: 'studentId',
                    select: 'firstName lastName registrationNumber'
                }
            })
            .select('-votes');

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
                electionStatus: vote.electionId.status,
                timestamp: vote.createdAt,
                verified: vote.verified,
                ipAddress: vote.ipAddress
            }
        });
    } catch (error) {
        console.error('Verify vote error:', error);
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
        }).select('voteHash createdAt');

        res.status(200).json({
            success: true,
            data: {
                hasVoted: !!vote,
                voteHash: vote ? vote.voteHash : null,
                votedAt: vote ? vote.createdAt : null
            }
        });
    } catch (error) {
        console.error('Check voting status error:', error);
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
        })
        .populate('electionId', 'title description startDate endDate')
        .populate({
            path: 'votes.candidateId',
            select: '_id',
            populate: {
                path: 'studentId',
                select: 'firstName lastName'
            }
        });

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
                electionDescription: vote.electionId.description,
                votingPeriod: {
                    start: vote.electionId.startDate,
                    end: vote.electionId.endDate
                },
                timestamp: vote.createdAt,
                verified: vote.verified,
                selections: vote.votes.map(v => ({
                    candidateName: v.candidateId.studentId 
                        ? `${v.candidateId.studentId.firstName} ${v.candidateId.studentId.lastName}`
                        : 'Unknown Candidate'
                }))
            }
        });
    } catch (error) {
        console.error('Get vote receipt error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get vote receipt',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};