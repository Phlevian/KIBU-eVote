const express = require('express');
const router = express.Router();
const {
  createPosition,
  getPositionsByElection,
  deletePosition
} = require('../controllers/positionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Admin routes
router.post('/', protect, adminOnly, createPosition);
router.delete('/:id', protect, adminOnly, deletePosition);

// Public (authenticated) routes
router.get('/election/:electionId', protect, getPositionsByElection);

module.exports = router;