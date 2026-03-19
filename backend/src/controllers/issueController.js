const Issue = require('../models/Issue');
const Bridge = require('../models/Bridge');
const Pothole = require('../models/Pothole');
const WaterLeakage = require('../models/WaterLeakage');
const Streetlight = require('../models/Streetlight');
const { UnassignedIssue, AssignedIssue, ResolvedIssue } = require('../models/ActionIssue');

exports.getAllIssues = async (req, res) => {
    try {
        const query = req.query.faultType ? { faultType: req.query.faultType } : {};
        const issues = await Issue.find(query).populate('user', 'name email').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            issues: issues || []
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error: Unable to fetch issues',
            error: error.message
        });
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
            inProgress: issues.filter(i => i.status === 'In Progress').length,
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

exports.assignIssue = async (req, res) => {
    try {
        const { issueId } = req.params;
        const { assignedTo, sourceCollection } = req.body;

        // 1. Ensure it's not already resolved
        const existingResolved = await ResolvedIssue.findOne({ issueId });
        if (existingResolved) {
            return res.status(400).json({ message: 'Issue already resolved' });
        }

        // 2. Find issue in original collection
        let originalIssue;
        let source = sourceCollection;

        if (!source) {
            // Try all collections if source not provided
            const models = [
                { model: Issue, name: 'issues' },
                { model: Bridge, name: 'bridge' },
                { model: Pothole, name: 'potholes' },
                { model: WaterLeakage, name: 'waterleakage' },
                { model: Streetlight, name: 'streetlights' }
            ];

            for (const m of models) {
                originalIssue = await m.model.findById(issueId);
                if (originalIssue) {
                    source = m.name;
                    break;
                }
            }
        } else {
            const modelMap = {
                'issues': Issue,
                'bridge': Bridge,
                'potholes': Pothole,
                'waterleakage': WaterLeakage,
                'streetlights': Streetlight
            };
            const Model = modelMap[source];
            if (Model) {
                originalIssue = await Model.findById(issueId);
            }
        }

        if (!originalIssue) {
            return res.status(404).json({ message: 'Issue not found in original collection' });
        }

        // 3. Normalize data
        const actionData = {
            issueId,
            sourceCollection: source,
            title: originalIssue.title || originalIssue.issue || originalIssue.faultType || 'Unknown Issue',
            location: (typeof originalIssue.location === 'string') ? originalIssue.location : (originalIssue.location ? `${originalIssue.location.latitude}, ${originalIssue.location.longitude}` : 'Unknown Location'),
            severity: originalIssue.severity || originalIssue.leakSeverity || 'Medium',
            imageUrl: originalIssue.imageUrl || originalIssue.image || '',
            assignedTo,
            assignedAt: new Date(),
            status: 'assigned'
        };

        // 4. Create document in assigned_issues
        const assignedIssue = await AssignedIssue.findOneAndUpdate(
            { issueId },
            actionData,
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            data: assignedIssue
        });

    } catch (error) {
        console.error('Assign Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.resolveIssue = async (req, res) => {
    try {
        const { issueId } = req.params;
        const { resolvedBy } = req.body;

        // 1. Find the issue in assigned_issues
        const assignedIssue = await AssignedIssue.findOne({ issueId });
        if (!assignedIssue) {
            return res.status(404).json({ message: 'Issue not found in assigned issues' });
        }

        // 2. Create document in resolved_issues
        const resolvedData = {
            ...assignedIssue.toObject(),
            resolvedBy,
            resolvedAt: new Date(),
            status: 'resolved'
        };
        delete resolvedData._id; // Remove _id to create a new one

        await ResolvedIssue.create(resolvedData);

        // 3. Remove from assigned_issues
        await AssignedIssue.deleteOne({ issueId });

        res.status(200).json({
            success: true,
            message: 'Issue resolved successfully'
        });

    } catch (error) {
        console.error('Resolve Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getActionIssues = async (req, res) => {
    try {
        const assigned = await AssignedIssue.find();
        const resolved = await ResolvedIssue.find();

        res.status(200).json({
            success: true,
            assigned_issues: assigned,
            resolved_issues: resolved
        });
    } catch (error) {
        console.error('Get Action Issues Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
