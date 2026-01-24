const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @desc    Register new student
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
    try {
        const {
            firstName,
            middleName,
            lastName,
            registrationNumber,
            email,
            phone,
            faculty,
            course,
            yearOfStudy,
            password,
            profilePhoto
        } = req.body;

        // Check if student already exists
        const existingStudent = await Student.findOne({
            $or: [{ email }, { registrationNumber }]
        });

        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: existingStudent.email === email 
                    ? 'Email already registered' 
                    : 'Registration number already exists'
            });
        }

        // Create new student
        const student = await Student.create({
            firstName,
            middleName,
            lastName,
            registrationNumber,
            email,
            phone,
            faculty,
            course,
            yearOfStudy,
            password,
            profilePhoto
        });

        // Generate token
        const token = generateToken(student._id);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                student: {
                    id: student._id,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    registrationNumber: student.registrationNumber,
                    email: student.email,
                    role: student.role
                },
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


// @desc    Login student
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { registrationNumber, password } = req.body;

        // Validate input
        if (!registrationNumber || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide registration number and password'
            });
        }

        // Find student and include password field
        const student = await Student.findOne({ registrationNumber }).select('+password');

        if (!student) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordCorrect = await student.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(student._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                student: {
                    id: student._id,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    registrationNumber: student.registrationNumber,
                    email: student.email,
                    faculty: student.faculty,
                    yearOfStudy: student.yearOfStudy,
                    role: student.role,
                    isVerified: student.isVerified
                },
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
// @desc    Update student profile
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const {
            firstName,
            middleName,
            lastName,
            phone,
            faculty,
            course,
            yearOfStudy,
            profilePhoto
        } = req.body;

        // Find student
        const student = await Student.findById(req.student.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Update fields if provided
        if (firstName !== undefined) student.firstName = firstName;
        if (middleName !== undefined) student.middleName = middleName;
        if (lastName !== undefined) student.lastName = lastName;
        if (phone !== undefined) student.phone = phone;
        if (faculty !== undefined) student.faculty = faculty;
        if (course !== undefined) student.course = course;
        if (yearOfStudy !== undefined) student.yearOfStudy = yearOfStudy;
        if (profilePhoto !== undefined) student.profilePhoto = profilePhoto;

        // Save updated student
        await student.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                student: {
                    id: student._id,
                    firstName: student.firstName,
                    middleName: student.middleName,
                    lastName: student.lastName,
                    registrationNumber: student.registrationNumber,
                    email: student.email,
                    phone: student.phone,
                    faculty: student.faculty,
                    course: student.course,
                    yearOfStudy: student.yearOfStudy,
                    profilePhoto: student.profilePhoto,
                    role: student.role,
                    isVerified: student.isVerified,
                    createdAt: student.createdAt
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Profile update failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get current logged in student
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const student = await Student.findById(req.student.id);

        res.status(200).json({
            success: true,
            data: {
                student: {
                    id: student._id,
                    firstName: student.firstName,
                    middleName: student.middleName,
                    lastName: student.lastName,
                    registrationNumber: student.registrationNumber,
                    email: student.email,
                    phone: student.phone,
                    faculty: student.faculty,
                    course: student.course,
                    yearOfStudy: student.yearOfStudy,
                    profilePhoto: student.profilePhoto,
                    role: student.role,
                    isVerified: student.isVerified,
                    createdAt: student.createdAt
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user data',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Logout student
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    try {
        // If using cookies, clear the cookie
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        // Get student with password
        const student = await Student.findById(req.student.id).select('+password');

        // Check current password
        const isMatch = await student.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        student.password = newPassword;
        await student.save();

        // Generate new token
        const token = generateToken(student._id);

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            data: { token }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Password update failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};