const express = require('express');
const Menu = require('../models/Menu');
const MenuProposal = require('../models/MenuProposal');
const { auth } = require('../middleware/auth');
const { menuAgent } = require('../utils/geminiAgent');

const router = express.Router();

// Get today's menu
router.get('/menu/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const menu = await Menu.findOne({
      type: 'canteen',
      date: { $gte: today, $lt: tomorrow }
    });

    if (!menu) {
      return res.json({ message: 'No menu available for today' });
    }

    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get menu by date
router.get('/menu/:date', auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const menu = await Menu.findOne({
      type: 'canteen',
      date: { $gte: date, $lt: nextDay }
    });

    res.json(menu || { message: 'No menu available for this date' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create/Update menu (Admin/Teacher)
router.post('/menu', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { date, items } = req.body;

    const menu = await Menu.findOneAndUpdate(
      { type: 'canteen', date: new Date(date) },
      { items, type: 'canteen', date: new Date(date) },
      { upsert: true, new: true }
    );

    const agentResponse = await menuAgent('menu_updated', { type: 'canteen', date });

    res.json({ menu, agentMessage: agentResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit menu proposal
router.post('/proposal', auth, async (req, res) => {
  try {
    const { items } = req.body;

    const proposal = new MenuProposal({
      type: 'canteen',
      proposedBy: req.user.id,
      items
    });

    await proposal.save();
    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get proposals (Admin/Teacher)
router.get('/proposals', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const proposals = await MenuProposal.find({ type: 'canteen' })
      .populate('proposedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

