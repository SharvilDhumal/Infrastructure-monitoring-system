const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('Error: MONGO_URI is not defined in environment variables.');
    process.exit(1);
}

// Data format definitions
const potholesData = Array.from({ length: 5 }).map((_, i) => ({
    location: {
        latitude: 19.0760 + (Math.random() * 0.1),
        longitude: 72.8777 + (Math.random() * 0.1)
    },
    image: `uploads/pothole_${i + 1}.jpg`,
    severity: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
    issue: `Road surface damage at spot ${i + 1}`,
    status: "Detected",
    timestamp: new Date()
}));

const bridgesData = Array.from({ length: 5 }).map((_, i) => ({
    bridgeId: `BR-0${i + 1}`,
    image: `uploads/bridge_${i + 1}.jpg`,
    severity: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
    issue: `Structural crack detected in pillar ${i + 1}`,
    confidence: parseFloat((0.75 + Math.random() * (0.98 - 0.75)).toFixed(2)),
    status: "Detected",
    timestamp: new Date()
}));

const waterLeakageData = Array.from({ length: 5 }).map((_, i) => {
    const supply = 50 + Math.random() * 50;
    const outlet = supply - (Math.random() * 10);
    const leakDetected = (supply - outlet) > 5;
    return {
        supplyLineFlow: parseFloat(supply.toFixed(2)),
        outletLineFlow: parseFloat(outlet.toFixed(2)),
        groundMoisture: parseFloat((20 + Math.random() * 60).toFixed(2)),
        leakDetected: leakDetected,
        leakSeverity: leakDetected ? ["Low", "Medium", "High"][Math.floor(Math.random() * 3)] : "Low",
        autoShutoffTriggered: leakDetected && Math.random() > 0.5,
        status: leakDetected ? "Leak Detected" : "All Clear",
        timestamp: new Date()
    };
});

async function seedDB() {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB.');

        // Get collection references (creating them implicitly if they don't exist)
        const Pothole = mongoose.connection.collection('potholes');
        const Bridge = mongoose.connection.collection('bridge');
        const WaterLeakage = mongoose.connection.collection('waterleakage');

        // Optional: Clear existing data (uncomment if needed)
        // await Pothole.deleteMany({});
        // await Bridge.deleteMany({});
        // await WaterLeakage.deleteMany({});

        console.log('Inserting sample data...');

        const potholeResult = await Pothole.insertMany(potholesData);
        console.log(`Successfully inserted ${potholeResult.insertedCount} pothole documents.`);

        const bridgeResult = await Bridge.insertMany(bridgesData);
        console.log(`Successfully inserted ${bridgeResult.insertedCount} bridge documents.`);

        const waterResult = await WaterLeakage.insertMany(waterLeakageData);
        console.log(`Successfully inserted ${waterResult.insertedCount} water leakage documents.`);

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
        process.exit();
    }
}

seedDB();
