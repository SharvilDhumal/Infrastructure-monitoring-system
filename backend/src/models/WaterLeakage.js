const mongoose = require('mongoose');

const waterLeakageSchema = new mongoose.Schema({
    supplyLineFlow: { type: Number, required: true },
    outletLineFlow: { type: Number, required: true },
    groundMoisture: { type: Number, required: true },
    leakDetected: { type: Boolean, required: true },
    leakSeverity: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    autoShutoffTriggered: { type: Boolean, required: true },
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}, { collection: 'waterleakage' });

module.exports = mongoose.model('WaterLeakage', waterLeakageSchema);
