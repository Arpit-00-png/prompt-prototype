const express = require('express');
const Report = require('../models/Report');
const { auth, isStudent } = require('../middleware/auth');
const { reportGenerationAgent } = require('../utils/geminiAgent');

const router = express.Router();

// Predefined questions for feedback
const FEEDBACK_QUESTIONS = [
  'How would you rate the teacher\'s clarity in explaining concepts?',
  'How effective is the teacher\'s communication style?',
  'How well does the teacher engage students in class?',
  'How approachable is the teacher for doubts and questions?',
  'How would you rate the teacher\'s preparation and organization?',
  'What are the teacher\'s main strengths?',
  'What areas do you think the teacher could improve?',
  'Any additional comments or suggestions?'
];

// Get feedback questions
router.get('/questions', auth, (req, res) => {
  res.json({ questions: FEEDBACK_QUESTIONS });
});

// Submit feedback (Student only, anonymous)
router.post('/submit', auth, isStudent, async (req, res) => {
  try {
    const { facultyId, responses } = req.body;

    const report = new Report({
      faculty: facultyId,
      responses: responses.map((answer, index) => ({
        question: FEEDBACK_QUESTIONS[index],
        answer
      }))
    });

    // Generate report using Gemini agent
    const generatedReport = await reportGenerationAgent(report.responses);
    report.generatedReport = generatedReport;

    await report.save();

    res.json({ message: 'Feedback submitted successfully', reportId: report._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reports for faculty (only their own reports)
router.get('/faculty/me', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const reports = await Report.find({ faculty: req.user.id })
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific report
router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('faculty', 'name email');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Only faculty can see their own reports
    if (req.user.role === 'teacher' && report.faculty._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

