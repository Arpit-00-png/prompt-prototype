const mongoose = require('mongoose');

const menuProposalSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['canteen', 'mess'],
    required: true
  },
  proposedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    name: String,
    price: Number,
    category: String,
    reason: String
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MenuProposal', menuProposalSchema);

