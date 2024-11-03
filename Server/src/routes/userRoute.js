// src/routes/userRoute.js
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
  getUserStories 
} = require('../controller/controller.js');
const authenticate = require('../middleware/auth.js');

const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);


router.post('/profiles/interests', authenticate, submitInterests);


router.post('/stories', authenticate, createStory);
router.get('/stories', getStories);


router.get('/stories/user', authenticate, getUserStories); 


router.get('/profiles', authenticate, getProfile);
router.put('/profiles', authenticate, updateProfile);


router.get('/feeds', authenticate, getFeed);


module.exports = router;
