const mongoose = require('mongoose');

const sweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['chocolate', 'candy', 'gummy', 'lollipop', 'other']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  image: {
    type: String,
    default: 'default-sweet.jpg'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create index for search functionality
sweetSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model('Sweet', sweetSchema);