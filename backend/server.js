require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path to your User model
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT || 5000;
// Middleware setup
app.use(cors());
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' })); // Adjust if your frontend is on a different port
app.use(bodyParser.json());

// MongoDB connection setup
const MONGO_URI = 'mongodb://localhost:27017/service-desk'; // Update with your MongoDB URI if different
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// User login route
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords (bcrypt is used for hashed passwords)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User registration route (for completeness)
app.post('/api/users/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Use routes
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Service Desk Application API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


