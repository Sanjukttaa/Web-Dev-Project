const express = require('express');
const { Guest } = require('../models');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Get guests by event
router.get('/event/:eventId', async (req, res) => {
  try {
    const { rsvp, search } = req.query;
    let query = { eventId: req.params.eventId, userId: req.user._id };
    if (rsvp) query.rsvp = rsvp;
    if (search) query.name = { $regex: search, $options: 'i' };
    const guests = await Guest.find(query).sort({ name: 1 });
    res.json(guests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create guest
router.post('/', async (req, res) => {
  try {
    const guest = await Guest.create({ ...req.body, userId: req.user._id });
    res.status(201).json(guest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update guest
router.put('/:id', async (req, res) => {
  try {
    const guest = await Guest.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!guest) return res.status(404).json({ error: 'Guest not found' });
    res.json(guest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete guest
router.delete('/:id', async (req, res) => {
  try {
    const guest = await Guest.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!guest) return res.status(404).json({ error: 'Guest not found' });
    res.json({ message: 'Guest removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
