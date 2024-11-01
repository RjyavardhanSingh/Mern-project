// src/models/Feed.js
const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }], // Array of story references
  interests: { type: [String], default: [] }, // Interests to filter stories
  createdAt: { type: Date, default: Date.now },
});

const Feed = mongoose.model('Feed', feedSchema);
module.exports = Feed;
