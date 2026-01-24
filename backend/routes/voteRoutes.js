const express = require('express');
const router = express.Router();
const {
    castVote,
    verifyVote,
    checkVotingStatus,
    getVoteReceipt
} = require('../controllers/voteController');
const { protect } = require('../middleware/authMiddleware');

// All vote routes require authentication
router.post('/cast', protect, castVote);
router.get('/verify/:voteHash', protect, verifyVote);
router.get('/status/:electionId', protect, checkVotingStatus);
router.get('/receipt/:electionId', protect, getVoteReceipt);

module.exports = router;