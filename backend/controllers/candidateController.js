const Candidate = require('../models/Candidate');
const Election = require('../models/Election');
const Position = require('../models/Position');

// Admin: Add candidate
exports.addCandidate = async (req, res) => {
  try {
    const { electionId, positionId, name, regNo, department, manifesto } = req.body;
    if (!electionId || !positionId || !name || !regNo) {
      return res.status(400).json({ success: false, message: 'Missing required fields: electionId, positionId, name, regNo' });
    }

    // Verify election and position exist
    const election = await Election.findById(electionId);
    if (!election) return res.status(404).json({ success: false, message: 'Election not found' });

    const position = await Position.findById(positionId);
    if (!position) return res.status(404).json({ success: false, message: 'Position not found' });

    const candidate = await Candidate.create({
      electionId,
      positionId,
      name,
      regNo,
      department: department || '',
      manifesto: manifesto || '',
      status: 'approved',
      votes: 0
    });

    res.status(201).json({ success: true, message: 'Candidate added successfully', data: candidate });
  } catch (error) {
    console.error('addCandidate error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get candidates for an election (used by voting page)
// Returns direct fields: name, regNo, department, manifesto, votes, positionId
exports.getCandidatesByElection = async (req, res) => {
  try {
    const { electionId } = req.params;

    const candidates = await Candidate.find({
      electionId,
      status: 'approved'
    })
      .select('name regNo department manifesto votes status _id positionId electionId')
      .sort({ name: 1 });

    res.json({ success: true, data: candidates });
  } catch (error) {
    console.error('getCandidatesByElection error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single candidate
exports.getCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .populate('positionId', 'title description')
      .populate('electionId', 'title');

    if (!candidate) return res.status(404).json({ success: false, message: 'Candidate not found' });

    res.json({ success: true, data: candidate });
  } catch (error) {
    console.error('getCandidate error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update candidate status
exports.updateCandidateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be pending, approved, or rejected' });
    }

    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!candidate) return res.status(404).json({ success: false, message: 'Candidate not found' });

    res.json({ success: true, message: `Candidate ${status} successfully`, data: candidate });
  } catch (error) {
    console.error('updateCandidateStatus error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Delete candidate
exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ success: false, message: 'Candidate not found' });

    res.json({ success: true, message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('deleteCandidate error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};