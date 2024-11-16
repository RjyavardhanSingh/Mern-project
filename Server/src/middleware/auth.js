const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const authenticate = async (req, res, next) => {
  // Get token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  // Check if token is present
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Attach the decoded data to req for use in the route handler
    req.userId = decoded.userId;  // Attach userId from token to req

    // Find the user associated with the token
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log('User not found for decoded ID:', decoded.userId);
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    // Attach the user object to the request for use in the route
    req.user = user;

    next();
  } catch (error) {
    console.error('Error during token verification:', error);
    res.status(401).json({ error: 'Unauthorized: Token verification failed' });
  }
};

module.exports = authenticate;
