const express = require('express');
const router = express.Router();
const {
  createPosition,
  getPositionsByElection,
  deletePosition
} = require('../controllers/positionController');

router.post('/', createPosition);
router.get('/election/:electionId', getPositionsByElection);
router.delete('/:id', deletePosition);

module.exports = router;
