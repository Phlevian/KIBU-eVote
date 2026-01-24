const Election = require('../models/Election');
const Position = require('../models/Position');

// @desc    Get all elections
// @route   GET /api/elections
// @access  Private
exports.getAllElections = async (req, res) => {
    try {
        const elections = await Election.find().populate('positions').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: elections.length,
            data: elections
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch elections',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get active elections
// @route   GET /api/elections/active
// @access  Private
exports.getActiveElections = async (req, res) => {
    try {
        const elections = await Election.find({ status: 'active' }).populate('positions');

        res.status(200).json({
            success: true,
            count: elections.length,
            data: elections
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch active elections',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get upcoming elections
// @route   GET /api/elections/upcoming
// @access  Private
exports.getUpcomingElections = async (req, res) => {
    try {
        const elections = await Election.find({ status: 'upcoming' }).populate('positions');

        res.status(200).json({
            success: true,
            count: elections.length,
            data: elections
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch upcoming elections',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get completed elections
// @route   GET /api/elections/completed
// @access  Private
exports.getCompletedElections = async (req, res) => {
    try {
        const elections = await Election.find({ status: 'completed' }).populate('positions');

        res.status(200).json({
            success: true,
            count: elections.length,
            data: elections
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch completed elections',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get single election
// @route   GET /api/elections/:id
// @access  Private
exports.getElection = async (req, res) => {
    try {
        const election = await Election.findById(req.params.id).populate('positions');

        if (!election) {
            return res.status(404).json({
                success: false,
                message: 'Election not found'
            });
        }

        res.status(200).json({
            success: true,
            data: election
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch election',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Create election
// @route   POST /api/elections
// @access  Private/Admin
exports.createElection = async (req, res) => {
    try {
        const election = await Election.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Election created successfully',
            data: election
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create election',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Update election
// @route   PUT /api/elections/:id
// @access  Private/Admin
exports.updateElection = async (req, res) => {
    try {
        const election = await Election.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!election) {
            return res.status(404).json({
                success: false,
                message: 'Election not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Election updated successfully',
            data: election
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update election',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Delete election
// @route   DELETE /api/elections/:id
// @access  Private/Admin
exports.deleteElection = async (req, res) => {
    try {
        const election = await Election.findByIdAndDelete(req.params.id);

        if (!election) {
            return res.status(404).json({
                success: false,
                message: 'Election not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Election deleted successfully',
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete election',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};