const express = require('express');
const router = express.Router();
const {
    getAllElections,
    getActiveElections,
    getUpcomingElections,
    getCompletedElections,
    getElection,
    createElection,
    updateElection,
    deleteElection
} = require('../controllers/electionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes - NO AUTHENTICATION REQUIRED (students can browse without login)
router.get('/', getAllElections);
router.get('/active', getActiveElections);
router.get('/upcoming', getUpcomingElections);
router.get('/completed', getCompletedElections);
router.get('/:id', getElection);

// Admin only routes
router.post('/', protect, adminOnly, createElection);
router.put('/:id', protect, adminOnly, updateElection);
router.delete('/:id', protect, adminOnly, deleteElection);

module.exports = router;