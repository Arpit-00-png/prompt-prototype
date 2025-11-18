const express = require('express');
const Resource = require('../models/Resource');
const { auth, isTeacher } = require('../middleware/auth');
const { resourcesAgent } = require('../utils/geminiAgent');

const router = express.Router();

// Upload resource (Teacher only)
router.post('/', auth, isTeacher, async (req, res) => {
  try {
    const { title, description, type, fileUrl, batch, tags } = req.body;

    const resource = new Resource({
      title,
      description,
      type,
      fileUrl,
      uploadedBy: req.user.id,
      batch,
      tags: tags || []
    });

    await resource.save();

    // Agent processes the resource
    const agentResponse = await resourcesAgent('resource_uploaded', {
      title,
      type,
      batch
    });

    res.json({ resource, agentMessage: agentResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all resources for a batch
router.get('/batch/:batch', auth, async (req, res) => {
  try {
    const resources = await Resource.find({ batch: req.params.batch })
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all resources (for teacher)
router.get('/', auth, async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete resource (Teacher only)
router.delete('/:id', auth, isTeacher, async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

