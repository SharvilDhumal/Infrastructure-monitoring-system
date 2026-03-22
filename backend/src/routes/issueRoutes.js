const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

// GET all issues (Keep public if needed, or protect)
router.get('/', issueController.getAllIssues);

// GET user-specific issues (Protected)
router.get('/user', protect, issueController.getUserIssues);

// POST a new issue (Protected)
router.post('/', protect, issueController.createIssue);

// UPDATE issue status (Now Protected)
router.put('/:id/status', protect, issueController.updateIssueStatus);

// Admin Dashboard Actions (All Protected)
router.post('/assign/:issueId', protect, issueController.assignIssue);
router.post('/resolve/:issueId', protect, issueController.resolveIssue);
router.get('/actions', protect, issueController.getActionIssues);
router.get('/analytics', protect, analyticsController.getAnalytics);

module.exports = router;
