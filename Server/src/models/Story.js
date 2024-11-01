// src/models/Story.js
const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 }, // Number of likes
  tags: { type: [String], default: [] } // Tags for categorization
});

const Story = mongoose.model('Story', storySchema);
module.exports = Story;
