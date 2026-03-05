const mongoose = require('mongoose');

const actionIssueSchema = new mongoose.Schema({
    issueId: {
        type: String,
        required: true
    },
    sourceCollection: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    assignedTo: {
        type: String
    },
    assignedAt: {
        type: Date
    },
    resolvedBy: {
        type: String
    },
    resolvedAt: {
        type: Date
    },
    status: {
        type: String,
        required: true,
        enum: ['unassigned', 'assigned', 'resolved']
    }
}, {
    timestamps: true
});

const UnassignedIssue = mongoose.model('UnassignedIssue', actionIssueSchema, 'unassigned_issues');
const AssignedIssue = mongoose.model('AssignedIssue', actionIssueSchema, 'assigned_issues');
const ResolvedIssue = mongoose.model('ResolvedIssue', actionIssueSchema, 'resolved_issues');

module.exports = {
    UnassignedIssue,
    AssignedIssue,
    ResolvedIssue
};
