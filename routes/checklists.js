const express = require('express');
const { body, validationResult } = require('express-validator');
const { Checklist } = require('../models');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Get checklist items for an event
router.get('/event/:eventId', async (req, res) => {
  try {
    const items = await Checklist.find({ eventId: req.params.eventId, userId: req.user._id }).sort({ dueDate: 1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single checklist item
router.get('/:id', async (req, res) => {
  try {
    const item = await Checklist.findOne({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ error: 'Task not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create checklist item
router.post('/', [
  body('title').trim().isLength({ min: 2 }).withMessage('Task title must be at least 2 characters'),
  body('eventId').notEmpty().withMessage('Event is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const item = await Checklist.create({ ...req.body, userId: req.user._id, completed: !!req.body.completed });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update checklist item
router.put('/:id', async (req, res) => {
  try {
    const item = await Checklist.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body, completed: req.body.completed === true || req.body.completed === 'true' },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Task not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete checklist item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Checklist.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
