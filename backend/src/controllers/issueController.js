const Issue = require('../models/Issue');

// @desc    Create a new issue
// @route   POST /api/issues
// @access  Private
const createIssue = async (req, res) => {
    try {
        const { title, description, imageUrl, location } = req.body;

        if (!title || !description || !location) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const issue = await Issue.create({
            userId: req.user._id,
            title,
            description,
            imageUrl,
            location,
            status: 'Pending', // Default status
        });

        res.status(201).json(issue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get logged-in user's issues with stats
// @route   GET /api/issues/user
// @access  Private
const getUserIssues = async (req, res) => {
    try {
        const issues = await Issue.find({ userId: req.user._id }).sort({ createdAt: -1 });

        const stats = {
            total: issues.length,
            approved: issues.filter((issue) => issue.status === 'Approved').length,
            pending: issues.filter((issue) => issue.status === 'Pending').length,
            rejected: issues.filter((issue) => issue.status === 'Rejected').length,
            resolved: issues.filter((issue) => issue.status === 'Resolved').length,
        };

        res.json({ stats, issues });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createIssue,
    getUserIssues,
};
