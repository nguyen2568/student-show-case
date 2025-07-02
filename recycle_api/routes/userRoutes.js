const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const authorize = require('../middlewares/authorize'); // Import the authorize middleware

// Protected route to get user data
router.get('', authorize, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshToken'); // Exclude sensitive fields
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user data', error: err.message });
  }
});

router.post('/accumulatePoints', authorize, async (req, res) => {
  const { material } = req.body; // Assuming points is sent in the request body

  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const point = user.accumulatedPoints.find(p => p.material === material);

    if (point) {
      point.count += 1;           // or point.count += 5;
    } else {
      // create a brand-new entry if it doesn’t exist
      user.accumulatedPoints.push({ material, count: 1 });
    }

    await user.save();
    res.json({ success: true, message: 'Points accumulated successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Error accumulating points', error: err.message });
  }
});

module.exports = router;

