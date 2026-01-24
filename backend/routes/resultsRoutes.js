const express = require('express');
const router = express.Router();
const {
    getElectionResults,
    getPositionResults,
    getElectionStatistics
} = require('../controllers/resultsController');
const { protect } = require('../middleware/authMiddleware');

// All results routes require authentication
router.get('/election/:electionId', protect, getElectionResults);
router.get('/position/:positionId', protect, getPositionResults);
router.get('/statistics/:electionId', protect, getElectionStatistics);

module.exports = router;