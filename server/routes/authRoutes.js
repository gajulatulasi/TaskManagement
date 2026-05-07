const express = require('express');
const router = express.Router();
const { signup, login, getAllUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/users', protect, getAllUsers);

module.exports = router;
