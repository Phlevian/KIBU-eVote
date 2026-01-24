const express = require('express');
const router = express.Router();
const {
    getCandidatesByElection,
    getCandidatesByPosition,
    createCandidate
} = require('../controllers/candidateController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get candidates (all authenticated users can view)
router.get('/election/:electionId', protect, getCandidatesByElection);
router.get('/position/:positionId', protect, getCandidatesByPosition);

// Admin routes
router.post('/', protect, adminOnly, createCandidate);

module.exports = router;