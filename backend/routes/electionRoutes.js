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

// Public routes - Anyone can view elections
router.get('/', getAllElections);
router.get('/active', getActiveElections);
router.get('/upcoming', getUpcomingElections);
router.get('/completed', getCompletedElections);
router.get('/:id', getElection);

// Admin only routes - Need authentication and admin role
router.post('/', protect, adminOnly, createElection);
router.put('/:id', protect, adminOnly, updateElection);
router.delete('/:id', protect, adminOnly, deleteElection);

module.exports = router;