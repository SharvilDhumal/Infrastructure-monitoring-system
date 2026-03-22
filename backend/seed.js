const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env' });
const User = require('./src/models/User');

const seedUsers = [
  {
    name: 'Main Admin',
    email: 'admin@gmail.com',
    password: 'Admin@123',
    role: 'admin',
    isVerified: true
  },
  {
    name: 'Pothole Admin',
    email: 'admin@pothole',
    password: 'pass123',
    role: 'pothole_admin',
    isVerified: true
  },
  {
    name: 'Bridge Admin',
    email: 'admin@bridge',
    password: 'pass123',
    role: 'bridge_admin',
    isVerified: true
  },
  {
    name: 'Streetlight Admin',
    email: 'admin@streetlights',
    password: 'pass123',
    role: 'streetlight_admin',
    isVerified: true
  },
  {
    name: 'Water Admin',
    email: 'admin@water',
    password: 'pass123',
    role: 'water_admin',
    isVerified: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    for (const u of seedUsers) {
      const existingUser = await User.findOne({ email: u.email });
      if (existingUser) {
        console.log(`User ${u.email} already exists, updating role...`);
        existingUser.role = u.role;
        await existingUser.save();
      } else {
        console.log(`Creating user: ${u.email}`);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u.password, salt);
        await User.create({
          ...u,
          password: hashedPassword
        });
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
