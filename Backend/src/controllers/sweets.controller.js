const Sweet = require('../models/sweet.model');
const { validationResult } = require('express-validator');

// @desc    Create a new sweet
// @route   POST /api/sweets
// @access  Private/Admin
const createSweet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const sweet = new Sweet({
      ...req.body,
      createdBy: req.user._id
    });

    const createdSweet = await sweet.save();
    res.status(201).json({
      success: true,
      data: createdSweet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all sweets
// @route   GET /api/sweets
// @access  Private
const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find({}).populate('createdBy', 'username');
    res.json({
      success: true,
      data: sweets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Search sweets
// @route   GET /api/sweets/search
// @access  Private
const searchSweets = async (req, res) => {
  try {
    const { query, category, minPrice, maxPrice } = req.query;
    
    let searchQuery = {};
    
    // Text search if query provided
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    
    // Category filter
    if (category) {
      searchQuery.category = category;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = Number(minPrice);
      if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
    }

    console.log('Search Query:', JSON.stringify(searchQuery, null, 2));

    const sweets = await Sweet.find(searchQuery).populate('createdBy', 'username');
    res.json({
      success: true,
      data: sweets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update sweet
// @route   PUT /api/sweets/:id
// @access  Private/Admin
const updateSweet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    Object.keys(req.body).forEach(key => {
      sweet[key] = req.body[key];
    });

    const updatedSweet = await sweet.save();
    res.json({
      success: true,
      data: updatedSweet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete sweet
// @route   DELETE /api/sweets/:id
// @access  Private/Admin
const deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    await sweet.remove();
    res.json({
      success: true,
      message: 'Sweet removed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Purchase sweet
// @route   POST /api/sweets/:id/purchase
// @access  Private
const purchaseSweet = async (req, res) => {
  try {
    const { quantity } = req.body;
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    if (sweet.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient quantity available'
      });
    }

    sweet.quantity -= quantity;
    const updatedSweet = await sweet.save();

    res.json({
      success: true,
      data: updatedSweet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Restock sweet
// @route   POST /api/sweets/:id/restock
// @access  Private/Admin
const restockSweet = async (req, res) => {
  try {
    const { quantity } = req.body;
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    sweet.quantity += quantity;
    const updatedSweet = await sweet.save();

    res.json({
      success: true,
      data: updatedSweet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
};