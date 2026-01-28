const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Register route
router.post('/signup', authController.signup);

// Login route
router.post('/login', authController.login);

// Get current user profile
router.get('/me', protect, authController.getMe);

// Update profile
router.put('/update-profile', protect, authController.updateProfile);

// Update password
router.put('/update-password', protect, authController.updatePassword);

// Logout
router.post('/logout', protect, authController.logout);

module.exports = router;