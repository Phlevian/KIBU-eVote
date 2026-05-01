const Election = require('../models/Election');

exports.createElection = async (req, res) => {
  try {
    const { title, description, type, startDate, endDate, totalVoters } = req.body;
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Title, start date, and end date are required' });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      return res.status(400).json({ success: false, message: 'End date must be after start date' });
    }
    const election = await Election.create({
      title,
      description: description || '',
      type: type || 'student-council',
      startDate: start,
      endDate: end,
      totalVoters: totalVoters || 10000,
      totalVotes: 0,
      status: start <= new Date() && end >= new Date() ? 'active' : (new Date() < start ? 'upcoming' : 'completed')
    });
    res.status(201).json({ success: true, message: 'Election created', data: election });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllElections = async (req, res) => {
  try {
    const elections = await Election.find().sort({ createdAt: -1 });
    res.json({ success: true, data: elections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) return res.status(404).json({ success: false, message: 'Election not found' });
    res.json({ success: true, data: election });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getActiveElections = async (req, res) => {
  try {
    const now = new Date();
    const elections = await Election.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
      status: 'active'
    }).sort({ endDate: 1 });
    res.json({ success: true, data: elections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateElection = async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!election) return res.status(404).json({ success: false, message: 'Election not found' });
    res.json({ success: true, data: election });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteElection = async (req, res) => {
  try {
    const election = await Election.findByIdAndDelete(req.params.id);
    if (!election) return res.status(404).json({ success: false, message: 'Election not found' });
    res.json({ success: true, message: 'Election deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};