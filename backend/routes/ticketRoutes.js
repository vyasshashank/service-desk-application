const express = require('express');
const Ticket = require('../models/Ticket');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/', async (req, res) => {
  const { token } = req.headers;
  const { description, priority, category } = req.body;

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, 'secret');
    const newTicket = new Ticket({
      user: decoded.userId,
      description,
      priority,
      category,
    });
    await newTicket.save();
    res.status(201).json({ message: 'Ticket created successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
});

router.get('/', async (req, res) => {
  const tickets = await Ticket.find().populate('user', 'username email');
  res.json(tickets);
});

// Additional routes for updating ticket status, assigning tickets, etc.

module.exports = router;
