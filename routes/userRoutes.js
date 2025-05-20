

const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController'); // Ensure this is correctly imported

// POST request for user registration
router.post('/register', registerUser);

// POST request for user login
router.post('/login', loginUser);

module.exports = router;
