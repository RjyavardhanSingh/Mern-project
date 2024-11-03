const User = require('../models/User.js');
const Story = require('../models/Story.js');
const Profile = require('../models/Profile.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;


const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
     
      const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login successful!', token, userId: user._id, name: user.name });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

const submitInterests = async (req, res) => {
  const { interests } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id }, 
      { interests },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Interests updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update interests', error: error.message });
  }
};

const createStory = async (req, res) => {
  const { title, content, tags } = req.body;


  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }
  

  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
  }

  try {
    const newStory = new Story({
      title,
      content,
      author: req.user.name, 
      tags: Array.isArray(tags) ? tags : [], 
    });

    await newStory.save();
    return res.status(201).json({ message: 'Story created successfully!', story: newStory });
  } catch (error) {
    console.error('Error creating story:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error: ' + error.message });
    }
    
    return res.status(500).json({ message: 'Error saving the story. Please try again.' });
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
    const user = await User.findById(req.user._id)
    const stories = await Story.find({ author: user.name })

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user, stories }); 
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};


const updateProfile = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const updateFields = {};
    if (email) updateFields.email = email;
    if (name) updateFields.name = name;
    if (password) updateFields.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(
      req.user._id, 
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};


const getFeed = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stories = await Story.find({ tags: { $in: user.interests } }).populate('author', 'name');

    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
};


const getUserStories = async (req, res) => {
  try {
      const stories = await Story.find({ author: req.user._id })
          .sort({ createdAt: -1 }); 
      
      res.status(200).json({
          success: true,
          data: stories
      });
      
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Error fetching stories',
          error: error.message
      });
  }
};

module.exports = {
  signup,
  login,
  createStory,
  getStories,
  getProfile,
  updateProfile,
  getFeed,
  submitInterests,
  getUserStories,
};
