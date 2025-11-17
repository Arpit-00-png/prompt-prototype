const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Gym information (can be extended with equipment, schedules, etc.)
router.get('/info', auth, async (req, res) => {
  try {
    res.json({
      message: 'Gym facilities available',
      hours: '6:00 AM - 10:00 PM',
      equipment: ['Treadmills', 'Weights', 'Yoga mats', 'Exercise bikes'],
      status: 'Open'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

