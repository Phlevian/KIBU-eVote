const Position = require('../models/Position');
const Election = require('../models/Election');

/**
 * Create a position for an election
 */
exports.createPosition = async (req, res) => {
  try {
    const { electionId } = req.body;

    // Check election exists
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }

    // Create position
    const position = await Position.create(req.body);

    // Attach position to election
    election.positions.push(position._id);
    await election.save();

    res.status(201).json({
      success: true,
      message: 'Position created successfully',
      data: position
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create position',
      error: error.message
    });
  }
};

/**
 * Get all positions for an election
 */
exports.getPositionsByElection = async (req, res) => {
  try {
    const { electionId } = req.params;

    const positions = await Position.find({ electionId })
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: positions.length,
      data: positions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch positions',
      error: error.message
    });
  }
};

/**
 * Delete a position
 */
exports.deletePosition = async (req, res) => {
  try {
    const position = await Position.findByIdAndDelete(req.params.id);

    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Position not found'
      });
    }

    // Remove from election.positions array
    await Election.findByIdAndUpdate(
      position.electionId,
      { $pull: { positions: position._id } }
    );

    res.status(200).json({
      success: true,
      message: 'Position deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete position',
      error: error.message
    });
  }
};
