// src/routes/userRoute.js
const express = require('express');
const {
  signup,
  login,
  createStory,
  getStories,
  getProfile,
  updateProfile,
  getFeed
} = require('../controller/controller.js');

const router = express.Router();

// User Routes
router.post('/signup', signup);
router.post('/login', login);

// Story Routes
router.post('/stories', createStory);
router.get('/stories', getStories);

// Profile Routes
router.get('/profiles/:userId', getProfile);
router.put('/profiles/:userId', updateProfile);

// Feed Routes
router.get('/feeds/:userId', getFeed);

// Export the router
module.exports = router;
