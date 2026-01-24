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

// Public routes (protected but accessible to all authenticated users)
router.get('/', protect, getAllElections);
router.get('/active', protect, getActiveElections);
router.get('/upcoming', protect, getUpcomingElections);
router.get('/completed', protect, getCompletedElections);
router.get('/:id', protect, getElection);

// Admin only routes
router.post('/', protect, adminOnly, createElection);
router.put('/:id', protect, adminOnly, updateElection);
router.delete('/:id', protect, adminOnly, deleteElection);

module.exports = router;