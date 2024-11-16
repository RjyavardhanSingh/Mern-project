const User = require('../models/User.js');
const Story = require('../models/Story.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');


dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
// User Signup
const signup = async (req, res) => {
  const { name, email, password, bio } = req.body;
  console.log('Received signup data:', req.body);  // Add logging

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      bio: bio || '',  // Default to empty bio if not provided
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    res.status(201).json({
      message: 'User created successfully!',
      token,
      user: savedUser,
      userId: savedUser._id,
    });

  } catch (error) {
    console.error('Error during signup:', error);  // Add logging
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
};





// User Login
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

// Submit User Interests
const submitInterests = async (req, res) => {
  const { interests, userId } = req.body;

  if (!interests || !userId) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  try {
    // Assuming you're saving to a database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.interests = interests;
    await user.save();

    return res.status(200).json({ message: 'Interests updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



// Create Story
const createStory = async (req, res) => {
  const { title, content, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
  }

  try {
    // Assuming req.user contains the logged-in user's details (including _id)
    const newStory = new Story({
      title,
      content,
      author: req.user._id,  // Use the authenticated user's ObjectId
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


// Get Stories
// Get all stories
const getStories = async (req, res) => {
  try {
    // Populate the 'author' field with the name of the user
    const stories = await Story.find().populate('author', 'name');
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
};

// Get User Profile and Stories
const getProfile = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const stories = await Story.find({ author: user._id });
    res.status(200).json({ user, stories });
  } catch (error) {
    console.error(error);  // Log the error for better debugging
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};




// Update User Profile
const updateProfile = async (req, res) => {
  const { email, name, bio } = req.body;

  try {
    const updateFields = {};

    if (email) updateFields.email = email;
    if (name) updateFields.name = name;
    if (bio) updateFields.bio = bio;

    // Check if email already exists before updating it
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
    }

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





// Get Feed Based on User Interests
const getFeed = async (req, res) => {
  try {
    // Fetch the authenticated user's interests and convert them to lowercase
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userInterests = user.interests.map((interest) => interest.toLowerCase());

    // Fetch stories with tags that match any of the user's interests
    const stories = await Story.find({
      tags: { $in: userInterests }
    })
      .populate('author', 'name')  // Populate author name
      .sort({ createdAt: -1 });    // Sort stories by creation date (most recent first)

    res.status(200).json(stories);  // Return the stories in response
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
};


// Get User Stories
const getUserStories = async (req, res) => {
  try {
    const stories = await Story.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: stories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching stories', error: error.message });
  }
};

const updateStory = async (req, res) => {
  const { storyId } = req.params;
  const { title, content, tags } = req.body;

  try {
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    story.title = title || story.title;
    story.content = content || story.content;
    story.tags = tags || story.tags;

    await story.save();

    res.status(200).json({ success: true, message: 'Story updated successfully', data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating story', error: error.message });
  }
};


// Like Story
const likeStory = async (req, res) => {
  const { storyId } = req.params; // Get storyId from URL parameters
  const userId = req.body.userId; // Get userId from the request body

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' }); // Ensure userId is sent
  }

  try {
    // Find the story by ID
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if the user has already liked the story
    if (story.likes.includes(userId)) {
      return res.status(400).json({ message: 'You have already liked this story' });
    }

    // Add the user to the likes array of the story
    story.likes.push(userId);
    await story.save();

    // Add the story to the user's likedStories array
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.likedStories.push(storyId);
    await user.save();

    res.status(200).json({ message: 'Story liked successfully' });
  } catch (error) {
    console.error('Error liking story:', error);
    res.status(500).json({ message: 'Failed to like story' });
  }
};


const getLikedStories = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID and populate the likedStories field
    const user = await User.findById(userId).populate('likedStories');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.likedStories);
  } catch (error) {
    console.error('Error fetching liked stories:', error);
    res.status(500).json({ message: 'Failed to fetch liked stories' });
  }
};

const unlikeStory = async (req, res) => {
  try {
    const { userId, storyId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the story by ID
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Remove the story from the user's liked stories
    user.likedStories.pull(storyId);
    await user.save(); // Save the updated user document

    res.status(200).json({ message: 'Story unliked successfully' });
  } catch (error) {
    console.error('Error unliking story:', error);
    res.status(500).json({ message: 'Failed to unlike story' });
  }
};


const getStoryById = async (req, res) => {
  const { storyId } = req.params;

  try {
    const story = await Story.findById(storyId).populate('author', 'name');
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.status(200).json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ message: 'Failed to fetch story', error: error.message });
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
  likeStory,
  getLikedStories,
  unlikeStory,
  getStoryById,
  updateStory
};
