const mongoose = require('mongoose');

const streetlightSchema = new mongoose.Schema({
    streetlightId: {
        type: String,
        required: true,
        index: true
    },
    voltage: {
        type: Number,
        required: true
    },
    current: {
        type: Number,
        required: true
    },
    power: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['ON', 'OFF'],
        default: 'OFF'
    },
    relayState: {
        type: Boolean, // true = ON, false = OFF
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient retrieval of latest status and history
streetlightSchema.index({ streetlightId: 1, timestamp: -1 });

module.exports = mongoose.model('Streetlight', streetlightSchema);
