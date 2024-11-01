const User = require('../models/User.js');
const Story = require('../models/Story.js');
const Profile = require('../models/Profile.js');
const bcrypt = require('bcrypt');


const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      
      const newUser = new User({ name, email, password }); 
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await password === user.password) {
      res.status(200).json({ message: 'Login successful!', userId: user._id, name: user.name });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};


const createStory = async (req, res) => {
  const { title, content, author, tags } = req.body;
  try {
    const newStory = new Story({ title, content, author, tags });
    await newStory.save();
    res.status(201).json({ message: 'Story created successfully!', storyId: newStory._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create story' });
  }
};


const getStories = async (req, res) => {
  try {
    const stories = await Story.find().populate('author', 'name');
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
};


const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId }).populate('stories');
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};


const updateProfile = async (req, res) => {
  const { bio, interests } = req.body;
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.params.userId },
      { bio, interests, updatedAt: Date.now() },
      { new: true }
    );
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};


const getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const stories = await Story.find({ tags: { $in: user.interests } }).populate('author', 'name');
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
};

module.exports = {
  signup,
  login,
  createStory,
  getStories,
  getProfile,
  updateProfile,
  getFeed
};
