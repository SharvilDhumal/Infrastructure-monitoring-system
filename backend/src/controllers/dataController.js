const Pothole = require('../models/Pothole');
const Bridge = require('../models/Bridge');
const WaterLeakage = require('../models/WaterLeakage');
const Streetlight = require('../models/Streetlight');

// @desc    Get all potholes
// @route   GET /api/potholes
// @access  Public
const getPotholes = async (req, res) => {
    try {
        const potholes = await Pothole.find().sort({ timestamp: -1 });
        res.status(200).json({
            success: true,
            count: potholes.length,
            data: potholes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error: Unable to fetch potholes',
            error: error.message
        });
    }
};

const getBridges = async (req, res) => {
    try {
        const bridges = await Bridge.find().sort({ timestamp: -1 });
        res.status(200).json({
            success: true,
            count: bridges.length,
            data: bridges
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error: Unable to fetch bridge data',
            error: error.message
        });
    }
};

const getWaterLeakage = async (req, res) => {
    try {
        const records = await WaterLeakage.find().sort({ timestamp: -1 });
        res.status(200).json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error: Unable to fetch water leakage data',
            error: error.message
        });
    }
};

const getStreetlights = async (req, res) => {
    try {
        const records = await Streetlight.find().sort({ timestamp: -1 });
        res.status(200).json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error: Unable to fetch streetlight data',
            error: error.message
        });
    }
};

const updateIssueStatus = async (req, res) => {
    try {
        const { type, id } = req.params;
        const { status } = req.body;

        let model;
        switch (type.toLowerCase()) {
            case 'potholes':
                model = Pothole;
                break;
            case 'bridges':
                model = Bridge;
                break;
            case 'waterleakage':
                model = WaterLeakage;
                break;
            case 'streetlights':
                model = Streetlight;
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid issue type' });
        }

        const updatedIssue = await model.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedIssue) {
            return res.status(404).json({ success: false, message: 'Issue not found' });
        }

        res.status(200).json({
            success: true,
            data: updatedIssue
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error: Unable to update status',
            error: error.message
        });
    }
};

module.exports = {
    getPotholes,
    getBridges,
    getWaterLeakage,
    getStreetlights,
    updateIssueStatus
};
