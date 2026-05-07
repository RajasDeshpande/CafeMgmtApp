const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Beverages', 'Snacks', 'Mains', 'Desserts'],
  },
  image: {
    type: String,
    default: '',
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  orderCount: {
    type: Number,
    default: 0,
  },
  isVeg: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for popular items query
menuItemSchema.index({ orderCount: -1 });
// Index for category filter
menuItemSchema.index({ category: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
