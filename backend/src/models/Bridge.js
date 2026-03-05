const mongoose = require('mongoose');

const bridgeSchema = new mongoose.Schema({
    bridgeId: { type: String, required: true },
    image: { type: String, required: true },
    severity: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    issue: { type: String, required: true },
    confidence: { type: Number, required: true },
    status: { type: String, default: 'Detected' },
    timestamp: { type: Date, default: Date.now }
}, { collection: 'bridge' });

module.exports = mongoose.model('Bridge', bridgeSchema);
