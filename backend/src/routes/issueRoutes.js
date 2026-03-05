const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const { protect } = require('../middleware/auth');

// GET all issues (Keep public if needed, or protect)
router.get('/', issueController.getAllIssues);

// GET user-specific issues (Protected)
router.get('/user', protect, issueController.getUserIssues);

// POST a new issue (Protected)
router.post('/', protect, issueController.createIssue);

// UPDATE issue status (Temporarily public for testing with mock admin credentials)
router.put('/:id/status', issueController.updateIssueStatus);

module.exports = router;
