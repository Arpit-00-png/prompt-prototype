const express = require('express');
const Interaction = require('../models/Interaction');
const User = require('../models/User');
const { auth, isTeacher } = require('../middleware/auth');

const router = express.Router();

// Award points (Teacher only)
router.post('/award', auth, isTeacher, async (req, res) => {
  try {
    const { studentId, type, points, description } = req.body;

    const interaction = new Interaction({
      student: studentId,
      type,
      points,
      description,
      awardedBy: req.user.id
    });

    await interaction.save();

    // Update student's total points
    const student = await User.findById(studentId);
    if (student) {
      student.points += points;
      await student.save();
    }

    res.json(interaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const leaderboard = await User.find({ role: 'student' })
      .select('name email points studentId batch')
      .sort({ points: -1 })
      .limit(50);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student's interaction history
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const interactions = await Interaction.find({ student: req.params.studentId })
      .populate('awardedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(interactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my interactions
router.get('/me', auth, async (req, res) => {
  try {
    const interactions = await Interaction.find({ student: req.user.id })
      .populate('awardedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(interactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

