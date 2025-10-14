const express = require('express');
const { signup, login, getProfile, updateProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Debug: Check if functions are imported correctly - FIXED VERSION
console.log('🔧 Auth routes loaded:');
console.log('   signup:', typeof signup);
console.log('   login:', typeof login);
console.log('   getProfile:', typeof getProfile);
console.log('   updateProfile:', typeof updateProfile);

// Routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;