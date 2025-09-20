const express = require('express');
const { check } = require('express-validator');
const { register, login } = require('../controllers/auth.controller');

const router = express.Router();

// @route   POST /api/auth/register
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  register
);

// @route   POST /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

module.exports = router;