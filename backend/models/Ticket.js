const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  priority: { type: String, required: true }, // low, medium, high
  category: { type: String, required: true },
  status: { type: String, default: 'open' }, // open, in-progress, resolved
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ticket', ticketSchema);
