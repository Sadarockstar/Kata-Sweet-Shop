const express = require('express');
const { check } = require('express-validator');
const { protect, admin } = require('../middleware/auth.middleware');
const {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
} = require('../controllers/sweets.controller');

const router = express.Router();

// Protect all routes
router.use(protect);

// @route   POST /api/sweets
router.post(
  '/',
  admin,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Valid category is required').isIn(['chocolate', 'candy', 'gummy', 'lollipop', 'other']),
    check('price', 'Price must be a positive number').isFloat({ min: 0 }),
    check('quantity', 'Quantity must be a non-negative integer').isInt({ min: 0 })
  ],
  createSweet
);

// @route   GET /api/sweets
router.get('/', getAllSweets);

// @route   GET /api/sweets/search
router.get('/search', searchSweets);

// @route   PUT /api/sweets/:id
router.put(
  '/:id',
  admin,
  [
    check('name', 'Name is required').optional().not().isEmpty(),
    check('description', 'Description is required').optional().not().isEmpty(),
    check('category', 'Valid category is required').optional().isIn(['chocolate', 'candy', 'gummy', 'lollipop', 'other']),
    check('price', 'Price must be a positive number').optional().isFloat({ min: 0 }),
    check('quantity', 'Quantity must be a non-negative integer').optional().isInt({ min: 0 })
  ],
  updateSweet
);

// @route   DELETE /api/sweets/:id
router.delete('/:id', admin, deleteSweet);

// @route   POST /api/sweets/:id/purchase
router.post(
  '/:id/purchase',
  [
    check('quantity', 'Quantity must be a positive integer').isInt({ min: 1 })
  ],
  purchaseSweet
);

// @route   POST /api/sweets/:id/restock
router.post(
  '/:id/restock',
  admin,
  [
    check('quantity', 'Quantity must be a positive integer').isInt({ min: 1 })
  ],
  restockSweet
);

module.exports = router;