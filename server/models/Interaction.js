const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['doubt', 'quiz', 'academic', 'participation'],
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  awardedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Interaction', interactionSchema);

