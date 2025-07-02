const jwt = require('jsonwebtoken');

const authorize = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access Denied'); // No token provided

  try {
    // Remove "Bearer " prefix if present
    const cleanToken = token.replace(/^Bearer\s+/i, '');
    const verified = jwt.verify(cleanToken, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).send('Token Expired'); // Token expired
    }
    return res.status(403).send('Invalid Token'); // Invalid token
  }
};

module.exports = authorize;