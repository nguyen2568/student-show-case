const express = require('express');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js'); // Replace crypto with crypto-js
const router = express.Router();
const User = require('../models/User');

// Sign-Up Route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a username and password'
    });
  }
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username: {$regex: new RegExp(username, 'i')} });

    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'Username already exists' 
      });
    }

    // Create new user
    const user = new User({
      username,
      password,
    });

    await user.save();

    //generate access token
    const accessToken = signToken(user);

    // Generate refresh token
    const refreshToken = jwt.sign(
      { _id: user._id }, 
      process.env.JWT_REFRESH_SECRET, 
      { expiresIn: '7d' }
    );

    // Optionally store the refresh token in the database or cache
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      id: user._id,
      user: username,
      accessToken, 
      refreshToken,
      encryptedQR: encryptId(`${username}`),
    });
  } catch (err) {
    res.status(500).json({ 
      error: err.message 
    });
  }
});

const signToken = (user) => {
  return jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Sign-In Route
router.post('/login', async (req, res) => {

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ 
      message: 'Username and password are required'
    });
  }

  try {
    // Find user by username
    const user = await User.findOne({ username: {$regex: new RegExp(username, 'i')} });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Validate password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate access token
    const accessToken = signToken(user);
    const refreshToken = user.refreshToken;

    // Generate a new refresh token if it doesn't exist
    if (refreshToken && !verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET)) {
      const newRefreshToken = jwt.sign(
        { _id: user._id }, 
        process.env.JWT_REFRESH_SECRET, 
        { expiresIn: '7d' }
      );
      user.refreshToken = newRefreshToken;
      await user.save();
    }

    // Optionally store the refresh token in the database or cache
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      id: user._id,
      user: username,
      accessToken, 
      refreshToken,
      encryptedQR: encryptId(`${username}`),
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error during authentication',
      error: err.message 
    });
  }
});

const verifyToken = (token, secretKey) => {
  
  if(secretKey === undefined) {
    secretKey = process.env.JWT_SECRET;
  }

  const verified = jwt.verify(token, secretKey);

  return verified;
}

const encryptId = (id) => {
  const key = CryptoJS.SHA256(process.env.ENCRYPTION_KEY);              // 32-byte key
  const iv  = CryptoJS.lib.WordArray.random(16);    // 16-byte IV

  const cp = CryptoJS.AES.encrypt(id, key, { iv }); // AES-CBC
  const ivB64  = iv.toString(CryptoJS.enc.Base64);
  const ctB64  = cp.ciphertext.toString(CryptoJS.enc.Base64);
  return `${ivB64}:${ctB64}`;
};


// Refresh Token Route
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).send('Access Denied');
  
  try {
    // Check if the refresh token exists in the database
    const storedToken = await User.findOne({ refreshToken });
    
    if (!storedToken) return res.status(403).send('Invalid Refresh Token');

    // Verify the refresh token
    const verified = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Issue a new access token
    
    const newToken = signToken(storedToken);

    res.json({ accessToken: newToken, refreshToken, user: storedToken.username, id: verified._id, encryptedQR: encryptId(`${storedToken.username}`) });
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
});

module.exports = {
  router,
  verifyToken,
  encryptId
};