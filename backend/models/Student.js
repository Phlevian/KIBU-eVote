const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    faculty: { type: String, required: true },
    course: { type: String, required: true },
    yearOfStudy: { type: Number, required: true },
    password: { type: String, required: true, select: false },
    profilePhoto: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ['student', 'admin'], default: 'student' }
}, { timestamps: true });

studentSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

studentSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);