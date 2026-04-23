const express = require('express');
const { BudgetItem } = require('../models');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Get budget items for event
router.get('/event/:eventId', async (req, res) => {
  try {
    const items = await BudgetItem.find({ eventId: req.params.eventId, userId: req.user._id }).sort({ category: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create budget item
router.post('/', async (req, res) => {
  try {
    const item = await BudgetItem.create({ ...req.body, userId: req.user._id });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update budget item
router.put('/:id', async (req, res) => {
  try {
    const item = await BudgetItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete budget item
router.delete('/:id', async (req, res) => {
  try {
    const item = await BudgetItem.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Budget item removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
