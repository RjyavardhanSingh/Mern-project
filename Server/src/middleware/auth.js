const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Authorization header:', req.headers.authorization);

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // console.log('Decoded token:', decoded);

    
    const user = await User.findById(decoded.userId);
    if (!user) {
      // console.log('User not found for decoded ID:', decoded.userId);
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    // console.log('Authenticated user:', user);
    req.user = user;
    next();
  } catch (error) {
    console.error('Error during token verification:', error);
    res.status(401).json({ error: 'Unauthorized: Token verification failed' });
  }
};

module.exports = authenticate;