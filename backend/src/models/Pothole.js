const mongoose = require('mongoose');

const potholeSchema = new mongoose.Schema({
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    image: { type: String, required: true },
    severity: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    issue: { type: String, required: true },
    status: { type: String, default: 'Detected' },
    timestamp: { type: Date, default: Date.now }
}, { collection: 'potholes' });

module.exports = mongoose.model('Pothole', potholeSchema);
