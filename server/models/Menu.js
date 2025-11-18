const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['canteen', 'mess'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  items: [{
    name: String,
    price: Number,
    category: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Menu', menuSchema);

