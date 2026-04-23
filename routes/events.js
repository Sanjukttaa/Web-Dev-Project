const express = require('express');
const { body, validationResult } = require('express-validator');
const { Event, Guest, Vendor, BudgetItem, Checklist } = require('../models');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user._id }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.user._id });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create event
router.post('/', [
  body('title').trim().isLength({ min: 2 }),
  body('date').isISO8601(),
  body('venue').trim().isLength({ min: 2 }),
  body('city').trim().isLength({ min: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const event = await Event.create({ ...req.body, userId: req.user._id });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    await Guest.deleteMany({ eventId: req.params.id });
    await Vendor.deleteMany({ eventId: req.params.id });
    await BudgetItem.deleteMany({ eventId: req.params.id });
    await Checklist.deleteMany({ eventId: req.params.id });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get event stats
router.get('/:id/stats', async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.user._id });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const guests = await Guest.find({ eventId: req.params.id });
    const vendors = await Vendor.find({ eventId: req.params.id });
    const budget = await BudgetItem.find({ eventId: req.params.id });

    const confirmed = guests.filter(g => g.rsvp === 'confirmed').length;
    const declined = guests.filter(g => g.rsvp === 'declined').length;
    const pending = guests.filter(g => g.rsvp === 'pending').length;
    const totalEstimated = budget.reduce((sum, b) => sum + b.estimated, 0);
    const totalActual = budget.reduce((sum, b) => sum + b.actual, 0);

    res.json({
      event,
      guestStats: { total: guests.length, confirmed, declined, pending },
      vendorStats: { total: vendors.length, booked: vendors.filter(v => v.status === 'booked' || v.status === 'confirmed').length },
      budgetStats: { estimated: totalEstimated, actual: totalActual, remaining: event.budget - totalActual }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
