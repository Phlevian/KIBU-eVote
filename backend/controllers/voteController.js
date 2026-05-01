const Vote = require('../models/Vote');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');

// @desc    Cast vote
// @route   POST /api/votes/cast
// @access  Private
exports.castVote = async (req, res) => {
  try {
    const { electionId, votes } = req.body;
    const studentId = req.student._id;

    // Validate input
    if (!electionId || !votes || !Array.isArray(votes) || votes.length === 0) {
      return res.status(400).json({ success: false, message: 'electionId and votes array are required' });
    }

    // Check election exists and is active
    const election = await Election.findById(electionId);
    if (!election) return res.status(404).json({ success: false, message: 'Election not found' });
    if (election.status !== 'active') {
      return res.status(400).json({ success: false, message: `Election is not active (status: ${election.status})` });
    }

    // Check not already voted
    const existing = await Vote.findOne({ studentId, electionId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already voted in this election' });
    }

    // Validate each vote entry
    for (const v of votes) {
      if (!v.candidateId || !v.positionId) {
        return res.status(400).json({ success: false, message: 'Each vote must have candidateId and positionId' });
      }
      const candidate = await Candidate.findOne({
        _id: v.candidateId,
        electionId,
        positionId: v.positionId,
        status: 'approved'
      });
      if (!candidate) {
        return res.status(400).json({
          success: false,
          message: `Invalid candidate ${v.candidateId} for position ${v.positionId}`
        });
      }
    }

    // Create vote record
    const vote = new Vote({
      studentId,
      electionId,
      votes: votes.map(v => ({
        positionId: v.positionId,
        candidateId: v.candidateId
      })),
      ipAddress: req.ip || req.connection?.remoteAddress || '',
      userAgent: req.headers['user-agent'] || ''
    });
    await vote.save();

    // Increment vote counts for each candidate
    for (const v of votes) {
      await Candidate.findByIdAndUpdate(v.candidateId, { $inc: { votes: 1 } });
    }

    // Increment election total votes
    await Election.findByIdAndUpdate(electionId, { $inc: { totalVotes: 1 } });

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
    console.error('castVote error:', error);
    // Handle duplicate vote (race condition)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already voted in this election' });
    }
    res.status(500).json({ success: false, message: 'Failed to cast vote: ' + error.message });
  }
};

// @desc    Verify vote by hash
// @route   GET /api/votes/verify/:voteHash
// @access  Private
exports.verifyVote = async (req, res) => {
  try {
    const vote = await Vote.findOne({ voteHash: req.params.voteHash })
      .populate('electionId', 'title status');

    if (!vote) return res.status(404).json({ success: false, message: 'Vote not found' });

    res.json({
      success: true,
      data: {
        voteHash: vote.voteHash,
        electionTitle: vote.electionId?.title || 'Unknown',
        electionStatus: vote.electionId?.status || 'Unknown',
        timestamp: vote.createdAt,
        verified: true
      }
    });
  } catch (error) {
    console.error('verifyVote error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify vote' });
  }
};

// @desc    Check if student has voted in an election
// @route   GET /api/votes/status/:electionId
// @access  Private
exports.checkVotingStatus = async (req, res) => {
  try {
    const vote = await Vote.findOne({
      studentId: req.student._id,
      electionId: req.params.electionId
    });

    res.json({
      success: true,
      data: {
        hasVoted: !!vote,
        voteHash: vote ? vote.voteHash : null,
        timestamp: vote ? vote.createdAt : null
      }
    });
  } catch (error) {
    console.error('checkVotingStatus error:', error);
    res.status(500).json({ success: false, message: 'Failed to check voting status' });
  }
};

// @desc    Get vote receipt for an election
// @route   GET /api/votes/receipt/:electionId
// @access  Private
exports.getVoteReceipt = async (req, res) => {
  try {
    // ✅ FIX: Populate candidateId with direct fields only (no studentId on Candidate model)
    const vote = await Vote.findOne({
      studentId: req.student._id,
      electionId: req.params.electionId
    })
      .populate('electionId', 'title status startDate endDate')
      .populate({
        path: 'votes.candidateId',
        select: 'name regNo department positionId'
      })
      .populate({
        path: 'votes.positionId',
        select: 'title'
      });

    if (!vote) {
      return res.status(404).json({ success: false, message: 'No vote record found for this election' });
    }

    res.json({
      success: true,
      data: {
        voteHash: vote.voteHash,
        electionTitle: vote.electionId?.title || 'Unknown',
        timestamp: vote.createdAt,
        selections: vote.votes.map(v => ({
          position: v.positionId?.title || 'Unknown Position',
          candidate: v.candidateId?.name || 'Unknown Candidate',
          regNo: v.candidateId?.regNo || '',
          department: v.candidateId?.department || ''
        }))
      }
    });
  } catch (error) {
    console.error('getVoteReceipt error:', error);
    res.status(500).json({ success: false, message: 'Failed to get vote receipt' });
  }
};