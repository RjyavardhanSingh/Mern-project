// src/models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String, default: '' },
  stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }], 
  updatedAt: { type: Date, default: Date.now },
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;
