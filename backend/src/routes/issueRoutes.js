const express = require('express');
const router = express.Router();
const { createIssue, getUserIssues } = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createIssue);
router.get('/user', protect, getUserIssues);

module.exports = router;
