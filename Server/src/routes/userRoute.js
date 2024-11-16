const express = require('express');
const {
  signup,
  login,
  createStory,
  getStories,
  getProfile,
  updateProfile,
  getFeed,
  submitInterests,
  getUserStories,
  likeStory,
  getLikedStories,
  unlikeStory,
  getStoryById,
  updateStory
} = require('../controller/controller.js');
const authenticate = require('../middleware/auth.js');

const router = express.Router();

// Signup and Login Routes
router.post('/signup', signup); // Handle signup with name, email, and password
router.post('/login', login); // Handle login

// Interests Route
router.post('/interests', submitInterests); // Save user interests after signup

// Story Routes
router.post('/stories', authenticate, createStory); // Create story (requires authentication)
router.get('/stories', getStories); // Get all stories
router.get('/stories/user', authenticate, getUserStories); // Get stories for authenticated user
router.post('/stories/:storyId/like', authenticate, likeStory); // Like a story (requires authentication)
router.get('/stories/:userId', authenticate, getLikedStories);
router.delete('/stories/:storyId/like', authenticate, unlikeStory);
router.get('/clicked/stories/:storyId', getStoryById); // Get a specific story by ID
router.put('/stories/:storyId', authenticate, updateStory); // Update story (requires authentication)


// Profile Routes
router.get('/profiles', authenticate, getProfile); // Get user profile (requires authentication)
router.put('/profiles', authenticate, updateProfile); // Update user profile

// Feed Route
router.get('/feeds', authenticate, getFeed); // Get user feed (requires authentication)

module.exports = router;
