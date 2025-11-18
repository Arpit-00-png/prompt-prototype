const express = require('express');
const Event = require('../models/Event');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create event (Admin/Teacher)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, club, date, time, location } = req.body;

    const event = new Event({
      title,
      description,
      club,
      date,
      time,
      location
    });

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all events
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: 1 })
      .populate('volunteers', 'name email')
      .populate('registered', 'name email');

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get upcoming events
router.get('/upcoming', auth, async (req, res) => {
  try {
    const now = new Date();
    const events = await Event.find({ date: { $gte: now } })
      .sort({ date: 1 })
      .populate('volunteers', 'name email')
      .populate('registered', 'name email');

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register for event
router.post('/:id/register', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.registered.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already registered' });
    }

    event.registered.push(req.user.id);
    await event.save();

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Volunteer for event
router.post('/:id/volunteer', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.volunteers.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already volunteering' });
    }

    event.volunteers.push(req.user.id);
    await event.save();

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit suggestion
router.post('/:id/suggestion', auth, async (req, res) => {
  try {
    const { suggestion } = req.body;
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.suggestions.push({
      user: req.user.id,
      suggestion
    });

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

