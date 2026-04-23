const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'planner', 'client'], default: 'planner' },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Event Schema
const eventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ['wedding', 'birthday', 'corporate', 'anniversary', 'other'], default: 'wedding' },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  city: { type: String, required: true },
  guestCount: { type: Number, default: 0 },
  budget: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
  status: { type: String, enum: ['planning', 'confirmed', 'completed', 'cancelled'], default: 'planning' },
  notes: { type: String, default: '' },
  color: { type: String, default: '#c9a96e' },
  createdAt: { type: Date, default: Date.now }
});

// Guest Schema
const guestSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  rsvp: { type: String, enum: ['pending', 'confirmed', 'declined', 'maybe'], default: 'pending' },
  plusOne: { type: Boolean, default: false },
  table: { type: String, default: '' },
  dietary: { type: String, default: '' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Vendor Schema
const vendorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['catering', 'photography', 'music', 'florist', 'venue', 'cake', 'transport', 'decor', 'other'], required: true },
  contact: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  city: { type: String, default: '' },
  price: { type: Number, default: 0 },
  status: { type: String, enum: ['contacted', 'booked', 'confirmed', 'cancelled'], default: 'contacted' },
  rating: { type: Number, min: 1, max: 5, default: 3 },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Budget Item Schema
const budgetItemSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  estimated: { type: Number, default: 0 },
  actual: { type: Number, default: 0 },
  paid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Checklist Task Schema
const checklistSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Event = mongoose.model('Event', eventSchema);
const Guest = mongoose.model('Guest', guestSchema);
const Vendor = mongoose.model('Vendor', vendorSchema);
const BudgetItem = mongoose.model('BudgetItem', budgetItemSchema);
const Checklist = mongoose.model('Checklist', checklistSchema);

module.exports = { User, Event, Guest, Vendor, BudgetItem, Checklist };
