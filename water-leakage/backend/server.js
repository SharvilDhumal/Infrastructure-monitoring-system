const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/water-leakage';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Sensor Data Schema
const sensorSchema = new mongoose.Schema({
    flow1: Number,
    flow2: Number,
    moisture: Number,
    leak: Boolean,
    time: String,
    timestamp: { type: Date, default: Date.now }
});

const SensorData = mongoose.model('SensorData', sensorSchema);

// Health Check Route
app.get('/', (req, res) => {
    res.status(200).send({ message: 'Water Leakage API is Running' });
});

// API Endpoints

// POST: Receive data from ESP32
app.post('/sensor-data', async (req, res) => {
    try {
        const { flow1, flow2, moisture, leak, time } = req.body;
        const newData = new SensorData({
            flow1,
            flow2,
            moisture,
            leak,
            time
        });
        await newData.save();
        console.log('Data saved:', req.body);
        res.status(201).send({ message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send({ message: 'Error saving data', error });
    }
});

// GET: Fetch latest sensor data
app.get('/latest', async (req, res) => {
    try {
        const latestData = await SensorData.findOne().sort({ timestamp: -1 });
        if (latestData) {
            res.status(200).send(latestData);
        } else {
            res.status(404).send({ message: 'No data found' });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send({ message: 'Error fetching data', error });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
