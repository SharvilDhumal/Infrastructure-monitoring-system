const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://infravisonAI:InfravisionAI%402026@cluster0.cwovzrd.mongodb.net/auth-db';

async function clearDB() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB.');

        const collections = ['potholes', 'bridge', 'waterleakage', 'streetlights', 'issues', 'assigned_issues', 'resolved_issues'];

        for (const colName of collections) {
            console.log(`Clearing collection: ${colName}...`);
            await mongoose.connection.collection(colName).deleteMany({});
        }

        console.log('All specified collections cleared successfully!');
    } catch (error) {
        console.error('Error clearing database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
        process.exit();
    }
}

clearDB();
