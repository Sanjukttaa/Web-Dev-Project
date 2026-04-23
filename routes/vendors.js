const express = require('express');
const { Vendor } = require('../models');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Get all vendors with filtering
router.get('/', async (req, res) => {
  try {
    const { type, city, minPrice, maxPrice, status, search, eventId } = req.query;
    let query = { userId: req.user._id };
    if (type) query.type = type;
    if (city) query.city = { $regex: city, $options: 'i' };
    if (status) query.status = status;
    if (eventId) query.eventId = eventId;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) query.name = { $regex: search, $options: 'i' };

    const vendors = await Vendor.find(query).sort({ createdAt: -1 });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create vendor
router.post('/', async (req, res) => {
  try {
    const vendor = await Vendor.create({ ...req.body, userId: req.user._id });
    res.status(201).json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update vendor
router.put('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete vendor
router.delete('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.json({ message: 'Vendor removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
