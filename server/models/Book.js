const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  isbn: {
    type: String
  },
  category: {
    type: String
  },
  available: {
    type: Boolean,
    default: true
  },
  totalCopies: {
    type: Number,
    default: 1
  },
  availableCopies: {
    type: Number,
    default: 1
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Book', bookSchema);

