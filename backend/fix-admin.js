// backend/fix-admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Student = require('./models/Student');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kibu_evote';

async function fixAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // DELETE ALL existing admin records (to be safe)
    const deleteResult = await Student.deleteMany({ role: 'admin' });
    console.log(`🗑️ Deleted ${deleteResult.deletedCount} existing admin(s)`);

    // Create a brand new admin with hashed password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await Student.create({
      firstName: 'Admin',
      lastName: 'User',
      registrationNumber: 'ADMIN/0001/25',
      email: 'admin@kibu.edu',
      phone: '0712345678',
      faculty: 'Administration',
      course: 'System Admin',
      yearOfStudy: 1,
      password: hashedPassword,
      role: 'admin',
      isVerified: true
    });

    console.log(`✅ New admin created with ID: ${admin._id}`);
    console.log(`📧 Email: admin@kibu.edu`);
    console.log(`🔑 Password: admin123`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

fixAdmin();