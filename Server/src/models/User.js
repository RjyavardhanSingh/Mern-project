// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  interests: { type: [String], default:[] },
  imageUrl: { type: String, default: '' },
  bio: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  likedStories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }] 
});

const User = mongoose.model('User', userSchema);
module.exports = User;
