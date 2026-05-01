const express = require('express');
const router = express.Router();
const {
  createElection,
  getAllElections,
  getElection,
  getActiveElections,
  updateElection,
  deleteElection
} = require('../controllers/electionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes (with authentication for students)
router.get('/active', protect, getActiveElections);   // ✅ ADDED
router.get('/:id', protect, getElection);
router.get('/', protect, getAllElections);

// Admin only routes
router.post('/', protect, adminOnly, createElection);
router.put('/:id', protect, adminOnly, updateElection);
router.delete('/:id', protect, adminOnly, deleteElection);

module.exports = router;