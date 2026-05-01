const Position = require('../models/Position');
const Election = require('../models/Election');

exports.createPosition = async (req, res) => {
  try {
    const { electionId, title, description, order } = req.body;
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ success: false, message: 'Election not found' });
    }
    const position = await Position.create({
      electionId,
      title,
      description: description || '',
      order: order || 1
    });
    if (!election.positions) election.positions = [];
    election.positions.push(position._id);
    await election.save();
    res.status(201).json({ success: true, data: position });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPositionsByElection = async (req, res) => {
  try {
    const positions = await Position.find({ electionId: req.params.electionId })
      .sort({ order: 1 });
    res.json({ success: true, data: positions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePosition = async (req, res) => {
  try {
    const position = await Position.findByIdAndDelete(req.params.id);
    if (!position) return res.status(404).json({ success: false, message: 'Not found' });
    await Election.findByIdAndUpdate(position.electionId, { $pull: { positions: position._id } });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};