const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  likes: {type: [mongoose.Schema.Types.ObjectId],ref: 'User',},
  tags: { type: [String], default: [] },
});

const Story = mongoose.model('Story', storySchema);
module.exports = Story;
