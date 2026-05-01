const express = require('express');
const router = express.Router();
const {
  addCandidate,
  getCandidatesByElection,
  getCandidate,
  updateCandidateStatus,
  deleteCandidate
} = require('../controllers/candidateController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, adminOnly, addCandidate);
router.put('/:id/status', protect, adminOnly, updateCandidateStatus);
router.delete('/:id', protect, adminOnly, deleteCandidate);
router.get('/election/:electionId', protect, getCandidatesByElection);
router.get('/:id', protect, getCandidate);

module.exports = router;