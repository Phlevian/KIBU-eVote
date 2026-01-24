const Election = require('../models/Election');
const Position = require('../models/Position');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

// @desc    Get election results
// @route   GET /api/results/election/:electionId
// @access  Private
exports.getElectionResults = async (req, res) => {
    try {
        const election = await Election.findById(req.params.electionId)
            .populate('positions');

        if (!election) {
            return res.status(404).json({
                success: false,
                message: 'Election not found'
            });
        }

        // Get all candidates with their votes
        const candidates = await Candidate.find({ 
            electionId: req.params.electionId 
        })
            .populate('studentId', 'firstName lastName registrationNumber profilePhoto')
            .populate('positionId', 'title description')
            .sort({ votes: -1 });

        // Group candidates by position
        const resultsByPosition = {};
        
        for (const candidate of candidates) {
            const positionId = candidate.positionId._id.toString();
            
            if (!resultsByPosition[positionId]) {
                resultsByPosition[positionId] = {
                    position: {
                        id: candidate.positionId._id,
                        title: candidate.positionId.title,
                        description: candidate.positionId.description
                    },
                    candidates: [],
                    totalVotes: 0,
                    winner: null
                };
            }

            const candidateData = {
                id: candidate._id,
                student: {
                    id: candidate.studentId._id,
                    firstName: candidate.studentId.firstName,
                    lastName: candidate.studentId.lastName,
                    registrationNumber: candidate.studentId.registrationNumber,
                    photo: candidate.studentId.profilePhoto || candidate.photo
                },
                manifesto: candidate.manifesto,
                votes: candidate.votes,
                percentage: 0
            };

            resultsByPosition[positionId].candidates.push(candidateData);
            resultsByPosition[positionId].totalVotes += candidate.votes;
        }

        // Calculate percentages and determine winners
        Object.keys(resultsByPosition).forEach(positionId => {
            const position = resultsByPosition[positionId];
            
            position.candidates.forEach(candidate => {
                if (position.totalVotes > 0) {
                    candidate.percentage = ((candidate.votes / position.totalVotes) * 100).toFixed(2);
                }
            });

            // Winner is candidate with most votes
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
                    totalVotes: election.totalVotes
                },
                results: Object.values(resultsByPosition)
            }
        });
    } catch (error) {
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
            return res.status(404).json({
                success: false,
                message: 'Position not found'
            });
        }

        const candidates = await Candidate.find({ 
            positionId: req.params.positionId 
        })
            .populate('studentId', 'firstName lastName registrationNumber profilePhoto')
            .sort({ votes: -1 });

        const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);

        const candidatesWithPercentage = candidates.map(candidate => ({
            id: candidate._id,
            student: {
                id: candidate.studentId._id,
                firstName: candidate.studentId.firstName,
                lastName: candidate.studentId.lastName,
                registrationNumber: candidate.studentId.registrationNumber,
                photo: candidate.studentId.profilePhoto || candidate.photo
            },
            manifesto: candidate.manifesto,
            votes: candidate.votes,
            percentage: totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(2) : 0
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
            return res.status(404).json({
                success: false,
                message: 'Election not found'
            });
        }

        // Get total votes cast
        const totalVotes = await Vote.countDocuments({ 
            electionId: req.params.electionId 
        });

        // Get votes by faculty
        const votesByFaculty = await Vote.aggregate([
            { 
                $match: { electionId: election._id } 
            },
            {
                $lookup: {
                    from: 'students',
                    localField: 'studentId',
                    foreignField: '_id',
                    as: 'student'
                }
            },
            { $unwind: '$student' },
            {
                $group: {
                    _id: '$student.faculty',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get votes by year of study
        const votesByYear = await Vote.aggregate([
            { 
                $match: { electionId: election._id } 
            },
            {
                $lookup: {
                    from: 'students',
                    localField: 'studentId',
                    foreignField: '_id',
                    as: 'student'
                }
            },
            { $unwind: '$student' },
            {
                $group: {
                    _id: '$student.yearOfStudy',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get voter turnout percentage
        const eligibleVoters = election.totalVoters || 1000; // Default if not set
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
                        faculty: v._id,
                        votes: v.count
                    })),
                    votesByYear: votesByYear.map(v => ({
                        year: v._id,
                        votes: v.count
                    }))
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch election statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};