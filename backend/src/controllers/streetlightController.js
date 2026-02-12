const Streetlight = require('../models/Streetlight');

// POST /api/streetlight-data
exports.receiveData = async (req, res) => {
    try {
        const { streetlightId, voltage, current, power, status, relayState } = req.body;

        if (!streetlightId) {
            return res.status(400).json({ message: 'streetlightId is required' });
        }

        const newData = new Streetlight({
            streetlightId,
            voltage,
            current,
            power,
            status,
            relayState
        });

        await newData.save();
        res.status(201).json({ message: 'Data received successfully' });
    } catch (error) {
        console.error('Error receiving streetlight data:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/latest
exports.getLatestStatus = async (req, res) => {
    try {
        // Aggregation to get the latest document for each streetlightId
        const latestData = await Streetlight.aggregate([
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: '$streetlightId',
                    doc: { $first: '$$ROOT' }
                }
            },
            {
                $replaceRoot: { newRoot: '$doc' }
            }
        ]);

        // If no data, return empty array
        // Note: The frontend expects 4 streetlights. We can either pre-populate DB or handle empty on frontend.
        // For now, return what we have.
        res.json(latestData);
    } catch (error) {
        console.error('Error fetching latest status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/history/:id
exports.getHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const history = await Streetlight.find({ streetlightId: id })
            .sort({ timestamp: -1 })
            .limit(50); // Limit to last 50 entries
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
