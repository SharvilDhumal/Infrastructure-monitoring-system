const Issue = require('../models/Issue');

exports.getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find().populate('user', 'name email');
        res.status(200).json({
            success: true,
            issues
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.createIssue = async (req, res) => {
    try {
        const { title, faultType, location, description, imageUrl } = req.body;

        const issue = await Issue.create({
            user: req.user._id,
            title,
            faultType,
            location,
            description,
            imageUrl
        });

        res.status(201).json({
            success: true,
            issue
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getUserIssues = async (req, res) => {
    try {
        const issues = await Issue.find({ user: req.user._id }).sort({ createdAt: -1 });

        const stats = {
            total: issues.length,
            approved: issues.filter(i => i.status === 'Approved').length,
            pending: issues.filter(i => i.status === 'Pending').length,
            rejected: issues.filter(i => i.status === 'Rejected').length,
            resolved: issues.filter(i => i.status === 'Resolved').length,
        };

        res.status(200).json({
            success: true,
            issues,
            stats
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateIssueStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const issue = await Issue.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        res.status(200).json({
            success: true,
            issue
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
