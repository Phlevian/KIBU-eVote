const Election = require('../models/Election');
const Position = require('../models/Position');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

// @desc    Get election results
// @route   GET /api/results/election/:electionId
// @access  Private
exports.getElectionResults = async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId);
    if (!election) {
      return res.status(404).json({ success: false, message: 'Election not found' });
    }

    // ✅ FIX: Candidate model uses direct fields (name, regNo, department)
    // NOT studentId. Removed .populate('studentId') which was causing errors.
    const candidates = await Candidate.find({
      electionId: req.params.electionId
    })
      .populate('positionId', 'title description order')
      .sort({ votes: -1 });

    // Group candidates by position
    const resultsByPosition = {};

    for (const candidate of candidates) {
      if (!candidate.positionId) continue; // skip orphaned candidates

      const positionId = candidate.positionId._id.toString();

      if (!resultsByPosition[positionId]) {
        resultsByPosition[positionId] = {
          position: {
            id: candidate.positionId._id,
            title: candidate.positionId.title,
            description: candidate.positionId.description || ''
          },
          candidates: [],
          totalVotes: 0,
          winner: null
        };
      }

      const candidateData = {
        id: candidate._id,
        name: candidate.name,
        regNo: candidate.regNo,
        department: candidate.department || '',
        photo: candidate.photo || null,
        manifesto: candidate.manifesto || '',
        votes: candidate.votes || 0,
        status: candidate.status,
        percentage: 0
      };

      resultsByPosition[positionId].candidates.push(candidateData);
      resultsByPosition[positionId].totalVotes += candidate.votes || 0;
    }

    // Calculate percentages and determine winners
    Object.keys(resultsByPosition).forEach(positionId => {
      const position = resultsByPosition[positionId];

      // Sort candidates by votes descending
      position.candidates.sort((a, b) => b.votes - a.votes);

      position.candidates.forEach(candidate => {
        if (position.totalVotes > 0) {
          candidate.percentage = ((candidate.votes / position.totalVotes) * 100).toFixed(2);
        }
      });

      if (position.candidates.length > 0) {
        position.winner = position.candidates[0];
      }
    });

    res.status(200).json({
      success: true,
      data: {
        election: {
          id: election._id,
          title: election.title,
          description: election.description,
          status: election.status,
          totalVoters: election.totalVoters,
          totalVotes: election.totalVotes,
          startDate: election.startDate,
          endDate: election.endDate
        },
        results: Object.values(resultsByPosition)
      }
    });
  } catch (error) {
    console.error('getElectionResults error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch election results',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get position results
// @route   GET /api/results/position/:positionId
// @access  Private
exports.getPositionResults = async (req, res) => {
  try {
    const position = await Position.findById(req.params.positionId)
      .populate('electionId', 'title status');

    if (!position) {
      return res.status(404).json({ success: false, message: 'Position not found' });
    }

    // ✅ FIX: Removed .populate('studentId') - Candidate uses direct name/regNo fields
    const candidates = await Candidate.find({
      positionId: req.params.positionId
    }).sort({ votes: -1 });

    const totalVotes = candidates.reduce((sum, c) => sum + (c.votes || 0), 0);

    const candidatesWithPercentage = candidates.map(candidate => ({
      id: candidate._id,
      name: candidate.name,
      regNo: candidate.regNo,
      department: candidate.department || '',
      photo: candidate.photo || null,
      manifesto: candidate.manifesto || '',
      votes: candidate.votes || 0,
      status: candidate.status,
      percentage: totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(2) : '0.00'
    }));

    res.status(200).json({
      success: true,
      data: {
        position: {
          id: position._id,
          title: position.title,
          description: position.description,
          election: position.electionId
        },
        candidates: candidatesWithPercentage,
        totalVotes,
        winner: candidatesWithPercentage.length > 0 ? candidatesWithPercentage[0] : null
      }
    });
  } catch (error) {
    console.error('getPositionResults error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch position results',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get election statistics
// @route   GET /api/results/statistics/:electionId
// @access  Private
exports.getElectionStatistics = async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId);
    if (!election) {
      return res.status(404).json({ success: false, message: 'Election not found' });
    }

    const totalVotes = await Vote.countDocuments({ electionId: req.params.electionId });

    // Votes by faculty (via student lookup)
    const votesByFaculty = await Vote.aggregate([
      { $match: { electionId: election._id } },
      {
        $lookup: {
          from: 'students',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: { path: '$student', preserveNullAndEmpty: false } },
      {
        $group: {
          _id: '$student.faculty',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Votes by year of study
    const votesByYear = await Vote.aggregate([
      { $match: { electionId: election._id } },
      {
        $lookup: {
          from: 'students',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: { path: '$student', preserveNullAndEmpty: false } },
      {
        $group: {
          _id: '$student.yearOfStudy',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const eligibleVoters = election.totalVoters || 1000;
    const turnoutPercentage = ((totalVotes / eligibleVoters) * 100).toFixed(2);

    res.status(200).json({
      success: true,
      data: {
        election: {
          id: election._id,
          title: election.title,
          status: election.status
        },
        statistics: {
          totalVotes,
          eligibleVoters,
          turnoutPercentage,
          votesByFaculty: votesByFaculty.map(v => ({
            faculty: v._id || 'Unknown',
            votes: v.count
          })),
          votesByYear: votesByYear.map(v => ({
            year: v._id || 'Unknown',
            votes: v.count
          }))
        }
      }
    });
  } catch (error) {
    console.error('getElectionStatistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch election statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};