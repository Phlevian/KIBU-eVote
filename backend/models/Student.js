const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    // Personal Information
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    middleName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },

    // Registration Number (e.g., BIT/0019/23)
    registrationNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },

    // Contact
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },

    // Academic Info
    faculty: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    yearOfStudy: {
        type: Number,
        required: true
    },

    // Password
    password: {
        type: String,
        required: true,
        select: false
    },

    // Profile Photo
    profilePhoto: {
        type: String,
        default: null
    },

    // Account Status
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    }
}, {
    timestamps: true
});

// Hash password before saving
studentSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password for login
studentSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);