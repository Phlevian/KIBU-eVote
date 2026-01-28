const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const { protect } = require('../middleware/authMiddleware');

// All vote routes require authentication
router.post('/cast', protect, voteController.castVote);
router.get('/verify/:voteHash', protect, voteController.verifyVote);
router.get('/status/:electionId', protect, voteController.checkVotingStatus);
router.get('/receipt/:electionId', protect, voteController.getVoteReceipt);

module.exports = router;