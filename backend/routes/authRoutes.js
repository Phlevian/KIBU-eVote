const express = require('express');
const router = express.Router();
const {
    signup,
    login,
    getMe,
    logout,
    updatePassword
} = require('../controllers/authController');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (will add middleware later)
router.get('/me', getMe);
router.post('/logout', logout);
router.put('/update-password', updatePassword);

module.exports = router;