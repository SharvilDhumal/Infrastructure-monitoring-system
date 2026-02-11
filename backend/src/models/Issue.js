const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
        },
        location: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Approved', 'Pending', 'Rejected', 'Resolved'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Issue', issueSchema);
