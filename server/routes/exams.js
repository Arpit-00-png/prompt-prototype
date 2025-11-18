const express = require('express');
const Exam = require('../models/Exam');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create exam (Admin/Teacher)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, subject, date, time, duration, location, batch } = req.body;

    const exam = new Exam({
      title,
      subject,
      date,
      time,
      duration,
      location,
      batch
    });

    await exam.save();
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all exams
router.get('/', auth, async (req, res) => {
  try {
    const exams = await Exam.find()
      .sort({ date: 1 });

    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get upcoming exams
router.get('/upcoming', auth, async (req, res) => {
  try {
    const now = new Date();
    const exams = await Exam.find({ date: { $gte: now } })
      .sort({ date: 1 });

    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get exams by batch
router.get('/batch/:batch', auth, async (req, res) => {
  try {
    const exams = await Exam.find({ batch: req.params.batch })
      .sort({ date: 1 });

    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit suggestion
router.post('/:id/suggestion', auth, async (req, res) => {
  try {
    const { suggestion } = req.body;
    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    exam.suggestions.push({
      user: req.user.id,
      suggestion
    });

    await exam.save();
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

