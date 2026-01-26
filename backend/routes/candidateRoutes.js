// routes/candidateRoutes.js
const express = require('express');
const router = express.Router();
const {
    applyAsCandidate,
    getCandidatesByElection,
    getCandidatesByPosition,
    getCandidate,
    updateCandidateStatus,
    updateCandidate,
    deleteCandidate
} = require('../controllers/candidateController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Student routes
router.post('/', protect, applyAsCandidate); // Apply as candidate
router.put('/:id', protect, updateCandidate); // Update own candidate info

// Public routes (protected)
router.get('/election/:electionId', protect, getCandidatesByElection);
router.get('/position/:positionId', protect, getCandidatesByPosition);
router.get('/:id', protect, getCandidate);

// Admin routes
router.put('/:id/status', protect, adminOnly, updateCandidateStatus);
router.delete('/:id', protect, adminOnly, deleteCandidate);

module.exports = router;