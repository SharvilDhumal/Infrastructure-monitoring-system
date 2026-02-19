const axios = require('axios');
const Streetlight = require('../models/Streetlight');

// POST /api/streetlight-data
exports.receiveData = async (req, res) => {
    try {
        const { streetlightId, voltage, current, status, relayState } = req.body;

        if (!streetlightId) {
            return res.status(400).json({ message: 'streetlightId is required' });
        }

        // Calculate power: P = V * I
        const power = (voltage || 0) * (current || 0);

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
            .limit(50);
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// POST /api/toggle-relay
exports.toggleRelay = async (req, res) => {
    try {
        const { id, state } = req.body; // id = 1, 2, 3, 4; state = 'on' or 'off'

        if (!id || !state) {
            return res.status(400).json({ message: 'id and state are required' });
        }

        // Use the ESP32's actual IP 10.39.59.88 instead of streetlight.local
        const esp32Url = `http://10.39.59.88/relay?ch=${id}&state=${state}`;

        console.log(`Forwarding relay command to ESP32: ${esp32Url}`);

        try {
            const response = await axios.get(esp32Url, { timeout: 5000 });
            res.json({ message: `Relay ${id} turned ${state} successfully`, espResponse: response.data });
        } catch (espError) {
            console.error('Error communicatng with ESP32:', espError.message);
            res.status(502).json({ message: 'Failed to communicate with ESP32. Is it online and reachable at streetlight.local?', error: espError.message });
        }
    } catch (error) {
        console.error('Error in toggleRelay:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
