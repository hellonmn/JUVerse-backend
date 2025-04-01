const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Authentication Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected Route Example
// router.get('/admin', authMiddleware, roleMiddleware('admin'), (req, res) => {
//     res.json({ message: 'Welcome Admin!' });
// });

module.exports = router;
